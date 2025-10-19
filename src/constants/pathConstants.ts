
export const DEFAULT_PATH = "/";

export const urlPaths = {
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: "/",
}

// Specify which routes to protect
export const config = {
    matcher: [
        "/profile/:path*",
        urlPaths.LOGIN,
        urlPaths.SIGNUP,
    ],
};