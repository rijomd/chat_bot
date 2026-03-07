export const StatusCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UN_AUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
    TIMEOUT: 504,
    BAD_GATEWAY: 502,
    FORBIDDEN: 403
}

export const Messages = {
    VALIDATION_ERROR: "data validation error",
    SUCCESS: "Success",
    UN_AUTHORIZED: "Authorization error",
    NOT_FOUND: "Data not found",
    FORBIDDEN: "Access denied",
    SERVER_ERROR: "Internal server error",
    PROTECTED_ROUTE: "This is a protected route",
    CONVERSATION_EXISTS: "Conversation already exists",
    REQUIRED: "Content required"
}

export const Endpoints = {
    LOGIN: "/api/user/login",
    SIGNUP: "/api/user/signup"
}

export const SESSION_STATUS = {
    LOADING: "loading",
    AUTHENTICATED: "authenticated",
    UN_AUTHENTICATED: "unauthenticated"
}

export const STORAGE_KEY = "app_remember_me";
export const TAB_CLOSING_KEY = "tab_closing";
export const TAB_OPEN_KEY = "tab_open";