import { Box, Text } from "@chakra-ui/react";

interface HeaderProps{
    title: string,
    subtitle: string
}

export function Header({title, subtitle}: HeaderProps){
    return(
        <>
            <Box>
                <Text fontSize="25" fontWeight="700" color="black.title">
                    {title} 
                </Text>
                <Text fontSize="18" fontWeight="300" color="gray.500">
                    {subtitle}
                </Text>
            </Box>
        </>
    )
}