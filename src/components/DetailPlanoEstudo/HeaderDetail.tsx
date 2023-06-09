import { Box, Flex, Progress,Text, useMenuContext } from "@chakra-ui/react";
import { theme } from "../../theme";
import Chart from 'react-apexcharts';
import { useContext, useEffect, useState } from "react";
import { detailPlanoObjetivo } from "../../@types/detailPlano";
import { ObjetivoContext } from "../../contexts/Objetivos/ObjetivoContext";
import { TarefaContext } from "../../contexts/Tarefa/TarefaContext";
import { PlanosEstudoContext } from "../../contexts/PlanosEstudo/PlanosEstudoContext";
import { ObjetivoProps } from "../../@types/objetivo";

const options: any = {
    chart:{
        
        zoom:{
            enabled:false,
        },
        foreColor:  theme.colors.gray[500],
    },
    plotOptions:{
        bar:{
            horizontal: false
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
    labels: ['Abertos', 'Em andamento', 'Concluídos'],
    colors: ['#075fe4','#072655', '#88b4ff'],
    
    xaxis:{
        // type: 'datetime',
        axisBorder:{
            color:theme.colors.gray[600],
        },
        axisTicks:{
            color:'white',
        },
        categories: ['Abertos', 'Em andamento', 'Concluídos'],
    },
    yaxis:{
        show:false
    },
    fill:{
        // opacity: 0.3,
        // type: 'gradient',
        colors: ['#075fe4','#072655', '#88b4ff'],
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

interface HeaderDetailProps{
    planoEstudoId: string
}

export function HeaderDetail({planoEstudoId}: HeaderDetailProps){

    const objetivos = useContext(ObjetivoContext);
    const tarefas = useContext(TarefaContext);
    const [dadosObjetivo, setDadosObjetivo] = useState([]);
    const [totalObjetivosEmAndamento, setTotalObjetivosEmAndamento]= useState(0);

    const [detailPlanoObjetivo, setDetailPlanoObjetivo] = useState<detailPlanoObjetivo[]>([]);
    const [objetivosArray, setObjetivosArray] = useState<ObjetivoProps[]>([])
    const [loadingDados, setLoadingDados] = useState(true);

    
    useEffect(() => {
        ///Calculo de total de objetivos

        searchDetail(planoEstudoId).then((res) => {
            //Fazer uma logica pra buscar as tarefas antes de continuar, pois está vindo vazio, o restante está funcionando.

            if(res){
                const objetivosTotal = res.filter(objt => objt.planoEstudoId == planoEstudoId);
                const totalObjetivosCadastrados = res.filter(objt => objt.planoEstudoId == planoEstudoId).length;

                searchTarefas().then((resTarefa) => {
                    var totalObjetivosConcluidos = objetivosTotal.filter(obj => obj.statusObjetivo === "Concluido").length;
            
                    const porcentagemConclusao = Number(((totalObjetivosConcluidos / totalObjetivosCadastrados) * 100).toFixed(0));
                    
                    setDetailPlanoObjetivo([{
                        porcentagemConclusaoPlano: porcentagemConclusao? porcentagemConclusao : 0,
                        totalObjetivo: totalObjetivosCadastrados,
                        totalObjetivoConcluido: totalObjetivosConcluidos,
                    }]);
            
                    //calculo dos dados do grafico
            
                    var totalObjetivosEmAndamento_ = objetivosTotal.filter(obj => obj.statusObjetivo == "Em andamento").length;
                    var totalObjetivosEmAberto = objetivosTotal.filter(obj => obj.statusObjetivo === "Aberto").length;
                    setDadosObjetivo([{data: [totalObjetivosEmAberto, totalObjetivosEmAndamento_, totalObjetivosConcluidos]}]);
                    setLoadingDados(false);
                })
            }
        });
        
    }, [planoEstudoId]);

    async function searchDetail(id_: string){
        var search_ = await objetivos.searchObjetivoForId(id_);
        setObjetivosArray(search_);
        
        return search_;
    }

    async function searchTarefas(){
        var searchTarefas = await tarefas.getTarefas();

        return searchTarefas;
    }

        return(
            <>
            {loadingDados == false && (
                <Flex mt="5" w="100%" bg="black.100" borderRadius="6" p="4" gap="6" direction={["column", "column","initial"]}>
                    <Box w={["100%","100%","60%" ]}>
                        <Text fontSize="17" color="white" fontWeight="600">Porcentagem de conclusão de seu plano de estudo: {detailPlanoObjetivo[0]?.porcentagemConclusaoPlano.toFixed(0)}%</Text>
                        <Box mt="4">
                            <Progress mt="1" value={Number(detailPlanoObjetivo[0]?.porcentagemConclusaoPlano.toFixed(0))} size='lg' colorScheme='blue' />
                        </Box>
                        
                        {/* implementar filtros */}
                        <Box textAlign="left" mt="10">
                        </Box>
                        <Box textAlign="left">
                        </Box>

                    </Box>
                    <Box w={["100%","100%","40%" ]}>
                        <Text fontSize="17" textAlign="center" color="whitesmoke" fontWeight="600">Relação entre objetivos abertos, concluídos e em andamento</Text>
                            <Chart options={options} series={dadosObjetivo} type="bar" height={150}/>
                        {/* <p>{dadosObjetivo[0].length}</p> */}
                        
                    </Box>
                </Flex>
            )}

                
            </>
        )
    
}