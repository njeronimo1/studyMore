import { Box, Flex, Icon, Select, Text } from "@chakra-ui/react";
import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import Chart from 'react-apexcharts';

import {theme} from '../../theme';

//imgs

import {GoLinkExternal} from 'react-icons/go'

const options: any = {
    chart:{
        
        zoom:{
            enabled:false,
        },
        foreColor:  theme.colors.gray[500],
    },
    plotOptions:{
        bar:{
            horizontal: true
        }
    },
    dataLabels:{
        enabled: true,
    },
    tooltip:{
            enabled:false
    },
    grid: {
        show:false,
    },
    xaxis:{
        // type: 'datetime',
        axisBorder:{
            color:theme.colors.gray[600],
        },
        axisTicks:{
            color:theme.colors.gray[600],
        },
        categories: ['Abertos', 'Em andamento', 'Concluídos'],
    },
    fill:{
        // opacity: 0.3,
        // type: 'gradient',
        colors: ['#0c105a', '#a9bf9a', '#c09f7f'],
        // gradient: {
        //     shade:'dark',
        //     opacityFrom: 0.7,
        //     opacityTo: 0.3
        // }
    }
}

const series = [
    { data: [400, 430, 448]},
]

const optionsTarefa: any = {
    chart:{
        zoom:{
            enabled:false,
        },
        foreColor:  theme.colors.gray[500],
    },
    dataLabels:{
        enabled: true,
        position: "center"
    },
    tooltip:{
            enabled:false
    },
    grid: {
        show:true,
    },
    legend:{
        colors: ['#0c105a', '#a9bf9a', '#c09f7f', "#dbd3cd", "#e9e9ef"],
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    colors: ['#0c105a', '#a9bf9a', '#c09f7f', "#dbd3cd", "#e9e9ef"],
    
    xaxis:{
        // type: 'datetime',
        axisBorder:{
            color:theme.colors.gray[600],
        },
        axisTicks:{
            color:theme.colors.gray[600],
        },
    },
    fill:{
        colors: ['#0c105a', '#a9bf9a', '#c09f7f', "#dbd3cd", "#e9e9ef"],
        //     opacityTo: 0.3
        // }
    }
}

const seriesTarefa = [
    44, 55, 13, 43, 22,
    // { name:'Em andamento', data: [1000, 3353, 13229, 6000, 2342, 28923, 10897]},
    // { name:'Concluído', data: [5000, 4803, 10229, 20000, 1342, 20923, 11897]}
]

const optionsPerformance: any = {
    chart:{
        zoom:{
            enabled:false,
        },
        foreColor:  theme.colors.gray[500],
    },
    dataLabels:{
        enabled: true,
        position: "center"
    },
    tooltip:{
            enabled:false
    },
    grid: {
        show:true,
    },
    legend:{
        colors: ['#0c105a', '#c09f7f'],
    },
    labels: ['Planos de estudo', 'Tarefas'],
    colors: ['#0c105a', '#c09f7f'],
    
    xaxis:{
        // type: 'datetime',
        axisBorder:{
            color:theme.colors.gray[600],
        },
        axisTicks:{
            color:theme.colors.gray[600],
        },
    },
    fill:{
        colors: ['#0c105a', '#c09f7f'],
    }
}

const seriesPerformance = [
    44, 55
]

export function Home(){
    return(
        <Flex>
            <Sidebar />
            <Flex p="10" direction="column" w="100%">
                <Header title="Olá 👋" subtitle="pronto para mais um dia?"/>
                <Flex mt="5" w="100%">
                    <Flex w="100%" gap={3}>
                        <Flex w="20%"   direction="column" gap="4">
                            <Box w="100%" bg="white" p="4" borderRadius="6" >
                                <Text w="100%" fontSize="20"fontWeight="500" color="black.title" textAlign="center">Total de planos de estudos</Text>
                                <Text fontSize="40" color="gray.300" textAlign="center">3</Text>
                            </Box>
                            <Box w="100%" bg="white" p="4" borderRadius="6" >
                                <Text w="100%" fontSize="20"fontWeight="500" color="black.title" textAlign="center">Total de tarefas</Text>
                                <Text fontSize="40" color="gray.300" textAlign="center">5</Text>
                            </Box>
                        </Flex >
                        <Flex w="80%">
                            <Box w="100%" bg="white" p="4" borderRadius="6" >

                                <Text w="100%" fontSize="20"fontWeight="500" color="black.title" textAlign="center">Planos de estudo por status</Text>
                                {/* <Text fontSize="40" color="gray.300" textAlign="center">5</Text> */}
                                <Chart options={options} series={series} type="bar" height={180}/>
                            </Box>
                        </Flex>
                    </Flex>
                    
                </Flex>
                <Flex mt="5" w="100%">
                    <Flex w="100%" gap={3}>
                        
                        <Flex w="20%"   direction="column" gap="4"> 
                            <Text fontSize={16} fontWeight="600">Últimas anotações feitas:</Text>
                            <Flex bg="white" borderRadius="6" p="4" direction="column" gap="2" maxH="350" overflowY="auto">

                                <Flex bg="white" _hover={{
                                    bg:'gray.100',
                                    color:'blue.principal'
                                }}
                                transition="0.2s ease background"
                                w="100%"
                                p="2"
                                borderRadius="6"
                                cursor="pointer">
                                    <Text fontWeight="600" w="100%" display="flex" justifyContent="space-between" alignItems="center"
                                     fontSize="16" fontStyle="oblique">#1 - ReactJs com Typescript
                                    <Icon as={GoLinkExternal} fontSize="20"/> </Text>
                                </Flex>

                            </Flex>
                        </Flex>
                        <Flex w="35%">
                            <Box w="100%" bg="white" p="4" borderRadius="6" gap={2}>
                                <Text w="100%" fontSize="20"fontWeight="500" color="black.title" textAlign="center">Tarefas por planos de estudos</Text>

                                <Box mt={5}>
                                    <Chart options={optionsTarefa} series={seriesTarefa}  type="pie" height={300} width="100%"/>
                                </Box>
                            </Box>
                        </Flex>
                        <Flex w="22%">
                            <Box w="100%" bg="white" p="4" borderRadius="6" gap={2}>
                                <Text w="100%" fontSize="20"fontWeight="500" color="black.title" textAlign="center">O que você precisa melhorar</Text>

                                <Flex bg="white" borderRadius="6" p="4" direction="column" gap="2" maxH="350" overflowY="auto">

                                    <Flex bg="white" _hover={{
                                        bg:'gray.100',
                                        color:'blue.principal'
                                    }}
                                    transition="0.2s ease background"
                                    w="100%"
                                    p="2"
                                    borderRadius="6"
                                    cursor="pointer">
                                        <Text fontWeight="600" w="100%" display="flex" justifyContent="space-between" alignItems="center"
                                        fontSize="16" fontStyle="oblique">#1 - ReactJs com Typescript
                                        <Text color="red" fontWeight="500">4</Text>
                                        </Text>
                                        
                                    </Flex>

                                    <Flex bg="white" _hover={{
                                        bg:'gray.100',
                                        color:'blue.principal'
                                    }}
                                    transition="0.2s ease background"
                                    w="100%"
                                    p="2"
                                    borderRadius="6"
                                    cursor="pointer">
                                        <Text fontWeight="600" w="100%" display="flex" justifyContent="space-between" alignItems="center"
                                        fontSize="16" fontStyle="oblique">#1 - ReactJs com Typescript
                                        <Text color="green" fontWeight="500">8</Text>
                                        </Text>
                                        
                                    </Flex>

                                </Flex>
                            </Box>
                        </Flex>
                        <Flex w="22%">
                            <Box w="100%" bg="white" p="4" borderRadius="6" gap={2}>
                                <Flex justifyItems="space-between">
                                    <Text w="100%" fontSize="20"fontWeight="500" color="black.title" textAlign="center">Performance</Text>
                                    <Select size="sm">
                                        <option>Plano de estudo 1</option>
                                    </Select>
                                </Flex>

                                <Box mt={5}>
                                    <Chart options={optionsPerformance} series={seriesPerformance}  type="radialBar" height={300} width="100%"/>
                                </Box>
                            </Box>
                        </Flex>

                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}