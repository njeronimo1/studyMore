import { Box, Button, Flex, Icon, Img, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, Spinner, Stack, Text, cssVar } from "@chakra-ui/react";
import { Header } from "../../components/Header/Header";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import Chart from 'react-apexcharts';

import {theme} from '../../theme';

//imgs

import {GoLinkExternal} from 'react-icons/go'
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { PlanosEstudoContext } from "../../contexts/PlanosEstudo/PlanosEstudoContext";
import { HomeInfo } from "../../@types/homeInfos";
import { TarefaContext } from "../../contexts/Tarefa/TarefaContext";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { ObjetivoContext } from "../../contexts/Objetivos/ObjetivoContext";
import filter from '../../assets/filter.png';
import red from '../../assets/red.png';
import yellow from '../../assets/yellow.png';
import green from '../../assets/green.png';
import { TarefaProps } from "../../@types/tarefa";
import { Link } from "react-router-dom";
import {BsCheck} from 'react-icons/bs';
import {IoClose} from 'react-icons/io5';
import { Footer } from "../../components/Footer/Footer";
import { AuthContextGoogle } from "../../contexts/AuthGoogle/AuthGoogle";


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
        axisBorder:{
            color:theme.colors.gray[600],
        },
        axisTicks:{
            color:theme.colors.gray[600],
        },
        categories: ['Não iniciados','Abertos', 'Em andamento', 'Concluídos'],
    },
    fill:{
        colors: ['#2c7ff8', '#2c7ff8', '#2c7ff8'],
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
        colors: ['#cccccc', '#f0f002', '#11cc04'],
    },
    labels: ["Abertos", "Em andamento", "Concluidos"],
    colors: ['#cccccc', '#f0f002', '#11cc04'],
    
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
        colors: ['#cccccc', '#f0f002', '#11cc04'],
    }
}

const seriesTarefa = [
    44, 55, 13, 43, 22,
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
        position: "center",
        fontSize: '10px',
    },
    tooltip:{
            enabled:false,
            fontSize: '10px',
    },
    grid: {
        show:true,
    },
    legend:{
        show:true,
        colors: ['#8edbff', '#428eff','#1683cc'],
        labels: {
            useSeriesColors: false,
          },
          fontSize: '12px',
    },
    labels: ['P. de estudo', 'Objetivos', 'Tarefas'],
    colors: ['#8edbff', '#428eff','#1683cc'],
    
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
        colors: ['#8edbff', '#428eff','#1683cc'],
    }
}

const seriesPerformance = [
    44, 50 , 100
]

export function Home(){

    //contextos
    const auth = useContext(AuthContext);
    const authGoogle = useContext(AuthContextGoogle);
    const planoEstudoContext = useContext(PlanosEstudoContext);
    const tarefasContext = useContext(TarefaContext);
    const objetivoContext = useContext(ObjetivoContext);
    /////

    //states
    const[title, setTitle] = useState('');
    const[infoTotais, setInfoTotais] = useState<HomeInfo>({
        totalPlanoEstudos: null,
        totalTarefas:null,
        totalObjetivo: null,
    });
    const[dadosObjPorStatus, setDadosObjPorStatus] = useState([]);
    const[dadosPlanoPorStatus, setDadosPlanoPorStatus] = useState([]);
    const[dadosObjetivoPorPlano, setDadosObjetivoPorPlano] = useState([]);
    const[optionsObjetivoPorPlano, setOptionsObjetivoPorPlano] = useState<any>();
    const[planoEstudo, setPlanoEstudo] = useState<PlanosEstudoProps[]>([]);
    const[tarefasLista, setTarefasLista] = useState<TarefaProps[]>([]);
    const[porcentagemConclusaoTarefa, setPorcentagemConclusaoTarefa] = useState(0);
    const[dadosPerformance, setDadosPerformance] = useState([]);
    const selectRef = useRef(null);

    useEffect(() => {
        auth.getUser().then((user_) => {
            var titleLogNormal = user_?.name?.split("@")[0];
            var titleGoogle:any = user_;
    
            if(titleLogNormal !== undefined){
                setTitle('Olá 👋 ' + titleLogNormal);
            }else if(titleGoogle !== undefined){
                setTitle('Olá 👋 ' + titleGoogle.displayName);
            }

            filterObjetivoPorPlano('').then((result) => {
                planoEstudoContext.getPlanoEstudo().then((data) => { 
                    console.log(data);
                    setPlanoEstudo(data);
    
                    tarefasContext.getTarefas().then((dataTarefa) => {
                        objetivoContext.getObjetivo().then((obj) => {
                            setInfoTotais({
                                totalPlanoEstudos: data.length,
                                totalTarefas: dataTarefa.length,
                                totalObjetivo: obj.length,
                            })
                        })
                    });
        
                    const planosNaoIniciados = data.filter(p => p.statusPlano == undefined).length;
                    const planosAbertos = data.filter(p => p.statusPlano == "Aberto").length;
                    const planosAndamento = data.filter(p => p.statusPlano == "Em andamento").length;
                    const planosConcluido = data.filter(p => p.statusPlano == "Concluido").length;
        
                    setDadosPlanoPorStatus([{data: [planosNaoIniciados,planosAbertos, planosAndamento, planosConcluido]}])
        
                });
            });
        })
        
    }, [auth.user]);

    async function filterObjetivoPorPlano(planoId: string){

        if(planoId != ""){

           await objetivoContext.searchObjetivoForId(planoId).then(async(obj) => {
                var objetivoTotal = obj.length;
                const objetivoAberto = obj.filter(obj => obj.statusObjetivo === "Aberto").length;
                const objetivoAndamento = obj.filter(obj => obj.statusObjetivo === "Em andamento").length;
                const objetivoConcluido = obj.filter(obj => obj.statusObjetivo === "Concluido").length;

                setDadosObjetivoPorPlano([objetivoAberto, objetivoAndamento, objetivoConcluido]);

                var porcentagemConclusaoTarefa = 0;
                await tarefasContext.getTarefas().then((t) => {
                    if(t.length > 0 || t.filter(tarefa => tarefa.isComplete == true).length !== 0){
                        const tarefa_ = [];

                        obj.forEach((ob) => {
                            t.forEach((t) => {
                                if(ob.id_objetive === t.objetivoId){
                                    var objeto = {
                                        tarefaId: t.tarefaId,
                                        objetivoId: t.objetivoId,
                                        titulo: t.titulo,
                                        isComplete: t.isComplete
                                    }
    
                                    tarefa_.push(objeto);
                                }
                            })
                        })
    
                        setTarefasLista(tarefa_);
                        const tarefas = tarefa_.length;
                        const tarefasCompletas = tarefa_.filter(tarefa => tarefa.isComplete == true).length;
                        
                        const conclusao = Number(((tarefasCompletas / tarefas) * 100).toFixed(1));
                        porcentagemConclusaoTarefa = conclusao;
    
                        setPorcentagemConclusaoTarefa(conclusao);
                    }else{
                        setPorcentagemConclusaoTarefa(0);
                    }
                    
                });

                var performancePlano = 0;
                ///grafico performance geral
                await planoEstudoContext.searchPlanoForId(planoId).then(async (p) => {
                    const planosEstudoTotal = p.length;
                    const planosEstudoCompletos = p.filter(plano => plano.statusPlano === "Concluido").length;

                    performancePlano = Number(((planosEstudoCompletos / planosEstudoTotal) * 100).toFixed(1));
                });

                var performanceObjetivos = Number(((objetivoConcluido / objetivoTotal) * 100).toFixed(1));

                setDadosPerformance([performancePlano, performanceObjetivos, porcentagemConclusaoTarefa]);

                return;
            }); 
        }else{

            await objetivoContext.getObjetivo().then((obj) => {
                const objetivoAberto = obj.filter(obj => obj.statusObjetivo === "Aberto").length;
                const objetivoAndamento = obj.filter(obj => obj.statusObjetivo === "Em andamento").length;
                const objetivoConcluido = obj.filter(obj => obj.statusObjetivo === "Concluido").length;

                setDadosObjetivoPorPlano([objetivoAberto, objetivoAndamento, objetivoConcluido]);

                return;
            });  

            await tarefasContext.getTarefas().then((t) => {
                setTarefasLista([]);
                
                if(t.length > 0 || t.filter(tarefa => tarefa.isComplete == true).length !== 0){
                    const tarefas = t.length;
                    const tarefasCompletas = t.filter(tarefa => tarefa.isComplete == true).length;
                    
                    const conclusao = ((tarefasCompletas / tarefas) * 100).toFixed(1);
    
                    setPorcentagemConclusaoTarefa(Number(conclusao));
                }else{
                    setPorcentagemConclusaoTarefa(0);
                }
                
            });

            ///grafico performance geral
            await planoEstudoContext.getPlanoEstudo().then(async (p) => {
                const planosEstudoTotal = p.length;
                const planosEstudoCompletos = p.filter(plano => plano.statusPlano === "Concluido").length;

                var performancePlano = ((planosEstudoCompletos / planosEstudoTotal) * 100).toFixed(1);
                var performanceObjetivos = 0;
                var performanceTarefas = 0;

                await objetivoContext.getObjetivo().then((obj) => {
                    const ObjetivosTotal = obj.length;
                    const ObjetivosCompletos = obj.filter(obj_ => obj_.statusObjetivo === "Concluido").length;
    
                    performanceObjetivos = Number(((ObjetivosCompletos / ObjetivosTotal) * 100).toFixed(1));
                })

                await tarefasContext.getTarefas().then((t) => {
                    const tarefasTotal = t.length;
                    const tarefasCompletos = t.filter(t_ => t_.isComplete === true).length;
    
                    performanceTarefas = Number(((tarefasCompletos / tarefasTotal) * 100).toFixed(1));
                })

                setDadosPerformance([performancePlano, performanceObjetivos, performanceTarefas]);
            })
            
        };

        return;
    }


    return(
        <Flex>
            <Sidebar />
            <Footer />

            <Flex p={["5","2","10"]} direction="column" w="100%">
                <Header title={title} subtitle="pronto para mais um dia?"/>
                <Flex mt="5" w="100%">
                    <Flex w="100%" gap={4} direction={["column", "column", "column","column","initial"]}>
                        <Flex w={["100%","100%","100%","100%","20%"]}   direction="column" gap="4">
                            <Box w="100%" bg="black.100" p="4" borderRadius="12" >
                                <Text w="100%" fontSize="18" fontWeight="500" color="white" textAlign="center">Total de planos de estudos</Text>
                                <Text fontSize="30" color="white" fontWeight="800" textAlign="center">{infoTotais?.totalTarefas == null ? "..." : infoTotais?.totalPlanoEstudos}</Text>
                            </Box>
                            <Box w="100%" bg="black.100" p="4" borderRadius="12" >
                                <Text w="100%" fontSize="18" fontWeight="500" color="white" textAlign="center">Total de tarefas</Text>
                                <Text fontSize="30" color="white" fontWeight="800" textAlign="center">{infoTotais?.totalTarefas == null ? "..." : infoTotais?.totalTarefas}</Text>
                            </Box>
                            <Box w="100%" bg="black.100" p="4" borderRadius="12" >
                                <Text w="100%" fontSize="18" fontWeight="500" color="white" textAlign="center">Total de objetivos</Text>
                                <Text fontSize="30" color="white" fontWeight="800" textAlign="center">{infoTotais?.totalObjetivo == null ? "..." : infoTotais?.totalObjetivo}</Text>
                            </Box>
                        </Flex >
                        <Flex w={["100%","100%","100%","100%","80%"]}>
                            <Box w="100%" bg="black.100" p="4" borderRadius="12" >

                                <Text w="100%" fontSize="20" fontWeight="600" color="white" textAlign="center">Planos de estudo por status</Text>
                                <Chart options={options} series={dadosPlanoPorStatus} type="bar" height={250}/>
                            </Box>
                        </Flex>
                    </Flex>
                    
                </Flex>
                <Flex mt="5" w="100%">
                    <Flex w="100%" gap={4}>
                        
                        <Flex w="100%" direction="column">
                            <Flex>
                                <Text color="white" fontWeight="600" mr="2" mb="4">Filtre os gráficos por plano de estudo:</Text>
                            <Popover>
                                <PopoverTrigger>
                                <Button size="sm"  borderRadius="6px" pr="0" pl="0" pt="2" pb="2"
                                _hover={{
                                    opacity: 0.65
                                }} >
                                    <Img src={filter} w="50%" cursor="pointer" _hover={{opacity: 0.8}}
                                    ></Img>
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Filtre por plano de estudo</PopoverHeader>
                                    <PopoverBody maxH={["12rem", "12rem", "12rem", "12rem","15rem"]} overflowY="auto">
                                        
                                        {planoEstudo.length > 0 && (
                                            <Button variant="unstyled" _hover={{
                                                bg: '#0097f9',
                                                transition: '0.2s background ease-out',
                                                color: 'white'
                                            }} size="sm" w="100%" 
                                            onClick={() => {filterObjetivoPorPlano("")}}>Todos</Button>
                                        )}
                                        {planoEstudo.length > 0 && (
                                            planoEstudo.map((p, index) => {
                                                if(index < 9){
                                                    return(

                                                        <Button variant="unstyled" key={p.id} _hover={{
                                                            bg: '#0097f9',
                                                            transition: '0.2s background ease-out',
                                                            color: 'white'
                                                        }} size="sm" w="100%" 
                                                        onClick={() => {filterObjetivoPorPlano(p.id)}}>{p.name}</Button>
                                                    )
                                                }
                                                
                                            }) 
                                        )}
                                        
                                        {planoEstudo.length == 0 && (
                                            <Text>Ainda não tem planos cadastrados</Text>
                                        )}
                                        
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                            </Flex>
                            <Flex w="100%" gap={3} direction={["column", "column", "column", "column","initial"]}>
                                <Flex w={["100%", "100%","100%", "100%","33%"]}>
                                    <Box w="100%" bg="black.100" p="4" borderRadius="12" gap={4}>
                                        <Flex gap={2} alignItems="flex-start" justifyContent="flex-start" position="relative">
                                            <Text w="100%" fontSize="20"fontWeight="600" color="white" >Objetivos por plano de estudo</Text>
                                        </Flex>

                                        <Box mt={5}>
                                            <Chart options={optionsTarefa} series={dadosObjetivoPorPlano}  type="pie" height={300} width="100%"/> 
                                        </Box>
                                    </Box>
                                </Flex>
                                <Flex w={["100%", "100%","100%", "100%","33%"]}>
                                    <Box w="100%" bg="black.100" p="4" borderRadius="12" gap={2}>
                                        <Text w="100%" fontSize="20"fontWeight="600" color="white" textAlign="center">Conclusão geral das tarefas</Text>

                                        <Flex bg="black.100" h="90%" borderRadius="6" p="4" direction="column" gap="2" maxH="350" overflowY="auto" align="center" justify="center">

                                            <Flex w="100%" align="center" justify="center" cursor="default" transition="1s ease all" direction="column">
                                                <Flex w="100%" align="center" justify="center" gap={2} cursor="default" transition="1s ease all">
                                                    <Img  src={porcentagemConclusaoTarefa <= 50 ? red : 
                                                    porcentagemConclusaoTarefa >= 50 && porcentagemConclusaoTarefa <= 80 ? yellow : porcentagemConclusaoTarefa > 80 ? green : ""}></Img>

                                                    <Text display="flex" gap="2"  fontSize={["60", "60", "65", "65","80"]} fontWeight="600" color={porcentagemConclusaoTarefa <= 50 ? "red" : 
                                                    porcentagemConclusaoTarefa >= 50 && porcentagemConclusaoTarefa <= 80 ? "yellow" : porcentagemConclusaoTarefa > 80 ? "#32ff27" : "gray"}>
                                                    {porcentagemConclusaoTarefa >= 0 ? porcentagemConclusaoTarefa : 0}%
                                                    </Text>
                                                </Flex>

                                                <Text display="flex" gap="2"  fontSize="15" fontWeight="500" color={porcentagemConclusaoTarefa <= 50 ? "red" : 
                                                porcentagemConclusaoTarefa >= 50 && porcentagemConclusaoTarefa <= 80 ? "yellow" : porcentagemConclusaoTarefa > 80 ? "#32ff27" : "gray"}>

                                                {porcentagemConclusaoTarefa <= 50 ? "Precisa melhorar" : 
                                                porcentagemConclusaoTarefa >= 50 && porcentagemConclusaoTarefa <= 80 ? "Está ficando bom" : porcentagemConclusaoTarefa > 80 ? "Ótimo, agora sim" : ""}
                                                </Text>
                                                
                                            </Flex>

                                            <Flex w="100%" maxH="9rem" overflowY="auto" direction="column">
                                            {tarefasLista.length > 0 && (
                                                
                                                tarefasLista.map((t) => (
                                                    <Flex key={t.tarefaId} color="white" _hover={{
                                                        // bg:'blue.100',
                                                        color: 'blue.100'
                                                    }}
                                                        transition="0.2s ease background"
                                                        w="100%"
                                                        p="2"
                                                        borderRadius="12"
                                                        cursor="pointer">
                                                        <Link to={`/objetivo/${t.objetivoId}`} style={{ width: "100%" }}>
                                                            <Flex w="100%" justifyContent="space-between" pr="1">
                                                                <Text fontWeight="600" w="100%" display="flex" justifyContent="space-between" alignItems="center"
                                                                    fontSize="16" fontStyle="oblique">{t.titulo}
                                                                </Text>
                                                                <Text>{t.isComplete == true ?
                                                                    <Icon as={BsCheck} color="green" fontWeight="600" fontSize="20" /> :
                                                                    // <Icon as={GrFormClose} color="#ccc" fontWeight="600" fontSize="20"/>
                                                                    <Icon as={IoClose} color="red" fontWeight="600" fontSize="20" />}</Text>
                                                            </Flex>
                                                        </Link>
                                                    </Flex>
                                                ))
                                                
                                            )}
                                            </Flex>

                                        </Flex>
                                    </Box>
                                </Flex>
                                <Flex w={["100%", "100%","100%", "100%","33%"]}>
                                    <Box w="100%" bg="black.100" p="4" borderRadius="12" gap={2}>
                                        <Flex justifyItems="space-between">
                                            <Text w="100%" fontSize="20"fontWeight="600" color="white" textAlign="center">Performance Geral</Text>
                                            {/* <Select size="sm" color="white">
                                                <option>Plano de estudo 1</option>
                                            </Select> */}
                                        </Flex>

                                        <Box mt={5}>
                                            <Chart options={optionsPerformance} series={dadosPerformance}  type="radialBar" height={300} width="100%"/>
                                        </Box>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Flex>

                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}