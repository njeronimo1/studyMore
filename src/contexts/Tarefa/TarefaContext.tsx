import { createContext } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { TarefaProps } from "../../@types/tarefa";

interface TarefaContextProps{
    tarefa: TarefaProps[],
    getTarefas: () => Promise<TarefaProps[]>,
    handleEditTarefa: (id: string, isComplete: boolean, objetivoId: string) => Promise<TarefaProps[]>,
    handleDeleteTarefa: (id: string) => Promise<boolean>,
    handleCreateTarefa: (title: string, objetivoId: string) => Promise<TarefaProps[]>,
}

export const TarefaContext = createContext<TarefaContextProps>(null!);