import { Box, Button,Text, Divider, Flex, Heading, Icon, Input, Toast, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth as AuthFirebase } from "../../services/firebaseAuth";

//imgs

import { GrLinkPrevious } from 'react-icons/gr';

export function Cadastrar(){

    const[name, setNome] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[passwordConfirmacao, setPasswordConfirm] = useState('');
    const history = useNavigate();
    const toast = useToast();
    const auth = useContext(AuthContext);
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(AuthFirebase);

     async function handleRegister(){
        if(name == "" || email == "" || password == "" || passwordConfirmacao == ""){
              toast({
                title: 'Preencha todos os campos antes de enviar!',
                status: 'error',
                isClosable: true,
              })
            return;
        }

        if(password !== passwordConfirmacao){
            toast({
                title: 'Senhas diferentes! confirme a senha corretamente.',
                status: 'error',
                isClosable: true,
              })

              return;
        }

        // console.log(name, email, password);
        // const userCreate = await auth.signup(name, email, password);
        const userCreate = createUserWithEmailAndPassword(email, password);
        
        if(!error){
            toast({
                title: 'Usuário criado com sucesso!.',
                status: 'success',
                isClosable: true,
              })

            history('/');
            return;
        }else{
            toast({
                title: 'Erro ao criar usuário, tente novamente.',
                status: 'error',
                isClosable: true,
              })
            return;
        }
    }

    return(
        <>
        <Flex w="100%" height="100vh" alignItems="center" justifyContent="center">
            <Box position="relative" minWidth="400px" bg="white" borderRadius="2" boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                <Heading textAlign="center" p="4" fontSize="25">Cadastre-se</Heading>
                <Box position="absolute" top={5} left={5}>
                    <Link to={'/'}>
                        <Text color="gray.300" display="flex" gap={1} alignItems="center">
                           <Icon as={GrLinkPrevious} color="gray.300" fontSize="15"/> login</Text>
                    </Link>
                </Box>
                <Flex direction="column" gap="4" mt="5" mb="5" p="4">
                    <Flex direction="column" gap="2">
                        <Text as="label" color="gray.400" fontWeight={600}>Nome</Text>
                        <Input type="email" placeholder="digite seu nome..." fontSize="13"
                        onChange={(e)=> setNome(e.target.value)}
                        color="gray.100"></Input>
                    </Flex>
                    <Flex direction="column" gap="2">
                        <Text as="label" color="gray.400"  fontWeight={600}>E-mail</Text>
                        <Input type="email" placeholder="digite seu email..." fontSize="13"
                        onChange={(e)=> setEmail(e.target.value)}></Input>
                    </Flex>
                    <Flex direction="column" gap="2">
                        <Text as="label" color="gray.400"  fontWeight={600}>Senha</Text>
                        <Input type="password" placeholder="digite sua senha..." fontSize="13"
                        onChange={(e)=> setPassword(e.target.value)}></Input>
                    </Flex>
                    <Flex direction="column" gap="2">
                        <Text as="label" color="gray.400"  fontWeight={600}>Confirme sua senha</Text>
                        <Input type="password" placeholder="confirme sua senha..." fontSize="13"
                        onChange={(e)=> setPasswordConfirm(e.target.value)}></Input>
                    </Flex>
                    <Button bg="blue.100" color='white' _hover={{
                        bg:'blue.300'
                    }}
                    onClick={handleRegister}>enviar</Button>
                </Flex>
            </Box>
        </Flex>
        </>
    )
}