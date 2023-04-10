import { createContext } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";

interface PlanosEstudoContextProps{
    planosEstudo: PlanosEstudoProps[],
    planosEstudoActive: PlanosEstudoProps[],
    planosEstudoDetail: PlanosEstudoProps[],
    getUser: () => Promise<boolean>,
    handleDeletePlano: (id: string) => Promise<void>,
    handleEditPlano: (id: string) => Promise<void>,
    searchPlanoForId: (id: string) => void
    resetPlanoActive: () => void,
}

export const PlanosEstudoContext = createContext<PlanosEstudoContextProps>(null!);