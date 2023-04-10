import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { TarefaProps } from "../../@types/tarefa";
import { app } from "../../services/firebaseAuth";
import { TarefaContext } from "./TarefaContext";


export function TarefaProvider({children}: {children: JSX.Element}){

    const [tarefa, setTarefa] = useState<TarefaProps[]>([]);
    

    const db = getFirestore(app);
    const tarefaCollectionRef = collection(db, "tarefa");

    useEffect(() => {
        getTarefas();
    }, []);

    async function getTarefas(){
        const data = await getDocs(tarefaCollectionRef);
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayTarefa: TarefaProps[] = [];
        array[0].forEach(doc_ => {
            var objetoTarefa = {
                tarefaId: doc_.id,
                objetivoId: doc_.objetivoId,
                titulo: doc_.titulo,
                isComplete: doc_.isComplete,
            }

            arrayTarefa.push(objetoTarefa);
            
        })

        setTarefa(arrayTarefa);

        

        return true;
    }

    async function handleEditTarefa(id: string, isComplete: boolean){
        const tarefaDoc = doc(db, "tarefa", id);
        const newFields = {isComplete: isComplete};
        await updateDoc(tarefaDoc, newFields);
        
        getTarefas();

        return true;
    }

    async function handleDeleteTarefa(id: string){
        const tarefaDoc = doc(db, "tarefa", id);
        await deleteDoc(tarefaDoc);
        getTarefas();
        
        return true;
    }

    async function handleCreateTarefa(title: string, objetivoId: string){
        const createPlanoEstudo = await addDoc(tarefaCollectionRef, {
            titulo: title,
            isComplete: false,
            objetivoId: objetivoId
        });
        getTarefas();
        
        return true;
    }

    return(
        <>
            <TarefaContext.Provider value={{tarefa, getTarefas, handleDeleteTarefa, handleEditTarefa, handleCreateTarefa}}>
                { children }
            </TarefaContext.Provider>
        </>
    )
}