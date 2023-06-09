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
    PopoverAnchor,
    Spinner,
    Stack, } from "@chakra-ui/react";
import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ObjetivoContext } from "../../contexts/Objetivos/ObjetivoContext";
import {useContext, useEffect, useState} from 'react';
import { ObjetivoProps } from "../../@types/objetivo";
import { useNavigate, useParams } from "react-router";
import { Tarefa } from "../../components/Tarefa/Tarefa";
import { CreateAnotacao } from "../../components/Anotacao/CreateAnotacao";
import { AnotacaoContext } from "../../contexts/Anotacao/AnotacaoContext";
import { AnotacaoProps } from "../../@types/anotacao";
import { TarefaContext } from "../../contexts/Tarefa/TarefaContext";
import { infoDetailObjetivo } from "../../@types/infoDetailObjetivo";
import { Link } from "react-router-dom";

export function DetailObjetivo(){

    const [objetivo, setObjetivo] = useState<ObjetivoProps[]>([])
    const [anotacoes, setAnotacoes] = useState<AnotacaoProps[]>([])
    const [anotacaoId, setAnotacaoId] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [infoDetailObjetivo, setInfoDetailObjetivo] = useState<infoDetailObjetivo[]>([]);
    const objetivoContext = useContext(ObjetivoContext);
    const anotacaoContext = useContext(AnotacaoContext);
    const tarefaContext = useContext(TarefaContext);
    const history = useNavigate();
    
    
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
        updateInfoObjetivo();
    }, [onClose]);

    async function updateInfoObjetivo(){
        await objetivoContext.getObjetivo();
    }

    useEffect(() => {
        let tarefas = tarefaContext.tarefa.filter(t => t.objetivoId === id);
        let tarefasCount = tarefas.filter(t => t.objetivoId === id).length;
        let tarefasCompletas = tarefas.filter(t => t.isComplete === true).length;
        let objetivo = objetivoContext.objetivo.filter(t => t.id_objetive === id);

        let dataInicio = new Date(objetivo[0]?.dataInicio);
        let dataInicioFormatada = new Date((dataInicio.getFullYear() + "-" + ((dataInicio.getMonth() + 1)) + "-" + (dataInicio.getDate() )));

        let dataFim    = new Date(objetivo[0]?.dataFim);
        let dataFimFormatada = new Date((dataFim.getFullYear() + "-" + ((dataFim.getMonth() + 1)) + "-" + (dataFim.getDate() )));


        const diffInMs   = Number(dataFimFormatada) - Number(dataInicioFormatada);
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
        
        let objeto = {
            totalTarefas: tarefasCount,
            tarefasCompletas: tarefasCompletas,
            terminoDoObjetivo: diffInDays,
        }
        setInfoDetailObjetivo([objeto]);

    },[tarefaContext.tarefa]);

    function handleVoltar(){
        var link = localStorage.getItem('linkPlanoEstudo');
        if(link) history(`/${link}`);
    }

    

    

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
                    <DrawerCloseButton color="white" onClick={updateInfoObjetivo}/>
                    <DrawerHeader color="white">Tarefas</DrawerHeader>

                    <DrawerBody>
                        <Tarefa objetivoId={objetivo[0]?.id_objetive}/>
                    </DrawerBody>

                    <DrawerFooter>
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Sidebar />
                <Flex p={["4", "4", "10"]} direction="column" w="100%" position="relative" >

                        <Button position="absolute" top="0.8rem" left={["1rem","1rem","2.5rem"]} size="sm" bg="black.100" color="white" _hover={{opacity:0.7}}
                        onClick={handleVoltar}>Voltar</Button>

                    {objetivo.length == 0 && (
                        <Stack w="100%" h="20rem" display="flex" alignItems="center" justifyContent="center">
                            <Spinner size='xl'
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.100'/>
                        </Stack>
                    )}

                    {objetivo.length == 1 && (
                        <>
                        <Flex w="100%" justifyContent="space-between" mt={["10", "10","5"]} direction="column" gap="2">
                        
                            <Text color="white" display="flex" alignItems="center" gap="2" fontSize="14">
                                <Text borderRadius="50%" bg={objetivo[0]?.statusObjetivo == "Aberto" ? "gray" 
                                : objetivo[0]?.statusObjetivo == "Em andamento" ? "yellow" : "green"} h="1rem" w="1rem"></Text> 
                                
                                {objetivo[0]?.statusObjetivo}
                            </Text>

                            <Header title={objetivo[0]?.titulo + " 📁"}  subtitle="Aqui você pode ver detalhes do seu objetivo, organizar suas tarefas e por último realizar anotações sobre o que você achar importante 😏"/>
                        </Flex>

                        <Flex w="100%" justifyContent="space-around" mt="6" direction={["column","column","initial"]} gap={["2","2",""]}>
                            <Flex direction="column" alignItems="center" justifyContent="center" w={["100%","100%","25%"]}  borderRadius="6px" p="2"
                            bg="black.100">
                                <Text color="whitesmoke" fontSize="20" fontWeight="500" >Total tarefas</Text>
                                <Text color="#999999" fontSize="35" fontWeight="600">{infoDetailObjetivo[0]?.totalTarefas}</Text>
                            </Flex>
                            <Flex direction="column" alignItems="center" justifyContent="center" w={["100%","100%","25%"]}  borderRadius="6px" p="2"
                            bg="black.100">
                                <Text color="whitesmoke" fontSize="20" fontWeight="500">Tarefas completas</Text>
                                <Flex alignItems="center" justifyContent="center" gap="2">
                                    <Text color="#999999" fontSize="35" fontWeight="600">{infoDetailObjetivo[0]?.tarefasCompletas}/{infoDetailObjetivo[0]?.totalTarefas}</Text>
                                </Flex>
                            </Flex>
                            <Flex direction="column" alignItems="center" justifyContent="center" w={["100%","100%","25%"]}   borderRadius="6px" p="2"
                            bg="black.100">
                                <Text color="whitesmoke" fontSize="20" fontWeight="500">Término do projeto em:</Text>
                                <Text color="#999999" fontSize="35" fontWeight="600">{infoDetailObjetivo[0]?.terminoDoObjetivo} dias</Text>
                            </Flex>
                        </Flex>
                        <Divider w="90%" mt="6"></Divider>
                        <Flex w="100%" gap="2" alignItems="center" mt="6" justifyContent="flex-start" wrap="wrap">
                            <Button size="sm" bg="#0097F9" borderRadius="12px" pr="3" pl="3" pt="2" pb="2"
                            _hover={{
                                opacity: 0.65
                            }}
                            onClick={() => {setOpenAnotacao(true)}}>
                                <Text fontSize={["11","11","16"]} color="white" fontWeight="600">✍️ Escrever uma anotação</Text>
                            </Button>

                            <Popover>
                                <PopoverTrigger>
                                <Button size="sm" bg="#0097F9" borderRadius="12px" pr="3" pl="3" pt="2" pb="2"
                                _hover={{
                                    opacity: 0.65
                                }} >
                                    <Text fontSize={["11","11","16"]} color="white" fontWeight="600" >📋 Visualizar uma anotação</Text>
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
                                <Text fontSize={["11","11","16"]} color="white" fontWeight="600">📝️ Visualizar as tarefas</Text>
                            </Button>
                        </Flex>
                        <Flex mt="6" w="100%">
                            <Flex w="100%" bg="white" borderRadius="12px" p="4" direction="column">
                                <Text fontSize="25">{objetivo[0]?.titulo}</Text>
                                <Box p="5" dangerouslySetInnerHTML={{ __html: objetivo[0]?.descricao}}></Box>
                            </Flex>
                        </Flex>
                        </>
                    )}
                    
                </Flex>
            </Flex>
        </>
    )
}