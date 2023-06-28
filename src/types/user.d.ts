type UserStateType = {
    user: User,
    setUser: (user: User) => void;
    getUser: () => User;
};
  
export interface User {
    authToken: string;
    sheetId: string;
    sheetUrl: string;
}

