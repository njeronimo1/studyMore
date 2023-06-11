

import React, {createContext, useContext, useEffect, useState} from "react";
import { User } from "firebase/auth";
import { getUserLocalStorage, setUserLocalStorage } from "./util";
import { IAuthProvider, IContext } from "../../@types/firebaseAuth";
import { AuthContext } from "../Auth/AuthContext";

export const AuthContextGoogle = createContext<IContext>({} as IContext);

export const AuthProviderGoogle = ({children}: IAuthProvider) =>{
    const [user, setUser] = useState<User>({} as User);
    const auth = useContext(AuthContext);

    useEffect(() =>{
        const user = getUserLocalStorage();

        if(user){
            auth.setarUsuario(user);
        }
        
    }, [])

    function savedUser(dadosUser: User){
        // setUser(dadosUser);
        var object = {
            id: dadosUser.uid,
            name: dadosUser.displayName,
            email: dadosUser.email,
            password: '',
            apelido: '',
            sigla: '',
            imagem: ''
        }
        
        auth.setarUsuario(object);
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