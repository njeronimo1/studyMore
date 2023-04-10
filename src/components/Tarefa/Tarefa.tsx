import { Box, Button, Checkbox, Flex, Icon, Input, Progress, Spinner, Text, useToast } from "@chakra-ui/react";
import { collection, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

interface Tarefa_Props{
    objetivoId: string
}

import {AiOutlineDelete} from 'react-icons/ai';
import { BsCheck } from "react-icons/bs";
import { TarefaProps } from "../../@types/tarefa";
import { TarefaContext } from "../../contexts/Tarefa/TarefaContext";
import { app } from "../../services/firebaseAuth";

export function Tarefa({objetivoId} : Tarefa_Props){
    const[onCreateTarefa, setOnCreateTarefa] = useState(false);
    const [tarefa, setTarefa] = useState<TarefaProps[]>([]);
    const[titulo, setTitulo] = useState('');
    const toast = useToast();
    const[loadingComplete, setLoadingComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    

    const tarefaContext = useContext(TarefaContext);

    useEffect(() => {
        
        setTarefa(tarefaContext.tarefa);

        

        setTitulo('');
        setOnCreateTarefa(false);
        setLoadingComplete(false);
    }, [tarefaContext.tarefa]);

    useEffect(() => {
        let tarefas = tarefa.filter(t => t.objetivoId == objetivoId)

        let tarefaTotal = tarefas.length;
        let tarefasCompletas = tarefas.filter(t => t.isComplete == true).length;
        let progress_ = (tarefasCompletas / tarefaTotal) * 100;
        setProgress(Number(progress_.toFixed(0)));

    }, [tarefa]);

    async function handleCompleteTarefa(id: string, checked: boolean){
        setLoadingComplete(true);
        const editTarefa = await tarefaContext.handleEditTarefa(id, checked);
        
        if(editTarefa){
            setLoadingComplete(false);
        }else{
            toast({
                title: 'Falha ao atualizar',
                status: 'error',
                isClosable: true,
              })
            setLoadingComplete(false);
        }
        
    }

    async function handleCreateTarefa(){
        if(titulo !== '' && titulo.length >= 5){
            const create = await tarefaContext.handleCreateTarefa(titulo, objetivoId);

            setLoadingComplete(true);
        }else{
            toast({
                title: 'O campo precisa ter ao menos 5 caracteres',
                status: 'error',
                isClosable: true,
              })
        }
    }

    async function handleEditTarefa(id: string){
        setLoadingComplete(true);
        const excluir = tarefaContext.handleDeleteTarefa(id);

        if(excluir){

            // setLoadingComplete(false);
        }else{
            toast({
                title: 'Erro ao excluir, tente novamente',
                status: 'error',
                isClosable: true,
              })

            setLoadingComplete(false);
        }
    }


    return(
        <>
            
                
            
            <Flex w="100%" justifyContent="space-between" position="relative">
                <Flex direction="column" w="60%" gap="1">
                    <Text color="white" fontSize="15" fontWeight="600">Progresso: {progress > 0 ? progress : 0}%</Text>
                    <Progress colorScheme='blue' value={progress} />
                </Flex>
                {loadingComplete == true && (
                    <Spinner position="absolute" top="0.25rem" right="8.5rem" color="white"/>
                )}
                {onCreateTarefa && (<Button size="sm" bg="#f73627" color="white" _hover={{opacity:0.65}} onClick={() => setOnCreateTarefa(false)}>Cancelar</Button>)}
                {onCreateTarefa == false && (<Button size="sm" bg="#0097f9" color="white" _hover={{opacity:0.65}} onClick={() => setOnCreateTarefa(true)}>📝 Criar tarefa</Button>)}
            </Flex>

            <Flex direction="column" w="100%" gap="2" mt="4">

                {onCreateTarefa && (
                    <Flex bg="#3D3D3D" w="100%" borderRadius="12px" p="6">
                        <Flex w="100%"> 
                            <Flex w="10%" alignItems="center" justifyContent="flex-start">
                                <Checkbox size="lg" disabled />
                            </Flex>
                            <Flex w="75%" alignItems="flex-start" justifyContent="flex-start">
                                <Input type="text" fontWeight={500} borderRadius="6px"
                                value={titulo} onChange={(e) => setTitulo(e.target.value)}
                                 fontSize="15" color="white" placeholder="Digite a tarefa..." _placeholder={{color: 'white'}} size="sm" />
                            </Flex>
                            <Flex w="15%" alignItems="flex-start" justifyContent="flex-end">
                                <Button size="sm" bg="#0097f9" _hover={{opacity: 0.65}} onClick={handleCreateTarefa}>
                                    <Icon as={BsCheck} fontSize="25" color="white" />
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                )}
                
                {tarefa.map(t => {

                    return(
                        t.objetivoId == objetivoId ? 
                        <Flex bg="#3D3D3D" w="100%" borderRadius="12px" p="6" key={t.tarefaId}>
                            <Flex w="100%"> 
                                <Flex w="10%" alignItems="center" justifyContent="flex-start">
                                    <Checkbox size="lg" defaultChecked={t.isComplete == false ? false : true} onChange={(e) => {handleCompleteTarefa(t.tarefaId, e.target.checked)}}/>
                                </Flex>
                                <Flex w="75%" alignItems="flex-start" justifyContent="flex-start">
                                    <Text color="white" fontWeight={700} fontSize="15" textDecoration={t.isComplete == false ? '' : 'line-through'}>{t.titulo}</Text>
                                </Flex>
                                <Flex w="15%" alignItems="flex-start" justifyContent="flex-end">
                                    <Button size="sm" bg="#4D4D4D" _hover={{opacity: 0.65}} onClick={() => {handleEditTarefa(t.tarefaId)}}>
                                        <Icon as={AiOutlineDelete} fontSize="18" color="white"/>
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex> : <></>
                    )
                })}
                
            </Flex>
        </>
    )
}