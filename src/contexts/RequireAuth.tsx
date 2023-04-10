import { useContext } from "react"
import { Login } from "../Pages/Auth/Login";
import { AuthContext } from "./Auth/AuthContext";
import { AuthContextGoogle } from "./AuthGoogle/AuthGoogle";
// import { toast } from "react-toastify";

export const RequireAuth = ({ children }: {children: JSX.Element}) =>{

    const auth = useContext(AuthContext);
    const authGoogle = useContext(AuthContextGoogle); 

    if(!auth.user || !authGoogle.email){
        // toast.error('Você precisa estar logado para ter acesso a esta página.');
        return <Login />
    }

    return children
}