import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ObjetivoProps } from "../../@types/objetivo";
import { app } from "../../services/firebaseAuth";
import { ObjetivoContext } from "./ObjetivoContext";

export function ObjetivoProvider({children}: {children: JSX.Element}){

    const[objetivo, setObjetivo] = useState<ObjetivoProps[]>([]);

    const db = getFirestore(app);
    const objetivoCollectionRef = collection(db, "objetivo");

    useEffect(() => {
        getObjetivo();
    }, []);

    async function getObjetivo(){
        const data = await getDocs(objetivoCollectionRef);
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayObjetivo: ObjetivoProps[] = [];
        array[0].forEach(doc_ => {
            var objeto_ = {
                id_objetive: doc_.id,
                planoEstudoId: doc_.planoEstudoId,
                titulo: doc_.titulo,
                texto_chave: doc_.texto_chave,
                descricao: doc_.descricao,
                dataInicio: doc_.dataInicio,
                dataFim: doc_.dataFim
            }

            arrayObjetivo.push(objeto_);
            
        })

        setObjetivo(arrayObjetivo);
        return true;
    }

    async function editObjetivo(objetivoId: string){
        
        return true;
    }
    
    async function deleteObjetivo(objetivoId: string){
        const objetivoDoc = doc(db, "objetivo", objetivoId);
        await deleteDoc(objetivoDoc);
        getObjetivo();
        
        return true;
    }
    

    return(
        <ObjetivoContext.Provider value={{objetivo, editObjetivo, deleteObjetivo, getObjetivo}}>
            { children }
        </ObjetivoContext.Provider>
    )
}