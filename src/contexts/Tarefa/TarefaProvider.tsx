import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { PlanosEstudoProps } from "../../@types/planosEstudo";
import { TarefaProps } from "../../@types/tarefa";
import { app } from "../../services/firebaseAuth";
import { TarefaContext } from "./TarefaContext";
import { AuthContext } from "../Auth/AuthContext";


export function TarefaProvider({children}: {children: JSX.Element}){

    const [tarefa, setTarefa] = useState<TarefaProps[]>([]);
    const auth = useContext(AuthContext);
    

    const db = getFirestore(app);
    const tarefaCollectionRefCreate = collection(db, "tarefa");

    // var usuario:any = localStorage.getItem('usuario');
    var usuario:any = auth.user;

    const tarefaCollectionRef = query(collection(db, "tarefa"), where("usuarioId", "==", usuario ? usuario.uid ? usuario.uid : usuario.id : ""))

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

        return arrayTarefa;
    }

    async function handleEditTarefa(id: string, isComplete: boolean, objetivoId: string){
        const tarefaDoc = doc(db, "tarefa", id);
        const newFields = {isComplete: isComplete};
        await updateDoc(tarefaDoc, newFields);
        
        const tarefas = await getTarefas().then((data) => {
            
            const filterTarefa = data.filter(t => t.objetivoId == objetivoId);
            return filterTarefa;

        });

        return tarefas;
    }

    async function handleDeleteTarefa(id: string){
        const tarefaDoc = doc(db, "tarefa", id);
        await deleteDoc(tarefaDoc);
        getTarefas();
        
        return true;
    }

    async function handleCreateTarefa(title: string, objetivoId: string){
        const createPlanoEstudo = await addDoc(tarefaCollectionRefCreate, {
            titulo: title,
            isComplete: false,
            objetivoId: objetivoId,
            usuarioId: usuario ? usuario.uid ? usuario.uid : usuario.id : ""
        });
        
        const tarefas = await getTarefas().then((data) => {
            
            const filterTarefa = data.filter(t => t.objetivoId == objetivoId);
            return filterTarefa;

        });

        return tarefas;
    }

    return(
        <>
            <TarefaContext.Provider value={{tarefa, getTarefas, handleDeleteTarefa, handleEditTarefa, handleCreateTarefa}}>
                { children }
            </TarefaContext.Provider>
        </>
    )
}