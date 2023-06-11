import { Box, Button, Flex, Icon, Input, InputGroup, InputLeftElement,
    Table,Text,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, 
    Stack,
    Spinner,
    Img, } from "@chakra-ui/react";

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
import plano from '../../assets/plano.png';
import { Pagination } from "../../components/Paginação/pagination";

export function PlanosEstudo(){

    const [planosEstudo, setPlanosEstudo] = useState<PlanosEstudoProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [planosEstudoFilter, setPlanosEstudoFilter] = useState<PlanosEstudoProps[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [naoExitemDados, setNaoExitemDados] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    //informações para modal de edição
    const [planosEstudoActive, setPlanosEstudoActive] = useState<PlanosEstudoProps[]>([]);


    ///Contexto do plano de estudos
    const planoContext = useContext(PlanosEstudoContext);

    function handleOpenModal(){
        planoContext.getPlanoEstudo();
        planoContext.resetPlanoActive();
        initialFunction(page);
        setIsOpenModal(false)
    }

    useEffect(() => {
        initialFunction(page);
    }, []);

    function handlePage(page_:number){
        setPage(page_);
        initialFunction(page_);
    }

    function initialFunction(page: number){
        // console.log(page);
        getPlanoEstudo(page).then(res => {
            if(res != undefined){
                setNaoExitemDados('');
                setTotalPage(res.length);
                setPlanosEstudoFilter(res[page].PlanosEstudoArray);
            }else{
                setNaoExitemDados('Você ainda não tem nenhum plano de estudo cadastrado, cadastre e começe a se organizar!');
            }
        }).catch((err) => {
            console.log(err);
            setNaoExitemDados('Você ainda não tem nenhum plano de estudo cadastrado, cadastre e começe a se organizar!');
        })
    }

    async function getPlanoEstudo(page:number){
        var plano = await planoContext.getPlanoEstudoPagination();
        return plano;
    }

    async function handleDeletePlano(id: string){
        await planoContext.handleDeletePlano(id);
        initialFunction(page);
    }

    async function handleEditPlano(id: string){
        await planoContext.handleEditPlano(id);
        setIsOpenModal(true);
    }

    useEffect(() => {

        if(search.length > 0){
            let planoEstudo = planoContext.planosEstudo.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.objetive.toLowerCase().includes(search.toLowerCase()));
            setTotalPage(0);
            setPlanosEstudoFilter(planoEstudo);
        }else{
            setPlanosEstudoFilter([]);
            initialFunction(page);
        }

    }, [search]);

    async function reload(){
        setLoading(true);
        setPlanosEstudo([]);
        setPlanosEstudoFilter([]);

        await planoContext.getPlanoEstudo();
        
        setPlanosEstudo(planoContext.planosEstudo);
        setPlanosEstudoFilter(planoContext.planosEstudo);
        
        setLoading(false);
    }

    return(
        <>
            <CreatePlanoEstudo isOpenModal={isOpenModal} handleOpenModal={handleOpenModal} planoEstudo={planoContext.planosEstudoActive}/>
            <Flex >
                <Sidebar />
                <Flex p={["4","4","10"]} direction="column" w="100%">
                    <Header title="Planos de estudo 📁" subtitle="Aqui você pode ver, editar, excluir ou cadastrar seus planos"></Header>
                    
                    <Flex justifyContent="space-between" w="100%" mt="5" gap="1">
                        <Box w={["100%","100%","50%"]}>
                            <InputGroup  bg="black.100" borderRadius="20">
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<Icon as={BsSearch} fontSize="18" color='white' />}
                                    />
                                <Input type='text' placeholder='Pesquise por nome' _placeholder={{color:'gray.200'}} color="white"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputGroup>
                        </Box>
                        <Flex w={["0%","0%","50%"]} alignItems="flex-end" justifyContent="flex-end">
                            <Button display="flex" gap={["1","1","3"]} position={["fixed","fixed","initial"]} zIndex="1" bottom={["0.7rem","0.55rem",""]} right={["0.5rem","0.5rem",""]} fontSize={["13","13","1rem"]} bg="blue.100" color="white" transition="0.2s ease" _hover={{bg:'white', color:'blue.100'}} onClick={() => setIsOpenModal(true)}>
                                Criar novo plano
                                <Icon as={BsClipboardPlus} fontSize={["15","15","20"]}/>
                            </Button>
                        </Flex>
                    </Flex>


                    {naoExitemDados !== "" && (
                        <Flex w="100%" h="75vh" alignItems="center" justifyContent="center">
                            <Flex direction="column" align="center">
                                <Img src={plano} alt="objetivo" w="8rem" h="50%"/>
                                <Text fontSize="18" color="gray.200" mt="25">{naoExitemDados}</Text>
                            </Flex>
                        </Flex>
                    )}

                    {naoExitemDados == "" && (
                        <Flex w="100%" bg="black.100" borderRadius="6" p={["2","2","4"]} mt="5" position="relative">
                        <Icon as={TbReload} fontSize="20" position="absolute" top="1rem" right="1rem" color="gray.200" onClick={reload} cursor="pointer" 
                        _hover={{ opacity:0.65 }}/>
                        
                        

                        {planosEstudoFilter.length > 0 ?
                            <TableContainer w="100%">
                                <Table variant='simple'>
                                    <Thead >
                                        <Tr>
                                            <Th color="whitesmoke">Nome</Th>
                                            <Th color="whitesmoke">Objetivo</Th>
                                            <Th color="whitesmoke">Status</Th>
                                            <Th color="whitesmoke">Data criação</Th>
                                            <Th color="whitesmoke">Editar</Th>
                                            <Th color="whitesmoke">Excluir</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        
                                        {
                                            
                                            planosEstudoFilter.map(p => {
                                                return(
                                                    <Tr key={p.id}>
                                                        
                                                        <Link to={`/planos-estudo/${p.id}`}>
                                                            <Td display="flex" alignItems="center" gap="2" fontWeight="600" cursor="pointer"
                                                            _hover={{ opacity: 0.65}} color="gray.200" fontSize="0.875rem">
                                                                
                                                                {p.name} 
                                                            <Icon as={BiLinkExternal} fontSize="18"/></Td>
                                                        </Link>
    
                                                        <Td color="gray.200" fontSize="0.875rem">{p.objetive}</Td>
                                                        <Td color="gray.200" fontSize="0.875rem">
                                                            <Flex gap={2} align="center">
                                                            <Text borderRadius="50%" bg={p.statusPlano == "Aberto" ? "gray" 
                                                            : p.statusPlano == "Em andamento" ? "yellow" : p.statusPlano == "Concluido" ? "green" : "gray"} h="1rem" w="1rem"></Text> 
                                                            
                                                            {p.statusPlano != undefined ? p.statusPlano : "Não iniciado"}
                                                            </Flex>
                                                        </Td>
                                                        <Td color="gray.200" fontSize="0.875rem">{p.date_create}</Td>
                                                        <Th color="gray.200" fontSize="0.875rem"><Icon as={AiOutlineEdit} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                                        onClick={() => handleEditPlano(p.id)}/></Th>
    
                                                        <Th position="relative" color="gray.200" fontSize="0.875rem">
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
                                            <Pagination total={totalPage} page={page} setPage={handlePage}/>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </TableContainer> : 
                            
                            <Stack w="100%" h="20rem" display="flex" alignItems="center" justifyContent="center">
                                <Spinner size='xl'
                                thickness='6px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.100'/>
                            </Stack>
                        }
                        
                    </Flex>
                    )}
                    
                </Flex>
                
            </Flex>
        </>
    )
}