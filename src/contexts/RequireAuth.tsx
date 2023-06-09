import { useContext, useEffect, useState } from "react"
import { Login } from "../Pages/Auth/Login";
import { AuthContext } from "./Auth/AuthContext";
import { AuthContextGoogle } from "./AuthGoogle/AuthGoogle";
import { Flex, useToast, Text, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

export const RequireAuth = ({ children }: {children: JSX.Element}) => {

    const auth = useContext(AuthContext);
    const authGoogle = useContext(AuthContextGoogle); 
    const history = useNavigate();
    const [user, setUser] = useState('');
    const [bloqAcesso, setBloqAcesso] = useState(false);

    // console.log(authGoogle.email);
    // console.log(children);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        setTimeout(() =>{
            if(user == ""){
                setBloqAcesso(true);
            }else{
                setBloqAcesso(false);
            }
        }, 5000);
    }, []);

    async function getUser(){
        var user_ = await auth.getUser();
        if(user_){
            setUser(user_.email);
        }
    }

    return(
        <>
        
            {user == "" && (
                <Flex w="100%" alignItems="center" height="100vh" justifyContent="center">
                        {bloqAcesso == false && (
                            <Spinner size='xl'
                                    thickness='6px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.100'/>
                        )}
                        
                        {bloqAcesso == true && (
                            <Text color="white" fontSize="30">Você precisa estar logado para ter acesso a essa página.</Text>
                        )}
                </Flex>
            )}
            {user !== "" && (
                children
            )}

        </>
    )

    
}