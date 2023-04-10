import { Box, Divider, Flex, Text, Button, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor, } from "@chakra-ui/react";
import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ObjetivoContext } from "../../contexts/Objetivos/ObjetivoContext";
import {useContext, useEffect, useState} from 'react';
import { ObjetivoProps } from "../../@types/objetivo";
import { useParams } from "react-router";
import { Tarefa } from "../../components/Tarefa/Tarefa";
import { CreateAnotacao } from "../../components/Anotacao/CreateAnotacao";
import { AnotacaoContext } from "../../contexts/Anotacao/AnotacaoContext";
import { AnotacaoProps } from "../../@types/anotacao";
import { TarefaContext } from "../../contexts/Tarefa/TarefaContext";
import { infoDetailObjetivo } from "../../@types/infoDetailObjetivo";

export function DetailObjetivo(){

    const [objetivo, setObjetivo] = useState<ObjetivoProps[]>([])
    const [anotacoes, setAnotacoes] = useState<AnotacaoProps[]>([])
    const [anotacaoId, setAnotacaoId] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const[infoDetailObjetivo, setInfoDetailObjetivo] = useState<infoDetailObjetivo[]>([]);
    const objetivoContext = useContext(ObjetivoContext);
    const anotacaoContext = useContext(AnotacaoContext);
    const tarefaContext = useContext(TarefaContext);
    
    const [openAnotacao, setOpenAnotacao] = useState(false);
    const {id} = useParams();

    useEffect(() =>{
        
        setObjetivo(objetivoContext.objetivo.filter(obj => obj.id_objetive == id))

    }, [objetivoContext.objetivo]);

    useEffect(() => {
        let anotacoes_ = anotacaoContext.anotacao.filter(ant => ant.objetivoId === id);
        setAnotacoes(anotacoes_);
    }, [anotacaoContext.anotacao]);

    function handleOpenAnotacao(){
        setAnotacaoId('');
        setOpenAnotacao(false);
    }

    function handleOpenForEditAnotation(anotacaoId_: string){
        setAnotacaoId(anotacaoId_);
        setOpenAnotacao(true);
        
    }

    useEffect(() => {
        let tarefas = tarefaContext.tarefa.filter(t => t.objetivoId === id);
        let tarefasCount = tarefas.filter(t => t.objetivoId === id).length;
        let tarefasCompletas = tarefas.filter(t => t.isComplete === true).length;
        let objetivo = objetivoContext.objetivo.filter(t => t.id_objetive === id);

        let dataInicio = new Date(objetivo[0].dataInicio).getDate();
        let dataFim    = new Date(objetivo[0].dataFim).getDate();
        let diasParaTermino = (dataFim - dataInicio).toFixed(0);
        
        let objeto = {
            totalTarefas: tarefasCount,
            tarefasCompletas: tarefasCompletas,
            terminoDoObjetivo: Number(diasParaTermino)
        }
        setInfoDetailObjetivo([objeto]);

    },[tarefaContext.tarefa]);

    return(
        <>
            <Flex>
                <CreateAnotacao isOpenModal={openAnotacao} anotacaoId={anotacaoId} handleOpenAnotacao={handleOpenAnotacao} objetivoId={id}/>
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                    size="md"
                >
                    <DrawerOverlay />
                    <DrawerContent bg="#2F2F2F" borderTopLeftRadius="6px" borderBottomLeftRadius="6px">
                    <DrawerCloseButton color="white"/>
                    <DrawerHeader color="white">Tarefas</DrawerHeader>

                    <DrawerBody>
                        <Tarefa objetivoId={objetivo[0]?.id_objetive}/>
                    </DrawerBody>

                    <DrawerFooter>
                        {/* <Button colorScheme='blue'></Button> */}
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Sidebar />
                <Flex p="10" direction="column" w="100%">
                    <Flex w="100%" justifyContent="space-between">
                        <Header title={objetivo[0]?.titulo + " 📁"}  subtitle="Aqui você pode ver detalhes do seu objetivo, organizar suas tarefas e por último realizar anotações sobre o que você achar importante 😏"/>
                    </Flex>
                    <Flex w="100%" justifyContent="space-around" mt="6">
                        <Flex direction="column" alignItems="center" justifyContent="center" w="25%" bg="white" border="2px solid" borderColor="#BCBCBC" borderRadius="6px" p="2">
                            <Text color="black" fontSize="20" fontWeight="500">Total tarefas</Text>
                            <Text color="#999999" fontSize="35" fontWeight="600">{infoDetailObjetivo[0]?.totalTarefas}</Text>
                        </Flex>
                        <Flex direction="column" alignItems="center" justifyContent="center" w="25%" bg="white" border="2px solid" borderColor="#BCBCBC" borderRadius="6px" p="2">
                            <Text color="black" fontSize="20" fontWeight="500">Tarefas completas</Text>
                            <Flex alignItems="center" justifyContent="center" gap="2">
                                <Text color="#999999" fontSize="35" fontWeight="600">{infoDetailObjetivo[0]?.tarefasCompletas}/{infoDetailObjetivo[0]?.totalTarefas}</Text>
                            </Flex>
                        </Flex>
                        <Flex direction="column" alignItems="center" justifyContent="center" w="25%" bg="white" border="2px solid" borderColor="#BCBCBC" borderRadius="6px" p="2">
                            <Text color="black" fontSize="20" fontWeight="500">Término do projeto em:</Text>
                            <Text color="#999999" fontSize="35" fontWeight="600">{infoDetailObjetivo[0]?.terminoDoObjetivo} dias</Text>
                        </Flex>
                    </Flex>
                    <Divider w="90%" mt="6"></Divider>
                    <Flex w="100%" gap="2" alignItems="center" mt="6" justifyContent="flex-start">
                        <Button size="sm" bg="#0097F9" borderRadius="12px" pr="3" pl="3" pt="2" pb="2"
                        _hover={{
                            opacity: 0.65
                        }}
                        onClick={() => {setOpenAnotacao(true)}}>
                            <Text fontSize="16" color="white" fontWeight="600">✍️ Escrever uma anotação</Text>
                        </Button>

                        <Popover>
                            <PopoverTrigger>
                            <Button size="sm" bg="#0097F9" borderRadius="12px" pr="3" pl="3" pt="2" pb="2"
                            _hover={{
                                opacity: 0.65
                            }} >
                                <Text fontSize="16" color="white" fontWeight="600" >📋 Visualizar uma anotação</Text>
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Escolha uma anotação</PopoverHeader>
                                <PopoverBody>
                                    
                                    {
                                    anotacoes.length > 0 ?
                                    anotacoes.map(ant => {
                                        return(
                                            
                                            <Button variant="unstyled" key={ant.anotacaoId} _hover={{
                                                bg: '#0097f9',
                                                transition: '0.2s background ease-out',
                                                color: 'white'
                                            }} size="sm" w="100%" 
                                            onClick={() => {handleOpenForEditAnotation(ant.anotacaoId)}}>{ant.titulo}</Button>
                                        )
                                    }) : <Text>Ainda não tem anotações para exibir</Text>
                                }
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>


                        <Button size="sm" bg="#0097F9" borderRadius="12px" pr="3" pl="3" pt="2" pb="2"
                        _hover={{
                            opacity: 0.65
                        }} onClick={onOpen}>
                            <Text fontSize="16" color="white" fontWeight="600">📝️ Visualizar as tarefas</Text>
                        </Button>
                    </Flex>
                    <Flex mt="6" w="100%">
                        <Flex w="100%" bg="white" borderRadius="12px" p="4" direction="column">
                            <Text fontSize="25">{objetivo[0]?.titulo}</Text>
                            <Box p="5" dangerouslySetInnerHTML={{ __html: objetivo[0]?.descricao}}></Box>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}