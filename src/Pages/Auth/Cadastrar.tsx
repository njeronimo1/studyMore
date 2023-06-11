import { Box, Button,Text, Divider, Flex, Heading, Icon, Input, Toast, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth as AuthFirebase } from "../../services/firebaseAuth";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"

//imgs

import { GrLinkPrevious } from 'react-icons/gr';
import { useForm } from "react-hook-form";

const schema = z.object({
    nome: z.string().min(3, {message: "Nome precisa ter ao menos 3 caracteres!"}).max(25, {message: "Nome precisa ter no máximo 25 caracteres!"}),
    email: z.string({
        required_error: "Preencha o e-mail!"
    }).email({message: "Email precisa ser válido!"}),
    password: z.string().min(8, {message: "Senha precisa ter ao menos 8 caracteres!"}),
    confirmPassword: z.string().min(8, {message: "Senha precisa ter ao menos 8 caracteres!"})
})

type Form = z.infer<typeof schema>;

export function Cadastrar(){

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<Form>({
        resolver: zodResolver(schema)
    });
    const[errorPassword, setErrorPassword] = useState(false);
    const history = useNavigate();
    const toast = useToast();
    const auth = useContext(AuthContext);
    const[loading, setLoading] = useState(false);

    async function handleRegister(data:Form){
        if(data.confirmPassword !== data.password){
            setErrorPassword(true);
            return;
        }else{
            setErrorPassword(false);
        }
        setLoading(true);

        const userCreate = createUserWithEmailAndPassword(AuthFirebase, data.email, data.password).then(() =>{
            toast({
                title: 'Usuário criado com sucesso!.',
                status: 'success',
                isClosable: true,
              })

            setLoading(false);
            history('/');

            reset();
            return;
        }).catch((error) => {
            toast({
                title: 'Erro ao criar usuário, tente novamente.',
                status: 'error',
                isClosable: true,
              })
            
              setLoading(false);
            return;
        })
    }

    return(
        <>
        <Flex w="100%" height="100vh" alignItems="center" justifyContent="center">
            <Box position="relative" minWidth={["350px", "400px", "450px"]}  bg="black.100" p={["3","2","6"]} borderRadius="6" boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                <Heading textAlign="center" p="4" fontSize="25" color="white">Cadastre-se</Heading>
                <Box position="absolute" top={5} left={5}>
                    <Link to={'/'}>
                        <Text color="white" display="flex" gap={1} alignItems="center">
                            login</Text>
                    </Link>
                </Box>
                <form style={{width:'100%'}} onSubmit={handleSubmit(handleRegister)} >
                    <Flex direction="column" gap="4" mt="5" mb="5" p="4">
                        <Flex direction="column" gap="2">
                            <Text as="label" color="whitesmoke" fontWeight={600}>Nome</Text>
                            <Input type="text" bg="gray.200" placeholder="digite seu nome..." fontSize="13"
                            {...register("nome", { required: true, minLength: 6 })}
                            color="gray.100" data-testid="inputNome" autoComplete="false"></Input>


                            {/* //erros */}
                            {errors.nome?.message && <Text fontSize="14" color="red" fontWeight="500" data-testid="errorEmail"> {errors.nome?.message}</Text>}
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text as="label" color="whitesmoke"  fontWeight={600}>E-mail</Text>
                            <Input type="email" bg="gray.200" placeholder="digite seu email..." fontSize="13"
                             {...register("email", {required: true})} data-testid="inputEmail" autoComplete="false"></Input>


                            {/* //erros */}
                            {errors.email?.message && <Text fontSize="14" color="red" fontWeight="500"> {errors.email?.message}</Text>}
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text as="label" color="whitesmoke"  fontWeight={600}>Senha</Text>
                            <Input type="password" bg="gray.200" placeholder="digite sua senha..." fontSize="13"
                            {...register("password", {required: true, minLength: 8})} data-testid="inputSenha" autoComplete="false"></Input>


                            {/* //erros */}
                            {errors.password?.message && <Text fontSize="14" color="red" fontWeight="500"> {errors.password?.message}</Text>}
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text as="label" color="whitesmoke"  fontWeight={600}>Confirme sua senha</Text>
                            <Input type="password" bg="gray.200" placeholder="confirme sua senha..." fontSize="13"
                            {...register("confirmPassword", {required: true, minLength: 8})} data-testid="inputConfirmSenha" autoComplete="false"></Input>


                            {/* //erros */}
                            {errors.confirmPassword?.message && <Text fontSize="14" color="red" fontWeight="500"> {errors.confirmPassword?.message}</Text>}
                            {errorPassword && <Text fontSize="14" color="red" fontWeight="500"> As senhas precisam ser iguais! </Text>}
                        </Flex>
                        {loading ==false && (
                            <Button type="submit" bg="blue.100" color='white' mt="6" _hover={{
                            bg:'blue.300'
                            }}
                            data-testid="buttonEnviarCadastro">enviar</Button>
                        )}

                        {loading && (
                            <Button isLoading bg="blue.100" color='white' mt="6" _hover={{
                            bg:'blue.300'
                            }}
                            >enviar</Button>
                        )}
                        
                    </Flex>
                </form>
            </Box>
        </Flex>
        </>
    )
}