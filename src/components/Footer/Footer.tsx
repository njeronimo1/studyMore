import { Flex, Icon, Link, Text } from "@chakra-ui/react";

//img 
import {BsLinkedin, BsGithub} from 'react-icons/bs';


export function Footer(){
    return(
        <>
            <Flex bg="black.100" borderTopLeftRadius="6" borderTopRightRadius="6" pr="4" pt="2" pb="2" pl="4" position="fixed" bottom="0rem" right="1rem" color="white"
            fontSize={["0.75rem","1rem", "1rem","1rem","1rem"]} gap="3" zIndex={51} boxShadow=" rgba(44,127,248, 0.6) 0px 0px 0px 2.5px;">
                Desenvolvido por: <Text fontWeight="600">Nicolas Jerônimo</Text>
                |
                <Link href='https://www.linkedin.com/in/njeronimo23/' isExternal>
                    <Icon as={BsLinkedin} fontSize="1rem"/>
                </Link>

                <Link href='https://github.com/njeronimo1' isExternal>
                    <Icon as={BsGithub} fontSize="1rem"/>
                </Link>
            </Flex>
        </>
    )
}