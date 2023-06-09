import { Box, Text } from "@chakra-ui/react";

interface HeaderProps{
    title: string,
    subtitle: string
}

export function Header({title, subtitle}: HeaderProps){
    return(
        <>
            <Box>
                <Text fontSize={["20","20","28"]} fontWeight="700" color="white">
                    {title} 
                </Text>
                <Text fontSize={["15","15","18"]} fontWeight="400" color="gray.200">
                    {subtitle}
                </Text>
            </Box>
        </>
    )
}