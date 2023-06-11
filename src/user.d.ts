// @types.user.ts

export type UserType = {
    email: string | null;
    authToken: string | null;
    sheetURL: string | null;
}

export type UserStateType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}