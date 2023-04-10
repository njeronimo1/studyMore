import { Box, Flex, Progress,Text } from "@chakra-ui/react";
import { theme } from "../../theme";
import Chart from 'react-apexcharts';
import { useEffect, useState } from "react";

const options: any = {
    chart:{
        
        zoom:{
            enabled:false,
        },
        foreColor:  theme.colors.gray[500],
    },
    plotOptions:{
        pie: {
            startAngle: -90,
            endAngle: 90,
            offsetY: 10
          }
    },
    dataLabels:{
        enabled: true,
    },
    tooltip:{
            enabled:false
    },
    grid: {
        padding: {
            bottom: -80
          }
    },
    xaxis:{
        axisBorder:{
            color:theme.colors.gray[600],
        },
        axisTicks:{
            color:theme.colors.gray[600],
        },
        categories: ['Abertos', 'Em andamento', 'Concluídos'],
    },
    fill:{
        colors: ['#0c105a', '#a9bf9a', '#c09f7f'],
    }
}

const series = [44, 55]

export function HeaderDetail(){

    useEffect(() => {
        
    }, []);

    return(
        <>
            <Flex mt="5" w="100%" bg="white" borderRadius="6" p="4" gap="6">
                <Box w="60%" >
                    <Text fontSize="17" fontWeight="600">Porcentagem de conclusão de seu plano de estudo: 20%</Text>
                    <Box mt="4">
                        <Progress mt="1" value={20} size='lg' colorScheme='blue' />
                    </Box>
                    <Box textAlign="left" mt="3">
                        <Text fontSize="16" color="gray.300" fontWeight="400" display="flex" alignItems="center" gap="2">Total de objetivos cadastrados: 
                        <Text fontSize="17" color="blue.principal" fontWeight="600">12</Text></Text>
                        
                    </Box>
                    <Box textAlign="left">
                        <Text fontSize="16" fontWeight="400" color="gray.300" display="flex" alignItems="center" gap="2">Total de objetivos concluídos: 
                        <Text fontSize="17" color="blue.principal" fontWeight="600">3</Text></Text>
                    </Box>
                </Box>
                <Box w="40%">
                    <Text fontSize="17" textAlign="center" fontWeight="600">Relação entre objetivos abertos, concluídos e em andamento</Text>
                    <Chart options={options} series={series} type="donut" height={150}/>
                </Box>
            </Flex>
        </>
    )
}