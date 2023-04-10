import { apiLogin } from "../../services/apiLogin";
import { IUser } from "../../@types/firebaseAuth";

export function setUserLocalStorage (user: IUser | null) {
    localStorage.setItem('u', JSON.stringify(user));
}

export function getUserLocalStorage () {
    const json =localStorage.getItem('usuario');

    if(!json){
        return null;
    }

    const user = JSON.parse(json);

    return user ?? null;
}

export async function LoginRequest(email:string, password:string){
    try{
        const request = await apiLogin.post('login', {email, password});

        return request.data;


    }catch(e){
        return null;
    }
}