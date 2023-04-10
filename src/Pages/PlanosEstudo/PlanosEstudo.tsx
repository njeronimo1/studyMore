import { Box, Button, Flex, Icon, Input, InputGroup, InputLeftElement,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, 
    Stack,
    Spinner, } from "@chakra-ui/react";

import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import  {collection, deleteDoc, doc, getDocs, getFirestore} from "firebase/firestore"

import {BsSearch} from 'react-icons/bs';
import {BsClipboardPlus} from 'react-icons/bs';
import {AiOutlineEdit} from 'react-icons/ai';
import {AiOutlineDelete} from 'react-icons/ai';
import {BiLinkExternal} from 'react-icons/bi';
import {TbReload} from 'react-icons/tb';



import { CreatePlanoEstudo } from "./CreatePlanoEstudo";
import { useContext, useEffect, useState } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { app } from "../../services/firebaseAuth";
import { Link } from "react-router-dom";
import { PlanosEstudoContext } from "../../contexts/PlanosEstudo/PlanosEstudoContext";


export function PlanosEstudo(){

    const [planosEstudo, setPlanosEstudo] = useState<PlanosEstudoProps[]>([]);
    const[loading, setLoading] = useState(false);
    const [planosEstudoFilter, setPlanosEstudoFilter] = useState<PlanosEstudoProps[]>([]);
    const[isOpenModal, setIsOpenModal] = useState(false);
    const[search, setSearch] = useState('');

    //informações para modal de edição
    const [planosEstudoActive, setPlanosEstudoActive] = useState<PlanosEstudoProps[]>([]);


    ///Contexto do plano de estudos
    const planoContext = useContext(PlanosEstudoContext);

    function handleOpenModal(){
        planoContext.getUser();
        planoContext.resetPlanoActive();
        setIsOpenModal(false)
    }

    useEffect(() => {
        
        setPlanosEstudoFilter(planoContext.planosEstudo);
        
        
    }, [planoContext.planosEstudo]);

    async function handleDeletePlano(id: string){
        await planoContext.handleDeletePlano(id);
    }

    async function handleEditPlano(id: string){
        await planoContext.handleEditPlano(id);
        setIsOpenModal(true);
    }

    useEffect(() => {

        if(search.length > 0){
            let planoEstudo = planoContext.planosEstudo.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.objetive.toLowerCase().includes(search.toLowerCase()));
            setPlanosEstudoFilter(planoEstudo);
        }else{
            setPlanosEstudoFilter(planoContext.planosEstudo);
        }

    }, [search]);

    async function reload(){
        setLoading(true);
        setPlanosEstudo([]);
        setPlanosEstudoFilter([]);

        await planoContext.getUser();
        
        setPlanosEstudo(planoContext.planosEstudo);
        setPlanosEstudoFilter(planoContext.planosEstudo);
        
        setLoading(false);
    }

    return(
        <>
            <CreatePlanoEstudo isOpenModal={isOpenModal} handleOpenModal={handleOpenModal} planoEstudo={planoContext.planosEstudoActive}/>
            <Flex >
                <Sidebar />
                <Flex p="10" direction="column" w="100%">
                    <Header title="Planos de estudo 📁" subtitle="Aqui você pode ver, editar, excluir ou cadastrar seus planos"></Header>
                    
                    <Flex justifyContent="space-between" w="100%" mt="5">
                        <Box w="50%">
                            <InputGroup  bg="#e9e9ef">
                                <InputLeftElement
                                    // w="50%" 
                                    pointerEvents='none'
                                    children={<Icon as={BsSearch} fontSize="18" color='gray.300' />}
                                    />
                                <Input type='text' placeholder='Pesquise por nome' 
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputGroup>
                        </Box>
                        <Flex w="50%" alignItems="flex-end" justifyContent="flex-end">
                            <Button display="flex" gap="3" bg="#e9e9ef" onClick={() => setIsOpenModal(true)}>
                                Criar novo plano
                                <Icon as={BsClipboardPlus} fontSize="20"/>
                            </Button>
                        </Flex>
                    </Flex>

                    <Flex w="100%" bg="white" borderRadius="6" p="4" mt="5" position="relative">
                        <Icon as={TbReload} fontSize="20" position="absolute" top="1rem" right="1rem" onClick={reload} cursor="pointer" 
                        _hover={{ opacity:0.65 }}/>
                        
                        
                        {planosEstudoFilter.length > 0 ?
                            <TableContainer w="100%">
                                <Table variant='simple'>
                                    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                                    <Thead>
                                        <Tr>
                                            <Th>Nome</Th>
                                            <Th>Objetivo</Th>
                                            <Th>Data criação</Th>
                                            <Th>Editar</Th>
                                            <Th>Excluir</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        
                                        {
                                            
                                            planosEstudoFilter.map(p => {
                                                    return(
                                                        <Tr key={p.id}>
                                                            
                                                            <Link to={`/planos-estudo/${p.id}`}>
                                                                <Td display="flex" alignItems="center" gap="2" fontWeight="600" cursor="pointer"
                                                                _hover={{ opacity: 0.65}}>
                                                                    
                                                                    {p.name} 
                                                                <Icon as={BiLinkExternal} fontSize="18"/></Td>
                                                            </Link>
        
                                                            <Td>{p.objetive}</Td>
                                                            <Td>{p.date_create}</Td>
                                                            <Th><Icon as={AiOutlineEdit} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                                            onClick={() => handleEditPlano(p.id)}/></Th>
        
                                                            <Th position="relative">
                                                                <Icon as={AiOutlineDelete} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                                                onClick={() => handleDeletePlano(p.id)}    />
                                                            </Th>
                                                        </Tr>
                                                    )
                                                })
                                            
                                        }
                                    </Tbody>
                                    <Tfoot>
                                        <Tr>
                                            <Th>Reservado</Th>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </TableContainer> : <Stack w="100%" h="20rem" display="flex" alignItems="center" justifyContent="center">
                                <Spinner size='xl'
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.principal'/>
                            </Stack>
                        }
                        
                    </Flex>
                </Flex>
                
            </Flex>
        </>
    )
}