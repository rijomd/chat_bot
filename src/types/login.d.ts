
export type LoginDataType = { email: string, password: string, rememberMe: boolean };

export type SignInDataType =
    { email: string, password: string, name: string };

export type LoginCredentials =
    Record<"email" | "password", string> | undefined;

export type ResponseType =
    {
        data: any;
        message?: string;
        code?: number;
    }