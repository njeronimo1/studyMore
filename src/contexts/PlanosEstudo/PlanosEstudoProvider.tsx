import { collection, deleteDoc, doc, endBefore, getDocs, getFirestore, limit, orderBy, query, startAt, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { PlanosEstudoPaginationProps, PlanosEstudoProps } from "../../@types/planosEstudo";
import { app } from "../../services/firebaseAuth";
import { PlanosEstudoContext } from "./PlanosEstudoContext";
import { AuthContext } from "../Auth/AuthContext";
import { ObjetivoContext } from "../Objetivos/ObjetivoContext";


export function PlanosEstudoProvider({children}: {children: JSX.Element}){

    const [planosEstudo, setPlanosEstudo] = useState<PlanosEstudoProps[]>([]);
    const [planosEstudoActive, setPlanosEstudoActive] = useState<PlanosEstudoProps[]>([]);
    const [planosEstudoDetail, setPlanosEstudoDetail] = useState<PlanosEstudoProps[]>([]);
    const objetivoContext = useContext(ObjetivoContext);

    const db = getFirestore(app);
    var usuario:any = localStorage.getItem('usuario');
    if(usuario) usuario = JSON.parse(usuario);
    
    const planoEstudoCollectionRef = query(collection(db, "planos-estudo"), where("usuarioId", "==", usuario ? usuario.uid ? usuario.uid : usuario.id : ""), orderBy("date_create", "desc"));

    useEffect(() => {
        
        getPlanoEstudo();
        getPlanoEstudoPagination();
    }, []);

    async function getPlanoEstudo(){
        
        const data = (await getDocs(planoEstudoCollectionRef));
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayPlanoEstudo: PlanosEstudoProps[] = [];
        array[0].forEach(doc_ => {
            var objetoPlanoEstudo = {
                id: doc_.id,
                name: doc_.name,
                objetive: doc_.objetive,
                date_create: doc_.date_create,
                statusPlano: doc_.statusPlano
            }

            arrayPlanoEstudo.push(objetoPlanoEstudo);
            
        })

        setPlanosEstudo(arrayPlanoEstudo);

        return arrayPlanoEstudo;
    } 

    async function getPlanoEstudoPagination(){
        
        const data = (await getDocs(planoEstudoCollectionRef));
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayPlanoEstudo: PlanosEstudoProps[] = [];
        array[0].forEach(doc_ => {
            var objetoPlanoEstudo = {
                id: doc_.id,
                name: doc_.name,
                objetive: doc_.objetive,
                date_create: doc_.date_create,
                statusPlano: doc_.statusPlano
            }

            arrayPlanoEstudo.push(objetoPlanoEstudo);
            
        });

        var arrayFilter:PlanosEstudoPaginationProps[] = [];
        var limit = 8;

        for (var i = 0; i < arrayPlanoEstudo.length; i = i + limit) {
            var array_slice = arrayPlanoEstudo.slice(i, i + limit);
            var objeto = {PlanosEstudoArray: array_slice};
            
            arrayFilter.push(objeto);
        }

        return arrayFilter;
    } 

    async function handleDeletePlano(id: string){
        const planoDoc = doc(db, "planos-estudo", id);
        await deleteDoc(planoDoc);
        getPlanoEstudo();
    }

    async function handleEditPlano(id: string){
        let planosEstudo_ = await planosEstudo.filter(p => p.id === id);
        setPlanosEstudoActive(planosEstudo_);
    }

    async function searchPlanoForId(id: string){

        const data = await getDocs(planoEstudoCollectionRef);
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayPlanoEstudo: PlanosEstudoProps[] = [];
        array[0].forEach(doc_ => {
            var objetoPlanoEstudo = {
                id: doc_.id,
                name: doc_.name,
                objetive: doc_.objetive,
                date_create: doc_.date_create,
                statusPlano: doc_.statusPlano
            }

            arrayPlanoEstudo.push(objetoPlanoEstudo);
            
        })

        return arrayPlanoEstudo.filter(m => m.id === id);
    }

    function resetPlanoActive(){
        setPlanosEstudoActive([]);
    }

    return(
        <>
            <PlanosEstudoContext.Provider value={{planosEstudo, planosEstudoActive, getPlanoEstudo, handleDeletePlano, handleEditPlano, searchPlanoForId, resetPlanoActive, planosEstudoDetail
            ,getPlanoEstudoPagination}}>
                { children }
            </PlanosEstudoContext.Provider>
        </>
    )
}