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

    const db = getFirestore(app);
    const planoEstudoCollectionRef = collection(db, "planos-estudo");

    async function handleSubmitPlanoEstudo(){
        if(name !== undefined && objetive !== undefined){
            console.log(name, objetive);
            setLoading(true);
        
            if(id == undefined || id == ""){
                
                let date_create = new Date().toLocaleString();
                const createPlanoEstudo = await addDoc(planoEstudoCollectionRef, {
                    name,
                    objetive,
                    date_create
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

        <Modal onClose={() => {}} isOpen={isOpenModal} isCentered>
        <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text>Mais um dentre muitos 😉</Text>
                    <Text fontSize="12"color="#949393">bora estudar!!</Text>
                </ModalHeader>
                <ModalCloseButton onClick={handleOpenModal} />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Nome</FormLabel>
                        <Input 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder='Insira o nome do plano de estudo' 
                         required/>

                        <FormLabel mt="4">Objetivo</FormLabel>
                        <Textarea 
                        value={objetive}
                        onChange={(e) => setObjetive(e.target.value)}
                        placeholder='Insira o objetivo deste plano' 
                        required/>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    {loading == false && (
                        <Button bg="blue.principal" onClick={handleSubmitPlanoEstudo} size="md" _hover={{ opacity: 0.7 }}>
                            <Icon as={BsCheck} fontSize="25" color="white" />
                        </Button>
                    )}

                    {loading == true && (
                        <Button bg="blue.principal" color="white" isLoading={true} onClick={handleSubmitPlanoEstudo} size="md" _hover={{ opacity: 0.7 }}>
                            <Icon as={BsCheck} fontSize="25" color="white" />
                        </Button>
                    )}
                    
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}