import { useState } from "react";
import { User } from "../../@types/user";
import { useApi } from "../../hooks/useApi";
import { AuthContext } from "./AuthContext";


export function AuthProvider({children}: {children: JSX.Element}){

    const [user, setUser] = useState<User | null>(null);
    const api = useApi();

    async function signin(email: string, password: string){
        const data = await api.signin(email, password);

        if(data){
            if(data.user && data.token){
                setUser(data.user)
                setUserLocalStorage(data.user)
                setToken(data.token);
                return true
            }
        }

        return false;
    }

    async function signout(){
        
    }

    function setToken(token: string){
        localStorage.setItem('authToken', token);
    }

    async function signup(name:string, email: string, password: string){
        const data = api.signup(name, email, password);
        return true;
    }

    function setUserLocalStorage(userLocal: User){
        localStorage.setItem('usuario', JSON.stringify(userLocal));
    }

    return(
        <AuthContext.Provider value={{user, signin, signout, signup, setUserLocalStorage}}>
            { children }
        </AuthContext.Provider>
    )
}