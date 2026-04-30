// INTEREST TAXONOMY
// Each interest has: keywords (for bio extraction) and adjacent interests
// Adjacency philosophy: interests that naturally lead you into each other's world

export type Interest = {
  id: string
  label: string
  keywords: string[]
  adjacent: string[]  // IDs of adjacent interests
}

export const INTERESTS: Interest[] = [
  // LANGUAGES & CULTURE 
  {
    id: 'languages',
    label: 'Learning languages',
    keywords: ['language', 'languages', 'spanish', 'french', 'japanese', 'mandarin', 'arabic', 'portuguese', 'german', 'italian', 'korean', 'duolingo', 'linguistics', 'polyglot', 'fluent'],
    adjacent: ['travel', 'culture', 'reading', 'music', 'cooking', 'history'],
  },
  {
    id: 'travel',
    label: 'Travel',
    keywords: ['travel', 'traveling', 'travelling', 'backpacking', 'explorer', 'wanderlust', 'adventure', 'passport', 'abroad', 'world', 'countries', 'trips', 'flew', 'flight', 'nomad'],
    adjacent: ['languages', 'culture', 'photography', 'cooking', 'hiking', 'history'],
  },
  {
    id: 'culture',
    label: 'Culture & arts',
    keywords: ['culture', 'museum', 'gallery', 'exhibition', 'art', 'theatre', 'theater', 'opera', 'ballet', 'architecture', 'design', 'cultural'],
    adjacent: ['languages', 'travel', 'history', 'reading', 'music', 'photography'],
  },

  {
    id: 'hiking',
    label: 'Hiking & outdoors',
    keywords: ['hiking', 'hike', 'trails', 'nature', 'outdoors', 'camping', 'mountains', 'forest', 'national park', 'backpacking', 'wilderness', 'trekking'],
    adjacent: ['photography', 'travel', 'climbing', 'fitness', 'yoga', 'cooking'],
  },
  {
    id: 'climbing',
    label: 'Climbing',
    keywords: ['climbing', 'bouldering', 'rock climbing', 'gym', 'crags', 'routes', 'v-grade'],
    adjacent: ['hiking', 'fitness', 'yoga', 'travel'],
  },
  {
    id: 'cycling',
    label: 'Cycling',
    keywords: ['cycling', 'bike', 'biking', 'bicycle', 'road bike', 'mtb', 'mountain bike', 'cyclist'],
    adjacent: ['fitness', 'travel', 'hiking', 'running'],
  },
  {
    id: 'running',
    label: 'Running',
    keywords: ['running', 'runner', 'marathon', 'half marathon', '5k', '10k', 'jogging', 'trails'],
    adjacent: ['fitness', 'cycling', 'yoga', 'hiking'],
  },

  //CREATIVE 
  {
    id: 'photography',
    label: 'Photography',
    keywords: ['photography', 'photo', 'camera', 'photographer', 'film photography', 'analog', 'portraits', 'street photography', 'lightroom', 'darkroom'],
    adjacent: ['travel', 'art', 'film', 'hiking', 'culture'],
  },
  {
    id: 'writing',
    label: 'Writing',
    keywords: ['writing', 'writer', 'poetry', 'poet', 'journaling', 'blogging', 'fiction', 'screenplay', 'storytelling', 'prose', 'novelist'],
    adjacent: ['reading', 'languages', 'music', 'film', 'philosophy'],
  },
  {
    id: 'art',
    label: 'Visual art',
    keywords: ['art', 'painting', 'drawing', 'sketching', 'illustration', 'watercolor', 'acrylic', 'artist', 'printmaking', 'sculpting', 'pottery', 'ceramics'],
    adjacent: ['photography', 'culture', 'design', 'music', 'film'],
  },
  {
    id: 'design',
    label: 'Design',
    keywords: ['design', 'designer', 'ux', 'ui', 'graphic design', 'product design', 'typography', 'branding', 'figma', 'visual'],
    adjacent: ['art', 'photography', 'technology', 'writing', 'architecture'],
  },

  //  MUSIC
  {
    id: 'music',
    label: 'Music',
    keywords: ['music', 'musician', 'guitar', 'piano', 'drums', 'bass', 'singing', 'choir', 'band', 'producer', 'dj', 'vinyl', 'concerts', 'gigs', 'spotify', 'playlist'],
    adjacent: ['writing', 'dancing', 'culture', 'travel', 'languages'],
  },
  {
    id: 'dancing',
    label: 'Dancing',
    keywords: ['dancing', 'dance', 'salsa', 'bachata', 'ballroom', 'ballet', 'contemporary', 'swing', 'tango', 'lindy hop', 'hip hop dance'],
    adjacent: ['music', 'fitness', 'languages', 'culture', 'yoga'],
  },

  //  FOOD & DRINK 
  {
    id: 'cooking',
    label: 'Cooking',
    keywords: ['cooking', 'cook', 'chef', 'baking', 'baker', 'food', 'recipes', 'cuisine', 'kitchen', 'culinary', 'meal prep', 'sourdough', 'fermentation'],
    adjacent: ['travel', 'languages', 'culture', 'gardening', 'science'],
  },
  {
    id: 'food',
    label: 'Food & restaurants',
    keywords: ['foodie', 'restaurants', 'brunch', 'coffee', 'wine', 'craft beer', 'cocktails', 'tasting', 'michelin', 'ramen', 'sushi', 'eating'],
    adjacent: ['cooking', 'travel', 'culture', 'socializing'],
  },

  //  MIND 
  {
    id: 'reading',
    label: 'Reading',
    keywords: ['reading', 'books', 'reader', 'bookworm', 'library', 'fiction', 'nonfiction', 'novels', 'literature', 'philosophy', 'biography', 'sci-fi', 'fantasy', 'poetry'],
    adjacent: ['writing', 'languages', 'history', 'philosophy', 'film', 'culture'],
  },
  {
    id: 'philosophy',
    label: 'Philosophy & ideas',
    keywords: ['philosophy', 'ethics', 'epistemology', 'stoicism', 'existentialism', 'ideas', 'thinking', 'debate', 'intellectual', 'theory', 'discourse'],
    adjacent: ['reading', 'writing', 'history', 'science', 'psychology'],
  },
  {
    id: 'history',
    label: 'History',
    keywords: ['history', 'historical', 'ancient', 'medieval', 'wwii', 'archaeology', 'civilizations', 'empires', 'documentary', 'archives'],
    adjacent: ['reading', 'travel', 'languages', 'culture', 'philosophy'],
  },
  {
    id: 'science',
    label: 'Science & learning',
    keywords: ['science', 'biology', 'physics', 'chemistry', 'astronomy', 'research', 'data', 'math', 'engineering', 'neuroscience', 'psychology', 'curious', 'learning'],
    adjacent: ['technology', 'philosophy', 'reading', 'cooking', 'nature'],
  },
  {
    id: 'psychology',
    label: 'Psychology & self-growth',
    keywords: ['psychology', 'therapy', 'self-improvement', 'mindfulness', 'meditation', 'mental health', 'personal growth', 'journaling', 'habits', 'stoic'],
    adjacent: ['philosophy', 'yoga', 'writing', 'science', 'reading'],
  },

  // ── TECH ──
  {
    id: 'technology',
    label: 'Technology',
    keywords: ['tech', 'technology', 'coding', 'programming', 'software', 'developer', 'startup', 'ai', 'machine learning', 'open source', 'hacker', 'engineer'],
    adjacent: ['science', 'design', 'gaming', 'music', 'philosophy'],
  },
  {
    id: 'gaming',
    label: 'Gaming',
    keywords: ['gaming', 'gamer', 'video games', 'games', 'rpg', 'nintendo', 'playstation', 'xbox', 'steam', 'indie games', 'board games', 'dnd', 'tabletop'],
    adjacent: ['technology', 'film', 'writing', 'music', 'philosophy'],
  },

  // ── WELLNESS ──
  {
    id: 'yoga',
    label: 'Yoga & meditation',
    keywords: ['yoga', 'meditation', 'mindfulness', 'pilates', 'breathwork', 'spirituality', 'wellness', 'zen', 'retreat'],
    adjacent: ['fitness', 'psychology', 'hiking', 'dancing', 'philosophy'],
  },
  {
    id: 'fitness',
    label: 'Fitness & gym',
    keywords: ['fitness', 'gym', 'workout', 'weightlifting', 'crossfit', 'training', 'strength', 'athlete', 'sports', 'health'],
    adjacent: ['running', 'cycling', 'climbing', 'yoga', 'dancing'],
  },

  // ── NATURE ──
  {
    id: 'gardening',
    label: 'Gardening & plants',
    keywords: ['gardening', 'garden', 'plants', 'houseplants', 'flowers', 'growing', 'allotment', 'permaculture', 'botanical'],
    adjacent: ['cooking', 'science', 'hiking', 'photography', 'sustainability'],
  },
  {
    id: 'sustainability',
    label: 'Sustainability',
    keywords: ['sustainability', 'environment', 'climate', 'zero waste', 'veganism', 'vegan', 'plant-based', 'eco', 'green', 'renewable'],
    adjacent: ['gardening', 'cooking', 'travel', 'science', 'philosophy'],
  },

  // ── FILM & MEDIA ──
  {
    id: 'film',
    label: 'Film & cinema',
    keywords: ['film', 'movies', 'cinema', 'films', 'director', 'screenplay', 'documentary', 'criterion', 'arthouse', 'watching', 'series', 'tv shows'],
    adjacent: ['writing', 'photography', 'music', 'art', 'reading'],
  },
]

// Build lookup maps
const INTEREST_BY_ID = new Map<string, Interest>(INTERESTS.map(i => [i.id, i]))

//  EXTRACT INTERESTS FROM BIO
export function extractInterests(bio: string): string[] {
  if (!bio) return []
  const lower = bio.toLowerCase()
  const found: string[] = []

  for (const interest of INTERESTS) {
    const matched = interest.keywords.some(kw => lower.includes(kw))
    if (matched) found.push(interest.id)
  }

  return found
}

// ─── SCORE INTEREST COMPATIBILITY 
// Returns a score 0–30 and a list of match reasons
export function scoreInterestCompatibility(
  myBio: string,
  theirBio: string
): { score: number; reasons: string[]; type: 'exact' | 'adjacent' | 'none' } {
  const myInterests = extractInterests(myBio)
  const theirInterests = extractInterests(theirBio)

  if (myInterests.length === 0 || theirInterests.length === 0) {
    return { score: 0, reasons: [], type: 'none' }
  }

  const reasons: string[] = []
  let exactScore = 0
  let adjacentScore = 0
  const exactMatches: string[] = []
  const adjacentMatches: string[] = []

  // Check exact matches (same interest)
  for (const myId of myInterests) {
    if (theirInterests.includes(myId)) {
      const interest = INTEREST_BY_ID.get(myId)
      if (interest) {
        exactMatches.push(interest.label)
        exactScore += 8
      }
    }
  }

  // Check adjacent matches (complementary interests)
  for (const myId of myInterests) {
    const myInterest = INTEREST_BY_ID.get(myId)
    if (!myInterest) continue

    for (const adjId of myInterest.adjacent) {
      if (theirInterests.includes(adjId) && !myInterests.includes(adjId)) {
        const adjInterest = INTEREST_BY_ID.get(adjId)
        const myInterestLabel = myInterest.label
        const theirInterestLabel = adjInterest?.label ?? adjId

        // Only count each adjacent pair once
        const pairKey = [myId, adjId].sort().join('-')
        if (!adjacentMatches.includes(pairKey)) {
          adjacentMatches.push(pairKey)
          adjacentScore += 5
          reasons.push(`Your ${myInterestLabel} ↔ their ${theirInterestLabel}`)
        }
      }
    }
  }

  // Format exact match reasons
  if (exactMatches.length > 0) {
    reasons.unshift(`Both into: ${exactMatches.slice(0, 2).join(', ')}`)
  }

  const totalScore = Math.min(30, exactScore + adjacentScore)
  const type = exactMatches.length > 0 ? 'exact' : adjacentScore > 0 ? 'adjacent' : 'none'

  return { score: totalScore, reasons, type }
}

// GET INTEREST LABELS FOR DISPLAY
export function getInterestLabels(bio: string): string[] {
  return extractInterests(bio).map(id => INTEREST_BY_ID.get(id)?.label ?? id).slice(0, 5)
}
