
export type ICurrentUser = {
    isAuthenticated: false;
} | {
    isAuthenticated: true;

    id: number;

    name: string;

    avatar: { large: string };
}
