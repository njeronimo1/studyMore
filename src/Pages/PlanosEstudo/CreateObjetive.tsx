import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,FormControl, FormLabel, Input, Textarea, Text, Icon, useToast, Flex, Box
  } from '@chakra-ui/react'


import { useState, useContext, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../../services/firebaseAuth";
import { ObjetivoContext } from '../../contexts/Objetivos/ObjetivoContext';
import { AuthContext } from '../../contexts/Auth/AuthContext';

interface CreateObjetiveProps{
    isOpenModal: boolean
    handleOpenModal: () => void;
    planoEstudoId:string,
    objetivoId: string
}

export function CreateObjetive({isOpenModal, handleOpenModal, planoEstudoId, objetivoId}: CreateObjetiveProps){
    // const [value, setValue]            = useState('');
    
    const [titulo, setTitulo]          = useState('');
    const [texto_chave, setTextoChave] = useState('');
    const [descricao, setDescricao]    = useState('');
    const [dataInicio, setDataInicio]  = useState('');
    const [dataFim, setDataFim]        = useState('');
    const[loading, setLoading] = useState(false);
    const toast = useToast();
    const objetivoContext = useContext(ObjetivoContext);
    const auth = useContext(AuthContext);

    const db = getFirestore(app);
    const objetivoCollectionRef = collection(db, "objetivo");
    
    async function handleSubmitObjetive(e){
        e.preventDefault();
        if(titulo !== '' && texto_chave !== '' && descricao !== ''
            && dataInicio !== '' && dataFim !== ''){

            setLoading(true);
        
            if(objetivoId == undefined || objetivoId == ""){
                var usuarioId = auth?.user.id;
                var statusObjetivo = 'Aberto';
                const createObjetivo = await addDoc(objetivoCollectionRef, {
                    titulo,
                    texto_chave,
                    descricao,
                    dataInicio,
                    dataFim,
                    planoEstudoId,
                    statusObjetivo,
                    usuarioId
                });
            
                const reset = await objetivoContext.getObjetivo();
                if(reset){
                    setLoading(false);
                    handleOpenModal();
                    toast({
                        title: 'Objetivo cadastrado com sucesso!',
                        status: 'success',
                        isClosable: true,
                    })
                }
            }else{
                const objetivoDoc = doc(db, "objetivo", objetivoId);
                const newFields = {titulo: titulo, texto_chave: texto_chave, descricao: descricao, dataInicio: dataInicio, dataFim: dataFim};
                await updateDoc(objetivoDoc, newFields);

                const reset = await objetivoContext.getObjetivo();
                if(reset){
                    setLoading(false);
                    handleOpenModal();
                    toast({
                        title: 'Objetivo editado com sucesso!',
                        status: 'success',
                        isClosable: true,
                    })
                }
            }

            
            
        }else{
            toast({
                title: 'Preencha todos os campos antes de enviar!',
                status: 'error',
                isClosable: true,
              })
        }
    }

    useEffect(() =>{
        if(objetivoId !== ''){
            let objetivo = objetivoContext.objetivo.filter(obj => obj.id_objetive == objetivoId);
            // titulo, texto_chave, descricao, dataInicio, dataFim
            setTitulo(objetivo[0].titulo);
            setTextoChave(objetivo[0].texto_chave);
            setDescricao(objetivo[0].descricao);
            setDataInicio(objetivo[0].dataInicio);
            setDataFim(objetivo[0].dataFim);
        }else{
            setTitulo('');
            setTextoChave('');
            setDescricao('');
            setDataInicio('');
            setDataFim('');
        }
    }, [isOpenModal]);

    return(
        <>
        <Modal onClose={() => {}} isOpen={isOpenModal} isCentered size="5xl">
        <ModalOverlay />
            <ModalContent bg="black.100" w={["95%","95%", "100%"]}>
                <ModalHeader>
                    <Text color="whitesmoke" fontSize={["1.15rem","1.15rem","1.5rem"]}>Cadastre um objetivo que você deseja cumprir neste plano de estudos 📌</Text>
                    <Text fontSize="12"color="#949393">vamos construir seus sonhos!!</Text>
                </ModalHeader>
                <ModalCloseButton onClick={handleOpenModal} color="white"/>
                <ModalBody maxH={["35rem","35rem","45rem"]} overflowY="auto">
                    <FormControl  isRequired>
                        <FormLabel color="whitesmoke" fontSize={["0.9rem","0.95rem","1rem"]}>Titulo:</FormLabel>
                        <Input 
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                         placeholder='Insira o nome do plano de estudo' 
                         fontSize={["0.9rem","0.95rem","1rem"]}
                         required
                         bg="black.200"
                         color="white"
                         _placeholder={{color:'gray.200'}}
                         border="none" />

                        <FormLabel mt="4" color="whitesmoke" fontSize={["0.9rem","0.95rem","1rem"]}>Qual a principal intenção deste objetivo?</FormLabel>
                        <Input 
                        value={texto_chave}
                        onChange={(e) => setTextoChave(e.target.value)}
                        placeholder='Resuma o por quê você tem que cumprir este objetivo' 
                        fontSize={["0.9rem","0.95rem","1rem"]}
                        required
                        color="white"
                        bg="black.200"
                         _placeholder={{color:'gray.200'}}
                         border="none"/>

                        <FormLabel mt="4" color="whitesmoke" fontSize={["0.9rem","0.95rem","1rem"]}>Preencha a data de inicio e data que pretender terminar este objetivo:</FormLabel>
                        <Flex gap={2}>
                            <Box w="50%">
                                <Text fontSize="12" color="whitesmoke">Inicio</Text>
                                <Input
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    placeholder="Inicio"
                                    color="white"
                                    fontSize={["0.9rem","0.95rem","1rem"]}
                                    size="md"
                                    type="datetime-local"
                                    bg="black.200"
                         _placeholder={{color:'gray.200'}}
                         border="none"/>

                            </Box>
                            <Box w="50%">
                            <Text fontSize="12" color="whitesmoke">Fim</Text>
                            <Input
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                                placeholder="Fim"
                                color="white"
                                fontSize={["0.9rem","0.95rem","1rem"]}
                                size="md"
                                type="datetime-local"
                                bg="black.200"
                         _placeholder={{color:'gray.200'}}
                         border="none"/>

                            </Box>
                        </Flex>

                        <FormLabel mt="4" color="whitesmoke" fontSize={["0.9rem","0.95rem","1rem"]}>Agora você pode usar sua imaginação para descrever em texto, tópicos, blocos, as etapas ou o que desejar, sobre seu novo objetivo:</FormLabel>
                        <Flex w="100%"  color="white" maxH="50rem">
                            <ReactQuill theme="snow" value={descricao} onChange={setDescricao} style={{width:'100%', color:'white'}}/>
                        </Flex>
                        <Flex w="100%" mt={["20", "20","14"]}>
                            {loading == false && (
                                <Button w="100%" size="md" onClick={handleSubmitObjetive} type="button" bg="blue.100" color="white" _hover={{
                                    opacity: 0.8
                                }}>Salvar</Button>
                            )}

                            {loading && (
                                <Button w="100%" disabled isLoading={true} size="md" onClick={handleSubmitObjetive} type="button" bg="blue.100" color="white" _hover={{
                                    opacity: 0.8
                                }}>Salvar</Button>
                            )}
                            
                        </Flex>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}