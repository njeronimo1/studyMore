import { Box, Flex, Progress, Table, TableContainer, Tbody, Text, Th, Thead, Tr, Td, Icon , TableCaption,
    Tfoot,
    Stack,
    Spinner,
    Button,
    useToast, } from "@chakra-ui/react";
import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";


import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { app } from "../../services/firebaseAuth";
import { PlanosEstudoContext } from "../../contexts/PlanosEstudo/PlanosEstudoContext";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

//imgs
import {AiOutlineEdit} from 'react-icons/ai';
import {AiOutlineDelete} from 'react-icons/ai';
import {BiLinkExternal} from 'react-icons/bi';
import {GiStairsGoal} from 'react-icons/gi';
import { CreateObjetive } from "./CreateObjetive";
import { ObjetivoContext } from "../../contexts/Objetivos/ObjetivoContext";
import { ObjetivoProps } from "../../@types/objetivo";




export function DetailPlanoEstudo(){

    const planoContext = useContext(PlanosEstudoContext);
    const objetivoContext = useContext(ObjetivoContext);
    const[objetivoId, setObjetivoId] = useState('');
    const { id } = useParams();
    const toast = useToast();
    const[loading, setLoading] = useState(false);
    const[isOpenModal, setIsOpenModal] = useState(false);
    const[objetivoFilter, setObjetivoFilter] = useState<ObjetivoProps[]>([]);
    
    function handleOpenModal(){
        setIsOpenModal(false);
        setObjetivoId('');
        setObjetivoFilter(objetivoContext.objetivo);
    }

    useEffect(() => {
        planoContext.searchPlanoForId(id);
    }, [id]);

    useEffect(() => {
        setObjetivoFilter(objetivoContext.objetivo);
    }, [objetivoContext.objetivo]);

    function handleOpenToIdObjetivo(objetivoId: string){
        setObjetivoId(objetivoId);
        setIsOpenModal(true);
    }

    async function handleDeleteObjetivo(objetivoId: string){
        const delete_ = await objetivoContext.deleteObjetivo(objetivoId);
        if(delete_){
            toast({
                title: 'Objetivo excluido com sucesso!',
                status: 'success',
                isClosable: true,
              })
        }
    }

    return(
        <>
        <CreateObjetive isOpenModal={isOpenModal} handleOpenModal={handleOpenModal} objetivoId={objetivoId} planoEstudoId={id}/>
        <Flex>
            <Sidebar />
            <Flex p="10" direction="column" w="100%">
                <Flex w="100%" justifyContent="space-between">
                <Header title={planoContext.planosEstudoDetail[0]?.name + " 📁"}  subtitle="Aqui você tem o acompanhamento do seu plano, também pode criar objetivos para ele."/>
                <Button onClick={() => setIsOpenModal(true)}>
                    <Icon as={GiStairsGoal} fontSize="17" mr="2"/>
                    Criar novo objetivo</Button>
                </Flex>
                {/* <Flex mt="5" w="100%" bg="white" borderRadius="6" p="4" gap="6">
                    <Box w="60%" >
                        <Text fontSize="17" fontWeight="600">Porcentagem de conclusão de seu plano de estudo: 20%</Text>
                        <Box mt="4">
                            <Progress mt="1" value={20} size='lg' colorScheme='blue' />
                        </Box>
                        <Box textAlign="left" mt="3">
                            <Text fontSize="16" color="gray.300" fontWeight="400" display="flex" alignItems="center" gap="2">Total de objetivos cadastrados: 
                            <Text fontSize="17" color="blue.principal" fontWeight="600">12</Text></Text>
                            
                        </Box>
                        <Box textAlign="left">
                            <Text fontSize="16" fontWeight="400" color="gray.300" display="flex" alignItems="center" gap="2">Total de objetivos concluídos: 
                            <Text fontSize="17" color="blue.principal" fontWeight="600">3</Text></Text>
                        </Box>
                    </Box>
                    <Box w="40%">
                        <Text fontSize="17" textAlign="center" fontWeight="600">Relação entre objetivos abertos, concluídos e em andamento</Text>
                        <Chart options={options} series={series} type="donut" height={150}/>
                    </Box>
                </Flex> */}

                <Flex w="100%" bg="white" borderRadius="6" p="4" mt="5" position="relative">
                {objetivoFilter.length > 0 ? 
                    
                    <TableContainer w="100%">
                        <Table variant='simple'>
                            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                            <Thead>
                                <Tr>
                                    <Th>Titulo</Th>
                                    <Th>Real objetivo</Th>
                                    <Th>Data inicio</Th>
                                    <Th>Data Fim</Th>
                                    <Th>Editar</Th>
                                    <Th>Excluir</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {objetivoFilter.map(obj => {
                                    return(
                                        obj.planoEstudoId == id ? 
                                            <Tr key={obj.id_objetive}>
                                    
                                            <Link to={`/objetivo/${obj.id_objetive}`}>
                                                <Td display="flex" alignItems="center" gap="2" fontWeight="600" cursor="pointer"
                                                _hover={{ opacity: 0.65}}>
                                                    
                                                    {obj.titulo}
                                                <Icon as={BiLinkExternal} fontSize="18"/></Td>
                                            </Link>

                                            <Td>{obj.texto_chave}</Td>
                                            <Td>{obj.dataInicio}</Td>
                                            <Td>{obj.dataFim}</Td>
                                            
                                            <Th><Icon as={AiOutlineEdit} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                            onClick={() => handleOpenToIdObjetivo(obj.id_objetive)}/></Th>
                                            

                                            <Th position="relative">
                                                <Icon as={AiOutlineDelete} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                                    onClick={() => handleDeleteObjetivo(obj.id_objetive)} />
                                                    
                                            </Th>
                                        </Tr>
                                        : <></>
                                    )
                                })}
                                
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th>Reservado</Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                
                : <Stack w="100%" h="20rem" display="flex" alignItems="center" justifyContent="center">
                        <Spinner size='xl'
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.principal'/>
                    </Stack>}
                
                            </Flex>
            </Flex>
        </Flex>
        </>
    )
}