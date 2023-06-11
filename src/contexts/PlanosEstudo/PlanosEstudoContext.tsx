import { createContext } from "react";
import { PlanosEstudoPaginationProps, PlanosEstudoProps } from "../../@types/planosEstudo";

interface PlanosEstudoContextProps{
    planosEstudo: PlanosEstudoProps[],
    planosEstudoActive: PlanosEstudoProps[],
    planosEstudoDetail: PlanosEstudoProps[],
    getPlanoEstudo: () => Promise<PlanosEstudoProps[]>,
    getPlanoEstudoPagination: () => Promise<PlanosEstudoPaginationProps[]>,
    handleDeletePlano: (id: string) => Promise<void>,
    handleEditPlano: (id: string) => Promise<void>,
    searchPlanoForId: (id: string) => Promise<PlanosEstudoProps[]>
    resetPlanoActive: () => void,
    loading: boolean;
}

export const PlanosEstudoContext = createContext<PlanosEstudoContextProps>(null!);