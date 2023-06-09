import { useEffect, useState } from "react";
import { User } from "../../@types/user";
import { useApi } from "../../hooks/useApi";
import { AuthContext } from "./AuthContext";


export function AuthProvider({children}: {children: JSX.Element}){

    const [user, setUser] = useState<User | null>(null);
    const api = useApi();

    useEffect(() =>{
        const usuario = localStorage.getItem('usuario');
        if(usuario){

            let usuario_ = JSON.parse(usuario);
            // console.log(usuario_);
            
            var objetoUsuario = {
                id: usuario_.uid ? usuario_.uid : usuario_.id,
                name: usuario_.displayName ? usuario_.displayName : usuario_.name,
                email: usuario_.email,
                password: null,
                apelido: null,
                sigla: null,
                imagem: null,
            }

            setUser(objetoUsuario);
        }

    }, []);

    async function getUser(){
        const usuario = localStorage.getItem('usuario');
        // console.log(usuario);
        if(usuario){
            let usuario_ = JSON.parse(usuario);
            return usuario_;
        }

        return null;
    }

    async function signin(email: string){
        const data = await api.signin(email);

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
        localStorage.setItem('usuario', '');
        localStorage.setItem('authToken', '');
        setUser(null);
    }

    function setToken(token: string){
        localStorage.setItem('authToken', token);
    }

    async function signup(name:string, email: string, password: string){
        const data = api.signup(name, email, password);
        return true;
    }

    async function setUserLocalStorage(userLocal: User){
        await setUser(userLocal);
        await localStorage.setItem('usuario', JSON.stringify(userLocal));

        return true;
    }

    return(
        <AuthContext.Provider value={{user, signin, signout, signup, setUserLocalStorage, getUser}}>
            { children }
        </AuthContext.Provider>
    )
}