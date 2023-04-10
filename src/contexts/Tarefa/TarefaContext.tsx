import { createContext } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { TarefaProps } from "../../@types/tarefa";

interface TarefaContextProps{
    tarefa: TarefaProps[],
    getTarefas: () => Promise<boolean>,
    handleEditTarefa: (id: string, isComplete: boolean) => Promise<boolean>,
    handleDeleteTarefa: (id: string) => Promise<boolean>,
    handleCreateTarefa: (title: string, objetivoId: string) => Promise<boolean>,
}

export const TarefaContext = createContext<TarefaContextProps>(null!);