import { supabase, Profile } from './supabase'
import { scoreInterestCompatibility } from './interests'

// ─── SCORE BREAKDOWN ────────────────────────────────────────────────────────
export type ScoreBreakdown = {
  total: number
  ageRange: number
  interestScore: number
  interestType: 'exact' | 'adjacent' | 'none'
  mutualInterest: number
  recency: number
  completeness: number
  responseRate: number
  readiness: number
  reasons: string[]
}

export type ScoredProfile = Profile & {
  score: ScoreBreakdown
}

// ─── MAIN ENTRY POINT ───────────────────────────────────────────────────────
export async function getTodaysProfiles(
  userId: string,
  myProfile: Profile
): Promise<ScoredProfile[]> {
  const remaining = await getDailyRemaining(userId)
  if (remaining === 0) return []

  const { data: swiped } = await supabase
    .from('swipes').select('swiped_id').eq('swiper_id', userId)
  const swipedIds = swiped?.map(s => s.swiped_id) ?? []

  let query = supabase
    .from('profiles').select('*')
    .eq('intention', myProfile.intention)
    .neq('id', userId)

  if (swipedIds.length > 0) {
    query = query.not('id', 'in', `(${swipedIds.join(',')})`)
  }

  const { data: candidates, error } = await query
  if (error || !candidates) return []

  // Collect bios of people this user has connected with (for mutual signal)
  const { data: myConnects } = await supabase
    .from('swipes').select('swiped_id').eq('swiper_id', userId).eq('action', 'connect')
  const myConnectIds = myConnects?.map(s => s.swiped_id) ?? []
  const { data: connectedProfiles } = myConnectIds.length > 0
    ? await supabase.from('profiles').select('bio').in('id', myConnectIds)
    : { data: [] }
  const connectedBios = (connectedProfiles ?? []).map(p => p.bio ?? '').join(' ')

  const scored: ScoredProfile[] = candidates
    .filter(c => passesHardFilters(c, myProfile))
    .map(c => ({ ...c, score: scoreCandidate(c, myProfile, connectedBios) }))

  scored.sort((a, b) => b.score.total - a.score.total)
  return scored.slice(0, remaining)
}

// ─── HARD FILTERS ───────────────────────────────────────────────────────────
function passesHardFilters(candidate: Profile, me: Profile): boolean {
  if (me.looking_for && me.looking_for !== 'everyone') {
    if (candidate.gender !== me.looking_for) return false
  }
  if (candidate.looking_for && candidate.looking_for !== 'everyone') {
    if (me.gender !== candidate.looking_for) return false
  }
  return true
}

// ─── SCORING ────────────────────────────────────────────────────────────────
function scoreCandidate(
  candidate: Profile,
  me: Profile,
  connectedBios: string
): ScoreBreakdown {
  const reasons: string[] = []
  let total = 0

  // 1. AGE RANGE (0–15pts)
  const myMin = (me as any).age_min ?? 18
  const myMax = (me as any).age_max ?? 99
  const theirMin = (candidate as any).age_min ?? 18
  const theirMax = (candidate as any).age_max ?? 99
  const ageMatch = candidate.age >= myMin && candidate.age <= myMax && me.age >= theirMin && me.age <= theirMax
  const ageRange = ageMatch ? 15 : (candidate.age >= myMin && candidate.age <= myMax) ? 8 : 0
  total += ageRange
  if (ageRange === 15) reasons.push("Within each other's age range")
  else if (ageRange === 8) reasons.push('Within your age range')

  // 2. INTEREST GRAPH (0–30pts)
  // Scores both exact matches and adjacent/complementary interests
  const interestResult = scoreInterestCompatibility(me.bio ?? '', candidate.bio ?? '')
  const interestScore = interestResult.score
  total += interestScore
  reasons.push(...interestResult.reasons.slice(0, 2))

  // 3. MUTUAL INTEREST SIGNAL (0–15pts)
  // Does this candidate share interests with people you've already connected with?
  const mutualResult = scoreInterestCompatibility(connectedBios, candidate.bio ?? '')
  const mutualInterest = Math.min(15, Math.round(mutualResult.score * 0.5))
  total += mutualInterest
  if (mutualInterest > 7) reasons.push("Similar to people you've connected with")

  // 4. RECENCY (0–15pts)
  const lastActive = new Date((candidate as any).last_active ?? candidate.created_at)
  const daysSince = (Date.now() - lastActive.getTime()) / 86400000
  const recency = daysSince < 1 ? 15 : daysSince < 3 ? 12 : daysSince < 7 ? 8 : daysSince < 14 ? 4 : 0
  total += recency
  if (recency >= 12) reasons.push('Recently active')

  // 5. PROFILE COMPLETENESS (0–10pts)
  const completeness = (candidate.avatar_url ? 5 : 0) + (candidate.bio && candidate.bio.length > 20 ? 3 : 0) + (candidate.location ? 2 : 0)
  total += completeness
  if (completeness >= 8) reasons.push('Complete profile')

  // 6. RESPONSE RATE (0–10pts)
  const rate = (candidate as any).response_rate ?? 1.0
  const responseRate = Math.round(rate * 10)
  total += responseRate
  if (rate >= 0.8) reasons.push('Responds to messages')

  // 7. RELATIONSHIP READINESS (0–5pts)
  const myReadiness = (me as any).relationship_readiness ?? 3
  const theirReadiness = (candidate as any).relationship_readiness ?? 3
  const readiness = Math.abs(myReadiness - theirReadiness) === 0 ? 5 : Math.abs(myReadiness - theirReadiness) === 1 ? 3 : 1
  total += readiness
  if (readiness >= 4) reasons.push('Similar relationship readiness')

  return { total, ageRange, interestScore, interestType: interestResult.type, mutualInterest, recency, completeness, responseRate, readiness, reasons }
}

// ─── RECORD SWIPE ───────────────────────────────────────────────────────────
export async function recordSwipe(
  swiperId: string,
  swipedId: string,
  action: 'connect' | 'pass'
): Promise<{ matched: boolean; matchId: string | null; error: string | null }> {
  const { error: swipeError } = await supabase
    .from('swipes')
    .insert({ swiper_id: swiperId, swiped_id: swipedId, action })

  if (swipeError) return { matched: false, matchId: null, error: swipeError.message }

  await supabase.rpc('increment_daily_swipe', { user_uuid: swiperId })

  if (action === 'connect') {
    const a = [swiperId, swipedId].sort()[0]
    const b = [swiperId, swipedId].sort()[1]
    const { data: match } = await supabase
      .from('matches').select('id').eq('user_a', a).eq('user_b', b).single()
    if (match) return { matched: true, matchId: match.id, error: null }
  }

  return { matched: false, matchId: null, error: null }
}

// ─── GET MATCHES ─────────────────────────────────────────────────────────────
export async function getMatches(userId: string) {
  const { data: matches, error } = await supabase
    .from('matches').select('*')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error || !matches) return []

  return Promise.all(matches.map(async (match) => {
    const otherId = match.user_a === userId ? match.user_b : match.user_a
    const { data: otherProfile } = await supabase
      .from('profiles').select('*').eq('id', otherId).single()
    return { ...match, other_profile: otherProfile }
  }))
}

// ─── DAILY REMAINING ─────────────────────────────────────────────────────────
export async function getDailyRemaining(userId: string): Promise<number> {
  const { data } = await supabase
    .from('daily_swipes').select('count')
    .eq('user_id', userId)
    .eq('swipe_date', new Date().toISOString().split('T')[0])
    .single()
  return Math.max(0, 5 - (data?.count ?? 0))
}
