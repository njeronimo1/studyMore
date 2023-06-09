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
import { AnotacaoContext } from '../../contexts/Anotacao/AnotacaoContext';


interface CreateAnotacaoProps{
    isOpenModal: boolean
    handleOpenAnotacao: () => void;
    objetivoId:string;
    anotacaoId: string;
}

export function CreateAnotacao({isOpenModal, handleOpenAnotacao, objetivoId, anotacaoId}: CreateAnotacaoProps){

    const[titulo, setTitulo] = useState('');
    const[descricao, setDescricao] = useState('');
    const[loading, setLoading] = useState(false);
    const anotacaoContext = useContext(AnotacaoContext);
    const toast = useToast();

    async function handleSubmitAnotacao(e){
        e.preventDefault();
        if(titulo !== '' && descricao !== ''){

            setLoading(true);
        
            const createAnotacao = anotacaoContext.editAnotacao(anotacaoId, titulo, descricao, objetivoId);
            if(createAnotacao){
                setLoading(false);
                handleOpenAnotacao();
                setTitulo('');
                setDescricao('');
                toast({
                    title: 'Anotação cadastrada com sucesso!',
                    status: 'success',
                    isClosable: true,
                  })
            }
            
        }else{
            toast({
                title: 'Preencha todos os campos antes de enviar!',
                status: 'error',
                isClosable: true,
              })
        }
    }

    useEffect(() => {

        if(anotacaoId !== ''){
            let anotacao_ = anotacaoContext.anotacao.filter(ant => ant.anotacaoId === anotacaoId);
            setTitulo(anotacao_[0].titulo);
            setDescricao(anotacao_[0].descricao);
        }else{
            setTitulo('');
            setDescricao('');
        }
    }, [anotacaoId]);

    return(
        <>
        <Modal onClose={() => {}} isOpen={isOpenModal} isCentered size="5xl">
        <ModalOverlay />
            <ModalContent bg="black.100" w={["95%","95%","100%"]}>
                <ModalHeader >
                    <Text color="whitesmoke" fontSize={["1.15rem","1.15rem","1.5rem"]}>Realize anotações sobre este objetivo, ou sobre alguma tarefa, você pode escolher</Text>
                    <Text fontSize="12"color="#949393">vamos construir seus sonhos!!</Text>
                </ModalHeader>
                <ModalCloseButton onClick={handleOpenAnotacao} color="white"/>
                <ModalBody maxH="50rem" overflowY="auto">
                    <FormControl  isRequired>
                        <FormLabel color="whitesmoke" fontSize={["0.9rem","0.95rem","1rem"]}>Titulo:</FormLabel>
                        <Input 
                        value={titulo}
                        color="white"
                        onChange={(e) => setTitulo(e.target.value)}
                         placeholder='Insira o titulo da anotação' 
                         _placeholder={{color:'gray.200'}}
                         fontSize={["0.9rem","0.95rem","1rem"]}
                         required/>

                        <FormLabel mt="4" color="whitesmoke" fontSize={["0.9rem","0.95rem","1rem"]}>Campo disponível para qualquer anotação:</FormLabel>
                        <Flex w="100%" color="white">
                            <ReactQuill theme="snow" value={descricao} onChange={setDescricao} style={{width:'100%'}}/>
                        </Flex>
                        <Flex w="100%" mt={["20","20","14"]}>
                            <Button w="100%" size="md" onClick={handleSubmitAnotacao} type="button" bg="blue.100" color="white" _hover={{
                                opacity: 0.8
                            }}>Salvar</Button>
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