
import { User } from "firebase/auth";

export interface IUser{
    email?: string,
    token?: string
}

export interface IContext extends User{
    // authenticate: (email: string, password: string) => Promise<void>;
    savedUser: (dadosUser: User) => void;
    logout: () => void;
}

export interface IAuthProvider{
    children: JSX.Element;
}