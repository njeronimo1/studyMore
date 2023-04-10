import { Box, Button, Divider, Flex, Heading, Icon, Input, Text, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import {FcGoogle} from "react-icons/fc"
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';


//login google
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as AuthLoginFirebase } from '../../services/firebaseAuth';
import { useAuth } from "../../contexts/AuthGoogle/useAuth";


export function Login(){

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const toast = useToast();
    const auth = useContext(AuthContext);
    const authLogin = useAuth();
    const history = useNavigate();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(AuthLoginFirebase);

    async function submitLogin(){
        if(email == "" || password == ""){
            toast({
                title: 'Preencha todos os campos antes de enviar!',
                status: 'error',
                isClosable: true,
              })

            return
        }

        // const logar = await auth.signin(email, password);
        const logar = await signInWithEmailAndPassword(email, password);
        // console.log(logar);

        if(logar != undefined){
            toast({
                title:"Logado com sucesso!",
                status: "success",
                isClosable: true
            })

            history('/home')
            return
        }else{
            toast({
                title: 'Email ou senha incorretos.',
                status: 'error',
                isClosable: true,
              })
            return;
        }
    }

    function handleGoogleLogin(){
        const provider = new GoogleAuthProvider();
        // console.log('Google');

        signInWithPopup(AuthLoginFirebase, provider).then((result)=>{
            authLogin.savedUser(result.user);
            toast({
                title: "Logado com sucesso!",
                status: "success",
                isClosable: true
            });
            history('/home');
        }).catch((error)=>{
            toast({
                title: error,
                status: "error",
                isClosable: true
            });
        });
    }

    return(
        <Flex w="100%" height="100vh" alignItems="center" justifyContent="center">
            <Box  minWidth="400px" bg="white" borderRadius="2" boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                <Heading textAlign="center" p="4" fontSize="25">Login</Heading>

                <Flex direction="column" gap="4" mt="5" p="4">
                    <Flex direction="column" gap="2">
                        <Text as="label" color="gray.400"
                        >E-mail</Text>
                        <Input type="email" placeholder="digite seu email..." fontSize="14"
                        onChange={(e)=> setEmail(e.target.value)}></Input>
                    </Flex>
                    <Flex direction="column" gap="2">
                    <Text as="label" color="gray.400">Senha</Text>
                        <Input type="password" placeholder="digite sua senha..." fontSize="14"
                        onChange={(e)=> setPassword(e.target.value)}></Input>
                    </Flex>
                    <Button bg="blue.100" color='white' _hover={{
                        bg:'blue.300'
                    }}
                    onClick={submitLogin}>enviar</Button>
                    <Box w="100%" textAlign="right">
                        <Link to={'/cadastrar'}>
                            <Button size="sm" fontWeight="500" color="gray.300" variant="unstyled" >cadastre-se</Button>
                        </Link>
                    </Box>
                    
                    <Divider></Divider>
                    <Flex w="100%" direction="column" justifyContent="center" alignItems="center" gap="4">
                        <Text color="#bebfc7" fontSize="13">ou realize o login com:</Text>
                        <Button bg="gray.50" boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                        _hover={{
                            opacity: 0.7
                        }}
                        onClick={handleGoogleLogin}>
                            <Icon as={FcGoogle} fontSize="20" />
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    )
}