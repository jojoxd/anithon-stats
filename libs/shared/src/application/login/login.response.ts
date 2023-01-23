export interface LoginResponse
{
    access_token: string;

    // @TODO: Add refresh token
    refresh_token?: string;
}
