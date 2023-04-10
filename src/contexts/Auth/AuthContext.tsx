import { createContext } from "react"
import { User } from "../../@types/user";

export type AuthContextType = {
    user: User | null,
    signin: (email: string, password: string) => Promise<boolean>,
    signout: () => void,
    signup: (name: string, email: string, password: string) => Promise<boolean>,
    setUserLocalStorage: (userLocal: User) => void
}


export const AuthContext = createContext<AuthContextType>(null!);