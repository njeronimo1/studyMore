import { createContext } from "react";
import { AnotacaoProps } from "../../@types/anotacao";

interface AnotacaoContextProps{
    anotacao:       AnotacaoProps[],
    getAnotacao:    () => Promise<boolean>
    editAnotacao:   (anotacaoId: string, titulo:string, descricao: string, objetivoId: string) => Promise<boolean>,
    deleteAnotacao: (anotacaoId: string) => Promise<boolean>
}

export const AnotacaoContext = createContext<AnotacaoContextProps>(null!)