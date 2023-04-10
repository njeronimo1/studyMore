import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { app } from "../../services/firebaseAuth";
import { PlanosEstudoContext } from "./PlanosEstudoContext";


export function PlanosEstudoProvider({children}: {children: JSX.Element}){

    const [planosEstudo, setPlanosEstudo] = useState<PlanosEstudoProps[]>([]);
    const [planosEstudoActive, setPlanosEstudoActive] = useState<PlanosEstudoProps[]>([]);
    const [planosEstudoDetail, setPlanosEstudoDetail] = useState<PlanosEstudoProps[]>([]);

    const db = getFirestore(app);
    const planoEstudoCollectionRef = collection(db, "planos-estudo");

    useEffect(() => {
        
        getUser();
    }, []);

    async function getUser(){
        // setLoading(true);
        const data = await getDocs(planoEstudoCollectionRef);
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayPlanoEstudo: PlanosEstudoProps[] = [];
        array[0].forEach(doc_ => {
            var objetoPlanoEstudo = {
                id: doc_.id,
                name: doc_.name,
                objetive: doc_.objetive,
                date_create: doc_.date_create
            }

            arrayPlanoEstudo.push(objetoPlanoEstudo);
            
        })

        setPlanosEstudo(arrayPlanoEstudo);

        return true;
        // setPlanosEstudoFilter(arrayPlanoEstudo);
        // setLoading(false);
    }

    async function handleDeletePlano(id: string){
        const planoDoc = doc(db, "planos-estudo", id);
        await deleteDoc(planoDoc);
        getUser();
    }

    async function handleEditPlano(id: string){
        let planosEstudo_ = await planosEstudo.filter(p => p.id === id);
        setPlanosEstudoActive(planosEstudo_);
        // setIsOpenModal(true);
    }

    function searchPlanoForId(id: string){
        let planosEstudo_ = planosEstudo.filter(p => p.id == id);
        setPlanosEstudoDetail(planosEstudo_);
        
    }

    function resetPlanoActive(){
        setPlanosEstudoActive([]);
    }

    

    return(
        <>
            <PlanosEstudoContext.Provider value={{planosEstudo, planosEstudoActive, getUser, handleDeletePlano, handleEditPlano, searchPlanoForId, resetPlanoActive, planosEstudoDetail}}>
                { children }
            </PlanosEstudoContext.Provider>
        </>
    )
}