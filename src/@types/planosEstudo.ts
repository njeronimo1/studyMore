export interface PlanosEstudoProps{
    id: string;
    name: string;
    objetive: string;
    date_create: string;
    statusPlano?: string;
}

export interface PlanosEstudoPaginationProps{
    PlanosEstudoArray: PlanosEstudoProps[];
}