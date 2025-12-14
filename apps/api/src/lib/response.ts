/**
 * Standard API Response Helpers
 */

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/** Success response */
export function success<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return { success: true, message, data };
}

/** Error response */
export function error(message: string, errorCode?: string): ApiResponse<null> {
    return { success: false, message, error: errorCode };
}

/** Paginated response */
export function paginate<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = "Success"
): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    return {
        success: true,
        message,
        data,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}

/** Common error responses */
export const notFound = (resource = "Resource") => error(`${resource} not found`, "NOT_FOUND");
export const unauthorized = (msg = "Unauthorized") => error(msg, "UNAUTHORIZED");
export const forbidden = (msg = "Forbidden") => error(msg, "FORBIDDEN");
export const badRequest = (msg = "Bad request") => error(msg, "BAD_REQUEST");
