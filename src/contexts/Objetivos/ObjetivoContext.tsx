import { createContext } from "react";
import { ObjetivoProps, ObjetivoPropsPaginationProps } from "../../@types/objetivo";
import { TarefaProps } from "../../@types/tarefa";

interface objetivoContextProps{
    objetivo: ObjetivoProps[],
    getObjetivo: () => Promise<ObjetivoProps[]>
    getObjetivoPagination: (planoEstudoId: string) => Promise<ObjetivoPropsPaginationProps[]>
    editObjetivo: (objetivoId: string, tarefas: TarefaProps[]) => Promise<string>,
    deleteObjetivo: (objetivoId: string) => Promise<boolean>,
    searchObjetivoForId: (id: string) => Promise<ObjetivoProps[]>,
    searchObjetivoForObjId: (objetivoId: string) => Promise<ObjetivoProps[]>,
    updateStatusPlano: (objetivoId: string) => Promise<boolean>
}

export const ObjetivoContext = createContext<objetivoContextProps>(null!)