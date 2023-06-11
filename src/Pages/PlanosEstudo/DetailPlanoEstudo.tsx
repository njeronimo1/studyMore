import { Box, Flex, Progress, Table, TableContainer, Tbody, Text, Th, Thead, Tr, Td, Icon , TableCaption,
    Tfoot,
    Stack,
    Spinner,
    Button,
    useToast,
    Img,
    InputGroup,
    InputLeftElement,
    Input, } from "@chakra-ui/react";
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
import { HeaderDetail } from "../../components/DetailPlanoEstudo/HeaderDetail";


///img
import objetivo from '../../assets/objetivo.png';
import { Pagination } from "../../components/Paginação/pagination";
import { BsSearch } from "react-icons/bs";




export function DetailPlanoEstudo(){

    const planoContext = useContext(PlanosEstudoContext);
    const objetivoContext = useContext(ObjetivoContext);
    const[objetivoId, setObjetivoId] = useState('');
    const { id } = useParams();
    const toast = useToast();
    const[loading, setLoading] = useState(false);
    const[isOpenModal, setIsOpenModal] = useState(false);
    const[objetivoFilter, setObjetivoFilter] = useState<ObjetivoProps[]>([]);
    const[tituloPage, setTituloPage] = useState('');
    const[naoExitemDados, setNaoExitemDados] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [searchText, setSearchText] = useState('');
    
    function handleOpenModal(){
        setObjetivoId('');
        setIsOpenModal(false);
        
        initialFunction(page);
    }

    useEffect(() => {
        var link = 'planos-estudo/' + id;
        localStorage.setItem('linkPlanoEstudo', link);

        setTituloPage('...');
        search(id);
    }, [id]);

    async function search(id_: string){
         var search_ = await planoContext.searchPlanoForId(id_);
        setTituloPage(search_[0].name);
    }

    useEffect(() => {
        initialFunction(page);
        // setObjetivoFilter(objetivoContext.objetivo);
    }, []);

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

    function initialFunction(page_:number){
        objetivoContext.getObjetivoPagination(id).then(res => {
            // console.log(res);

            if(res[page_].ObjetivoArray.filter(r => r.planoEstudoId == id).length > 0){
                setNaoExitemDados('');
                setTotalPage(res.length);
                setObjetivoFilter(res[page_].ObjetivoArray);
            }else{
                setNaoExitemDados('Você ainda não tem nenhum objetivo cadastrado, cadastre e começe a se organizar!');
            }
        }).catch((err) => {
            console.log(err);
            setNaoExitemDados('Você ainda não tem nenhum objetivo cadastrado, cadastre e começe a se organizar!');
        })
    }

    function handlePage(page_:number){
        // console.log(page_, 'planoEstudo');
        setPage(page_);
        initialFunction(page_);
    }

    useEffect(() => {

        if(searchText.length > 0){
            objetivoContext.getObjetivo().then((res) => {
                var objetivo__ = res.filter(p => p.titulo.toLowerCase().includes(searchText.toLowerCase()) || p.descricao.toLowerCase().includes(searchText.toLowerCase()));
                setTotalPage(0);
                
                setObjetivoFilter(objetivo__.filter(obj => obj.planoEstudoId == id));    
            })
        }else{
            initialFunction(page);
        }

    }, [searchText]);

    return(
        <>
        <CreateObjetive isOpenModal={isOpenModal} handleOpenModal={handleOpenModal} objetivoId={objetivoId} planoEstudoId={id} />
        <Flex>
            <Sidebar />

            <Flex p={["4","4","10"]} direction="column" w="100%" position="relative">
                <Link to="/planos-estudo">
                    <Button position="absolute" top="0.8rem" left={["1rem","1rem","2.5rem"]} size="sm" bg="black.100" color="white" _hover={{opacity:0.7}}
                            >Voltar</Button>
                </Link>
                <Flex w="100%" justifyContent="space-between" mt={["12","12","5"]}>
                <Header title={tituloPage}  subtitle="Aqui você tem o acompanhamento do seu plano, também pode criar objetivos para ele."/>
                <Button onClick={() => {setObjetivoId(''), setIsOpenModal(true)}} bg="blue.100" color="white" transition="0.2s ease" _hover={{bg:'white', color:'blue.100'}}
                position={["fixed","fixed","initial"]} bottom={["0.7rem","0.55rem",""]} right={["0.5rem","0.5rem",""]} fontSize={["13","13","1rem"]} zIndex="1">
                    <Icon as={GiStairsGoal} fontSize="17" mr="2" />
                    Criar novo objetivo</Button>
                </Flex>

                


                {naoExitemDados !== "" && (
                        <Flex w="100%" h="75vh" alignItems="center" justifyContent="center">
                            <Flex direction="column" align="center">
                                <Img src={objetivo} alt="objetivo" w="8rem" h="50%"/>
                                <Text fontSize="18" color="gray.200" mt="25">{naoExitemDados}</Text>
                            </Flex>
                        </Flex>
                    )}

                {naoExitemDados == "" && (
                    <>
                    <HeaderDetail planoEstudoId={id} />

                    <Flex w="100%" bg="black.100" borderRadius="6" p="4" mt="5" position="relative">
                    <Box w="100%">
                    <Flex justifyContent="space-between" w="100%" mb="5" gap="1">
                        <Box w={["100%","100%","50%"]}>
                            <InputGroup  bg="black.100" borderRadius="20">
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<Icon as={BsSearch} fontSize="18" color='white' />}
                                    />
                                <Input type='text' placeholder='Pesquise por nome ou descrição' _placeholder={{color:'gray.200'}} color="white"
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </InputGroup>
                        </Box>
                    </Flex>
                    {objetivoFilter.length > 0 ? 
                        
                        
                        
                        <TableContainer w="100%">
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th color="whitesmoke">Titulo</Th>
                                        <Th color="whitesmoke">Status</Th>
                                        <Th color="whitesmoke">Real objetivo</Th>
                                        <Th color="whitesmoke">Data inicio</Th>
                                        <Th color="whitesmoke">Data Fim</Th>
                                        <Th color="whitesmoke">Editar</Th>
                                        <Th color="whitesmoke">Excluir</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {objetivoFilter.filter(obj => obj.planoEstudoId == id).map(obj => {
                                        return(
                                            <Tr key={obj.id_objetive}>
                                        
                                                <Link to={`/objetivo/${obj.id_objetive}`}>
                                                    <Td display="flex" alignItems="center" gap="2" fontWeight="600" cursor="pointer"
                                                    _hover={{ opacity: 0.65}} color="gray.200" fontSize="0.875rem">
                                                        
                                                        {obj.titulo}
                                                    <Icon as={BiLinkExternal} fontSize="18"/></Td>
                                                </Link>

                                                <Td color="gray.200" fontSize="0.875rem">
                                                    <Flex gap={2} align="center">
                                                    <Text borderRadius="50%" bg={obj.statusObjetivo == "Aberto" ? "gray" 
                                                    : obj.statusObjetivo == "Em andamento" ? "yellow" : "green"} h="1rem" w="1rem"></Text> 
                                                    
                                                    {obj.statusObjetivo}
                                                    </Flex>
                                                </Td>
                                                <Td color="gray.200" fontSize="0.875rem">{obj.texto_chave}</Td>
                                                <Td color="gray.200" fontSize="0.875rem">{obj.dataInicio}</Td>
                                                <Td color="gray.200" fontSize="0.875rem">{obj.dataFim}</Td>
                                                
                                                <Th color="gray.200" fontSize="0.875rem"><Icon as={AiOutlineEdit} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                                onClick={() => handleOpenToIdObjetivo(obj.id_objetive)}/></Th>
                                                

                                                <Th position="relative" color="gray.200" fontSize="0.875rem">
                                                    <Icon as={AiOutlineDelete} fontSize="18" cursor="pointer" _hover={{ opacity: 0.8}}
                                                        onClick={() => handleDeleteObjetivo(obj.id_objetive)} />
                                                        
                                                </Th>
                                            </Tr>
                                        )
                                    })}
                                    
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Pagination total={totalPage} page={page} setPage={handlePage}/>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                        
                    
                    : <Stack w="100%" h="20rem" display="flex" alignItems="center" justifyContent="center">
                            <Spinner size='xl'
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.100'/>
                        </Stack>}</Box>
                    
                                </Flex>
                        </>
                    )}
                
                
            </Flex>
        </Flex>
        </>
    )
}