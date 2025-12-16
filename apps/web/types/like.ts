// apps/web/types/like.ts

/**
 * Response type dari API like action
 */
export interface LikeResponse {
  liked: boolean
  count: number
}

/**
 * API Response wrapper untuk like
 */
export interface LikeApiResponse {
  success: boolean
  message: string
  data: LikeResponse | null
}

/**
 * State untuk like pada komponen
 */
export interface LikeState {
  isLiked: boolean
  likeCount: number
  isLoading: boolean
}

/**
 * Target like - gallery atau image
 */
export type LikeTarget = 'gallery' | 'image'

/**
 * Props untuk komponen yang membutuhkan like functionality
 */
export interface LikeableProps {
  target: LikeTarget
  targetId: string
  initialLiked?: boolean
  initialCount?: number
}
