import { Box, Flex, Heading, Text, Icon, Avatar, Button ,
        Drawer,
        DrawerBody,
        DrawerFooter,
        DrawerHeader,
        DrawerOverlay,
        DrawerContent,
        DrawerCloseButton,
        useDisclosure,
} from "@chakra-ui/react";

import { AiFillPieChart } from 'react-icons/ai';
import { MdEditDocument } from 'react-icons/md';
import { BiLineChart } from 'react-icons/bi';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";


///img
import { AiOutlineMenu } from 'react-icons/ai';

export function Sidebar(){

    const [activeLink, setActiveLink] = useState('/');
    const { pathname } = useLocation();
    const auth = useContext(AuthContext);
    const history = useNavigate();
    const [title, setTitle] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(()=>{
        if(pathname == '/'){
            setActiveLink('/');
        }

        if(pathname.indexOf('home') > 0){
            setActiveLink('/home');
        }
        if(pathname.indexOf('planos-estudo') > 0){
            setActiveLink('/planos-estudo');
        }
        if(pathname.indexOf('usuario') > 0){
            setActiveLink('/usuario');
        }
    }, [pathname]);

    function logOut(){
        auth.signout();

        history("/");
    }

    useEffect(() => {
        var titleLogNormal = auth?.user?.name?.split("@")[0];
        var titleGoogle:any = auth?.user;

        if(titleLogNormal !== undefined){
            setTitle(titleLogNormal);
        }else{
            setTitle(titleGoogle?.displayName);
        }

        
    }, []);


    return(
        <>
            <Flex w="13%" display={["none", "none", "none", "none","flex"]}  h="100vh" alignItems="center" direction="column" position="relative">
                <Flex w="13%" bg="black.100" alignItems="center" display={["none", "none","none", "none",  "flex"]} h="100vh" direction="column" position="fixed">
                    <Heading fontSize="22" mt="10" fontWeight="600" color="blue.100" display="flex">Study <Text color="white">More</Text></Heading>

                    <Box w="100%" mt="10" p={6}>
                        <Text fontSize="12" color="gray.200">MENU PRINCIPAL</Text>
                        
                        <Flex mt="5" w="100%" gap="2" direction="column">
                            
                            <Link to={'/home'}>
                                <Flex gap="2" w="100%" bg={activeLink == "/home" ? "blue.100" : ""} 
                                    p={2} borderRadius="6" transition="0.3s ease background" _hover={{opacity: 0.65}}>
                                    <Icon as={AiFillPieChart} color={activeLink == "/home" ? "white" : "gray.200"} fontSize="20"/>
                                    <Text fontSize={['0.3rem', '0.3rem', '0.5rem', '0.65rem', '0.8rem']} color={activeLink == "/home" ? "white" : "gray.200"} fontWeight="bold">Dashboard</Text>
                                </Flex>
                            </Link>

                            <Link to={'/planos-estudo'}>
                                <Flex gap="2" w="100%" bg={activeLink == "/planos-estudo" ? "blue.100" : ""} p={2} borderRadius="6"
                                transition="0.3s ease background" _hover={{opacity:0.65}}>
                                    <Icon as={MdEditDocument} color={activeLink == "/planos-estudo" ? "white" : "gray.200"} fontSize="20"/>
                                    <Text fontSize={['0.3rem', '0.3rem', '0.5rem', '0.65rem', '0.8rem']} color={activeLink == "/planos-estudo" ? "white" : "gray.200"}  fontWeight="bold">Planos de estudo</Text>
                                </Flex>
                            </Link>

                        </Flex>
                    </Box>
                    
                    
                    <Box bg={activeLink == "/usuario" ? "blue.principal" : "gray.fundo"} transition="0.3s ease background" p={3} borderRadius={6} w={["80%","80%","80%","80%","80%"]} position="absolute" bottom="10">
                        
                            <Flex gap={3} alignItems="center">
                                <Flex w="100%" direction="column" alignItems="center">
                                    <Text  fontSize={['0.3rem', '0.3rem', '0.5rem', '0.65rem', '0.75rem']} fontWeight="600" color="white" cursor="default">Bem vindo, {title}</Text>
                                    <Button color="white" bg="red" size="sm" mt="1" _hover={{opacity:0.8}}
                                    onClick={logOut} p="0.2" h="1.4rem" w="50%">
                                        <Text  fontSize={['0.3rem', '0.3rem', '0.5rem', '0.65rem', '0.75rem']} fontWeight={500} justifyContent="center"
                                        display="flex" alignItems="center" borderRadius="3px">sair</Text>
                                    </Button>
                                </Flex>
                            </Flex>
                            
                    </Box>
                    
                </Flex>
                
                
                
            </Flex>

            <Button colorScheme='gray' onClick={onOpen} position="absolute" zIndex={1} right="0.5rem" top="0.5rem"
            display={["initial", "initial", "initial", "initial","none"]}>
                <Icon as={AiOutlineMenu} color="white"/>
            </Button>

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton color="white"/>
                <DrawerHeader bg="black.100" color="blue.100" display="flex">Study <Text color="white">More</Text></DrawerHeader>

                <DrawerBody bg="black.100">
                    <Box w="100%" mt="10" p={0}>
                        <Text fontSize="12" color="gray.200">MENU PRINCIPAL</Text>
                        
                        <Flex mt="5" w="100%" gap="2" direction="column">
                            
                            <Link to={'/home'}>
                                <Flex gap="2" w="100%" bg={activeLink == "/home" ? "blue.100" : ""} 
                                    p={2} borderRadius="6" transition="0.3s ease background" _hover={{opacity: 0.65}}>
                                    <Icon as={AiFillPieChart} color={activeLink == "/home" ? "white" : "gray.200"} fontSize="20"/>
                                    <Text fontSize={['0.8rem', '0.6rem', '0.7rem', '0.75rem', '0.85rem']} color={activeLink == "/home" ? "white" : "gray.200"} fontWeight="bold">Dashboard</Text>
                                </Flex>
                            </Link>

                            <Link to={'/planos-estudo'}>
                                <Flex gap="2" w="100%" bg={activeLink == "/planos-estudo" ? "blue.100" : ""} p={2} borderRadius="6"
                                transition="0.3s ease background" _hover={{opacity:0.65}}>
                                    <Icon as={MdEditDocument} color={activeLink == "/planos-estudo" ? "white" : "gray.200"} fontSize="20"/>
                                    <Text fontSize={['0.8rem', '0.6rem', '0.7rem', '0.75rem', '0.75rem']} color={activeLink == "/planos-estudo" ? "white" : "gray.200"}  fontWeight="bold">Planos de estudo</Text>
                                </Flex>
                            </Link>

                        </Flex>
                    </Box>
                    
                    
                    
                </DrawerBody>

                <DrawerFooter bg="black.100">
                    <Box bg={activeLink == "/usuario" ? "blue.principal" : "gray.fundo"} transition="0.3s ease background" p={3} borderRadius={6} w={["80%","80%","80%","80%","80%"]} position="absolute" bottom="10">
                            
                            <Flex gap={3} alignItems="center">
                                <Flex w="100%" direction="column" alignItems="center">
                                    <Text  fontSize={['0.8rem', '0.7rem', '0.7rem', '0.65rem', '0.75rem']} fontWeight="600" color="white" cursor="default">Bem vindo, {title}</Text>
                                    <Button color="white" bg="red" size="sm" mt="1" _hover={{opacity:0.8}}
                                    onClick={logOut} p="0.2" h="1.4rem" w="50%">
                                        <Text  fontSize={['0.8rem', '0.7rem', '0.7rem', '0.65rem', '0.7rem']} fontWeight={500} justifyContent="center"
                                        display="flex" alignItems="center" borderRadius="3px">sair</Text>
                                    </Button>
                                </Flex>
                            </Flex>
                    </Box>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
            
        </>
    )

}