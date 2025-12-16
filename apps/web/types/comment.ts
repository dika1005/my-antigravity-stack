// apps/web/types/comment.ts

/**
 * User yang berkomentar
 */
export interface CommentUser {
    id: string
    name: string | null
    avatar: string | null
}

/**
 * Single comment
 */
export interface Comment {
    id: string
    content: string
    createdAt: string
    user: CommentUser
    replies?: Comment[]
}

/**
 * Request untuk membuat komentar
 */
export interface CreateCommentRequest {
    content: string
    parentId?: string
}

/**
 * Response pagination
 */
export interface CommentPagination {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
}

/**
 * Response API untuk list komentar
 */
export interface CommentListResponse {
    success: boolean
    data: Comment[]
    pagination: CommentPagination
}

/**
 * Response API untuk single comment action
 */
export interface CommentActionResponse {
    success: boolean
    message: string
    data: Comment | null
}

/**
 * Props untuk komponen comment
 */
export interface CommentSectionProps {
    galleryId: string
    initialCount?: number
}
