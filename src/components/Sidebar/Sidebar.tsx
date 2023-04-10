import { Box, Flex, Heading, Text, Icon, Avatar } from "@chakra-ui/react";

import { AiFillPieChart } from 'react-icons/ai';
import { MdEditDocument } from 'react-icons/md';
import { BiLineChart } from 'react-icons/bi';
import { Link, useLocation } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";
import { useEffect, useState } from "react";



export function Sidebar(){

    const [activeLink, setActiveLink] = useState('/');
    const { pathname } = useLocation();

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

    return(
        <>
            <Flex w="13%" bg="white" h="100vh" alignItems="center" direction="column" position="relative">
                <Heading fontSize="22" mt="10" color="black.title">Meus estudos</Heading>

                <Box w="100%" mt="10" p={6}>
                    <Text fontSize="12" color="gray.100">MENU PRINCIPAL</Text>
                    
                    <Flex mt="5" w="100%" gap="2" direction="column">
                        
                        <Link to={'/home'}>
                            <Flex gap="2" w="100%" bg={activeLink == "/home" ? "blue.principal" : "white"}
                                p={2} borderRadius="6" transition="0.3s ease background">
                                <Icon as={AiFillPieChart} color={activeLink == "/home" ? "white" : "gray.200"} fontSize="20"/>
                                <Text fontSize="15" color={activeLink == "/home" ? "white" : "gray.200"} fontWeight="bold">Dashboard</Text>
                            </Flex>
                        </Link>

                        <Link to={'/planos-estudo'}>
                            <Flex gap="2" w="100%" bg={activeLink == "/planos-estudo" ? "blue.principal" : "white"} p={2} borderRadius="6"
                            transition="0.3s ease background">
                                <Icon as={MdEditDocument} color={activeLink == "/reports" ? "white" : "gray.200"} fontSize="20"/>
                                <Text fontSize="15" color={activeLink == "/planos-estudo" ? "white" : "gray.200"} fontWeight="bold">Planos de estudo</Text>
                            </Flex>
                        </Link>

                        <Link to={'/perfomance'}>
                            <Flex gap="2" w="100%" color={activeLink == "/performance" ? "white" : "gray.300"} p={2} borderRadius="6"
                            transition="0.3s ease background">
                                <Icon as={BiLineChart} color={activeLink == "/performance" ? "white" : "gray.300"} fontSize="20"/>
                                <Text fontSize="15" color={activeLink == "/performance" ? "white" : "gray.300"} fontWeight="bold">Performance</Text>
                            </Flex>
                        </Link>
                    </Flex>
                </Box>
                
                
                    <Box bg={activeLink == "/usuario" ? "blue.principal" : "gray.fundo"} transition="0.3s ease background" p={3} borderRadius={6} w="90%" position="absolute" bottom="10">
                        
                            <Flex gap={3}>
                                <Avatar name="Nicolas Jerônimo"
                                color={activeLink == "/usuario" ? "white" : "black.title"} size="md" cursor="default"></Avatar>
                                <Box >
                                    <Text color={activeLink == "/usuario" ? "white" : "black.title"} fontSize={16} fontWeight="900" cursor="default">Nicolas</Text>
                                    <Link to={'/usuario'}>
                                        <Text color={activeLink == "/usuario" ? "white" : "black.title"} fontSize={12}
                                        display="flex" alignItems="center" gap="1">Acessar perfil  <Icon as={GrLinkNext}
                                        color={activeLink == "/usuario" ? "white" : "gray.300"} fontSize="13"/></Text>
                                    </Link>
                                </Box>
                            </Flex>
                    </Box>
                
            </Flex>
        </>
    )

}