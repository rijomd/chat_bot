
export const StatusCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UN_AUTHORIZED: 401,
    NOT_FOUND: 404
}

export const Messages = {
    VALIDATION_ERROR: "data validation error",
    SUCCESS: "Success",
    UN_AUTHORIZED: "Authorization error",
    NOT_FOUND: "Data not found",
    FORBIDDEN: "Access denied",
    SERVER_ERROR: "Internal server error",
    PROTECTED_ROUTE: "This is a protected route"
}

export const Endpoints = {
    LOGIN: "/api/user/login",
    SIGNUP: "/api/user/signup"
}

export const SESSION_CONSTANTS = {
    LOADING: "loading",
    AUTHENTICATED: "authenticated",
    UN_AUTHENTICATED: "unauthenticated"

}