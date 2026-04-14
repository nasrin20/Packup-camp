export type CampingStyle = 'Car camping' | 'Backpacking' | 'Glamping' | 'Mixed'
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Any'
export type TripVibe = 'Chill' | 'Adventure' | 'Family' | 'Solo-friendly'
export type TripStatus = 'active' | 'full' | 'cancelled' | 'completed'
export type RequestStatus = 'pending' | 'approved' | 'declined'

export interface Profile {
  id: string
  full_name: string
  username: string | null
  avatar_url: string | null
  location: string | null
  state: string | null
  bio: string | null
  camping_style: CampingStyle | null
  experience_level: ExperienceLevel | null
  trips_completed: number
  verified: boolean
  created_at: string
}

export interface Trip {
  id: string
  host_id: string
  title: string
  location: string
  state: string
  latitude: number | null
  longitude: number | null
  start_date: string
  end_date: string
  spots_total: number
  spots_taken: number
  vibe: TripVibe
  experience_required: ExperienceLevel
  description: string
  tags: string[]
  distance_from_city: string | null
  gear_provided: string[]
  status: TripStatus
  created_at: string
  host?: Profile
}

export interface JoinRequest {
  id: string
  trip_id: string
  requester_id: string
  message: string | null
  status: RequestStatus
  created_at: string
  requester?: Profile
  trip?: Trip
}

export interface Message {
  id: string
  trip_id: string
  sender_id: string
  content: string
  is_system: boolean
  created_at: string
  sender?: Profile
}

export interface TripMember {
  id: string
  trip_id: string
  user_id: string
  joined_at: string
  profile?: Profile
}

export interface Review {
  id: string
  trip_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer?: Profile
  reviewee?: Profile
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Filter types for explore page
export interface TripFilters {
  state?: string
  vibe?: TripVibe
  experience?: ExperienceLevel
  startDate?: string
  spotsAvailable?: boolean
}
