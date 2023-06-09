export interface ObjetivoProps{
    id_objetive: string,
    planoEstudoId: string,
    titulo: string,
    texto_chave: string,
    descricao: string,
    dataInicio: string,
    dataFim: string,
    statusObjetivo?: string
}

export interface ObjetivoPropsPaginationProps{
    ObjetivoArray: ObjetivoProps[];
}