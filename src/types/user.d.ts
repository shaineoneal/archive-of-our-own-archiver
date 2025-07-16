type UserStateType = {
    user: () => User;
    setUser: (user: User) => void;
};

export interface User {
    authToken: string;
    sheetId?: string;
    sheetUrl?: string;
}
