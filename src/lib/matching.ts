import { supabase, Profile } from './supabase'

export async function getTodaysProfiles(userId: string, intention: string): Promise<Profile[]> {
  // Get IDs already swiped by this user
  const { data: swiped } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', userId)

  const swipedIds = swiped?.map(s => s.swiped_id) ?? []

  // Check daily swipe count
  const { data: daily } = await supabase
    .from('daily_swipes')
    .select('count')
    .eq('user_id', userId)
    .eq('swipe_date', new Date().toISOString().split('T')[0])
    .single()

  const usedToday = daily?.count ?? 0
  const remaining = Math.max(0, 5 - usedToday)

  if (remaining === 0) return []

  // Fetch profiles:
  // 1. Same intention
  // 2. Not yourself
  // 3. Not already swiped
  // 4. Chronological (oldest first — no engagement ranking)
  // 5. Limit to remaining daily allowance
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('intention', intention)
    .neq('id', userId)
    .order('created_at', { ascending: true })
    .limit(remaining)

  if (swipedIds.length > 0) {
    query = query.not('id', 'in', `(${swipedIds.join(',')})`)
  }

  const { data, error } = await query
  if (error) console.error('Error fetching profiles:', error)
  return data ?? []
}

export async function recordSwipe(
  swiperId: string,
  swipedId: string,
  action: 'connect' | 'pass'
): Promise<{ matched: boolean; matchId: string | null; error: string | null }> {
  // Insert the swipe
  const { error: swipeError } = await supabase
    .from('swipes')
    .insert({ swiper_id: swiperId, swiped_id: swipedId, action })

  if (swipeError) return { matched: false, matchId: null, error: swipeError.message }

  // Increment daily count
  await supabase.rpc('increment_daily_swipe', { user_uuid: swiperId })

  // Check if a match was created (trigger handles this, we just check)
  if (action === 'connect') {
    const a = [swiperId, swipedId].sort()[0]
    const b = [swiperId, swipedId].sort()[1]

    const { data: match } = await supabase
      .from('matches')
      .select('id')
      .eq('user_a', a)
      .eq('user_b', b)
      .single()

    if (match) return { matched: true, matchId: match.id, error: null }
  }

  return { matched: false, matchId: null, error: null }
}

export async function getMatches(userId: string) {
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error || !matches) return []

  // Fetch the other person's profile for each match
  const enriched = await Promise.all(matches.map(async (match) => {
    const otherId = match.user_a === userId ? match.user_b : match.user_a
    const { data: otherProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherId)
      .single()
    return { ...match, other_profile: otherProfile }
  }))

  return enriched
}

export async function getDailyRemaining(userId: string): Promise<number> {
  const { data } = await supabase
    .from('daily_swipes')
    .select('count')
    .eq('user_id', userId)
    .eq('swipe_date', new Date().toISOString().split('T')[0])
    .single()

  return Math.max(0, 5 - (data?.count ?? 0))
}
