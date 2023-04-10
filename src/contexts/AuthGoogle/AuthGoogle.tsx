

import React, {createContext, useEffect, useState} from "react";
import { User } from "firebase/auth";
import { getUserLocalStorage, setUserLocalStorage } from "./util";
import { IAuthProvider, IContext } from "../../@types/firebaseAuth";

export const AuthContextGoogle = createContext<IContext>({} as IContext);

export const AuthProviderGoogle = ({children}: IAuthProvider) =>{
    const [user, setUser] = useState<User>({} as User);

    useEffect(() =>{
        const user = getUserLocalStorage();

        if(user){
            setUser(user);
        }
        
    }, [])

    function savedUser(dadosUser: User){
        setUser(dadosUser);
        localStorage.setItem('usuario', JSON.stringify(dadosUser));
        
    }

    function logout(){
        setUser({} as User);
        setUserLocalStorage(null);
    }

    return (
        <AuthContextGoogle.Provider value={{ ...user, savedUser, logout }}>
            {children}
        </AuthContextGoogle.Provider>
    )
}