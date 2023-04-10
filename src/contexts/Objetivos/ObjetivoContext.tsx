import { createContext } from "react";
import { ObjetivoProps } from "../../@types/objetivo";

interface objetivoContextProps{
    objetivo: ObjetivoProps[],
    getObjetivo: () => Promise<boolean>
    editObjetivo: (objetivoId: string) => Promise<boolean>,
    deleteObjetivo: (objetivoId: string) => Promise<boolean>
}

export const ObjetivoContext = createContext<objetivoContextProps>(null!)