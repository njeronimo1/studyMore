import { useContext } from "react";
import { AuthContextGoogle } from "./AuthGoogle";

export const useAuth = () => {
    const context = useContext(AuthContextGoogle);

    return context;
}