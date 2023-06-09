import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,FormControl, FormLabel, Input, Textarea, Text, Icon, useToast
  } from '@chakra-ui/react'
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
  


import { BsCheck }from 'react-icons/bs'
import { app } from '../../services/firebaseAuth';
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { PlanosEstudoContext } from '../../contexts/PlanosEstudo/PlanosEstudoContext';
import { ObjetivoContext } from '../../contexts/Objetivos/ObjetivoContext';
import { AuthContext } from '../../contexts/Auth/AuthContext';

interface CreatePlanoEstudoProps{
    isOpenModal: boolean
    handleOpenModal: () => void;
    planoEstudo: PlanosEstudoProps[];
}

export function CreatePlanoEstudo({isOpenModal, handleOpenModal, planoEstudo}: CreatePlanoEstudoProps){

    const[name, setName] = useState('');
    const[objetive, setObjetive] = useState('');
    const[id, setId] = useState('');
    const[loading, setLoading] = useState(false);
    const toast = useToast();
    const objetivoContext = useContext(ObjetivoContext);
    const auth = useContext(AuthContext);
    // console.log(auth.user.id);
    const db = getFirestore(app);
    const planoEstudoCollectionRef = collection(db, "planos-estudo");

    async function handleSubmitPlanoEstudo(){
        if(name !== undefined && objetive !== undefined){
            // console.log(name, objetive);
            setLoading(true);
        
            if(id == undefined || id == ""){
                var usuarioId = auth?.user.id;

                let date_create = new Date().toLocaleString();
                const createPlanoEstudo = await addDoc(planoEstudoCollectionRef, {
                    name,
                    objetive,
                    date_create,
                    usuarioId
                });
                // console.log(createPlanoEstudo);
            }else{
                const planoDoc = doc(db, "planos-estudo", id);
                const newFields = {name: name, objetive: objetive};
                await updateDoc(planoDoc, newFields);
            }
    
            
                setLoading(false);
                handleOpenModal();
            
        }else{
            toast({
                title: 'Preencha todos os campos antes de enviar!',
                status: 'error',
                isClosable: true,
              })
        }
        
    }

    useEffect(() => {
        if(planoEstudo[0]?.id != ""){
            setName(planoEstudo[0]?.name);
            setObjetive(planoEstudo[0]?.objetive);
            setId(planoEstudo[0]?.id)
        }
    }, [planoEstudo]);

    return(
        <>

        <Modal onClose={() => {}} isOpen={isOpenModal} isCentered >
        <ModalOverlay />
            <ModalContent bg="black.100" m={["4", "3", "0"]}>
                <ModalHeader>
                    <Text color="whitesmoke">Mais um dentre muitos 😉</Text>
                    <Text fontSize="12"color="#949393">bora estudar!!</Text>
                </ModalHeader>
                <ModalCloseButton onClick={handleOpenModal} color="white"/>
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel color="gray.200">Nome</FormLabel>
                        <Input 
                         value={name}
                         color="white"
                         onChange={(e) => setName(e.target.value)}
                         placeholder='Insira o nome do plano de estudo' 
                         required
                         _placeholder={{color:"gray.200"}}
                         />

                        <FormLabel mt="4" color="gray.200">Objetivo</FormLabel>
                        <Textarea 
                        value={objetive}
                        color="white"
                        onChange={(e) => setObjetive(e.target.value)}
                        placeholder='Insira o objetivo deste plano' 
                        _placeholder={{color:"gray.200"}}
                        required/>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    {loading == false && (
                        <Button bg="blue.100" onClick={handleSubmitPlanoEstudo} size="md" _hover={{ opacity: 0.7 }}>
                            <Icon as={BsCheck} fontSize="25" color="white" />
                        </Button>
                    )}

                    {loading == true && (
                        <Button bg="blue.100" color="white" isLoading={true} onClick={handleSubmitPlanoEstudo} size="md" _hover={{ opacity: 0.7 }}>
                            <Icon as={BsCheck} fontSize="25" color="white" />
                        </Button>
                    )}
                    
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}