import { Box, Button, Divider, Flex, Heading, Icon, Img, Input, Text, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import {FcGoogle} from "react-icons/fc"
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';


//login google
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as AuthLoginFirebase } from '../../services/firebaseAuth';
import { useAuth } from "../../contexts/AuthGoogle/useAuth";

//img
import logoStudy from '../../assets/studyMore/logo_comfundo250.png'


export function Login(){

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const toast = useToast();
    const auth = useContext(AuthContext);
    const authLogin = useAuth();
    const history = useNavigate();

    async function submitLogin(){
        if(email == "" || password == ""){
            toast({
                title: 'Preencha todos os campos antes de enviar!',
                status: 'error',
                isClosable: true,
              })

            return
        }

        const logar = await signInWithEmailAndPassword(AuthLoginFirebase,email, password).then(async (data) => {
            const setUser = await auth.setUserLocalStorage({
                id: data.user.uid,
                name: data.user.email,
                email: data.user.email
            });

            if(setUser){
                const login = await auth.signin(email);
                // console.log(login);

                if(login){
                    toast({
                        title:"Logado com sucesso!",
                        status: "success",
                        isClosable: true
                    })
    
                    history('/home')
                }

                return
            }
        })
        .catch(err => {
            toast({
                title: 'Email ou senha incorretos.',
                status: 'error',
                isClosable: true,
              })
            return;
        });
    }

    function handleGoogleLogin(){
        const provider = new GoogleAuthProvider();

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
            <Box  minWidth={["350px", "400px", "450px"]} bg="black.100" p={["3","2","6"]} borderRadius="6" boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                {/* <Text textAlign="center" p={["1","2","4"]} fontSize="25" fontWeight="400" color="white">
                    Bem vindo ao <Text color="blue.100" fontWeight="800">StudyMore</Text>
                    
                    </Text> */}
                    <Flex w="100%" align="center" justify="center" h="8.5rem" direction="column">
                        <Img src={logoStudy} />
                        
                    </Flex>
                    <Flex w="100%" align="center" justify="center" direction="column">
                        <Text color="white" textAlign="center" fontSize="1.15rem" fontWeight="600" >Login</Text> 
                        {/* <Divider />    */}
                    </Flex>

                <Flex direction="column" gap="4" mt="5" p="4">
                    <Flex direction="column" gap="2">
                        <Text as="label" color="whitesmoke"
                        >E-mail</Text>
                        <Input type="email" bg="gray.200" border="none" data-testid="inputEmail" placeholder="digite seu email..." fontSize="14"
                        onChange={(e)=> setEmail(e.target.value)}></Input>
                    </Flex>
                    <Flex direction="column" gap="2">
                    <Text as="label" color="whitesmoke">Senha</Text>
                        <Input type="password" bg="gray.200" border="none" data-testid="inputSenha" placeholder="digite sua senha..." fontSize="14"
                        onChange={(e)=> setPassword(e.target.value)}></Input>
                    </Flex>
                    <Button bg="blue.100" color='white' _hover={{
                        bg:'blue.300'
                    }}
                    onClick={submitLogin}>entrar</Button>
                    <Box w="100%" textAlign="right">
                        <Link to={'/cadastrar'}>
                            <Button size="sm" fontWeight="600" color="white" variant="unstyled" _hover={{ opacity:0.7 }}>cadastre-se</Button>
                        </Link>
                    </Box>
                    
                    <Divider></Divider>
                    <Flex w="100%" direction="column" justifyContent="center" alignItems="center" gap="4">
                        <Text color="whitesmoke" fontSize="13">ou realize o login com:</Text>
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