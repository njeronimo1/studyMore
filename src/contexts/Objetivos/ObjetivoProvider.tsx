import { collection, deleteDoc, doc, getDocs, updateDoc, getFirestore, query, where, orderBy } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ObjetivoProps, ObjetivoPropsPaginationProps } from "../../@types/objetivo";
import { app } from "../../services/firebaseAuth";
import { ObjetivoContext } from "./ObjetivoContext";
import { TarefaProps } from "../../@types/tarefa";
import { AuthContext } from "../Auth/AuthContext";

export function ObjetivoProvider({children}: {children: JSX.Element}){

    const[objetivo, setObjetivo] = useState<ObjetivoProps[]>([]);
    const auth = useContext(AuthContext);

    const db = getFirestore(app);
    // const objetivoCollectionRef = collection(db, "objetivo");

    // var usuario:any = localStorage.getItem('usuario');
    var usuario:any = auth.user;

    const objetivoCollectionRef = query(collection(db, "objetivo"), where("usuarioId", "==", usuario ? usuario.uid ? usuario.uid : usuario.id : ""), orderBy("dataInicio"))

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
                dataFim: doc_.dataFim,
                statusObjetivo: doc_.statusObjetivo
            }

            arrayObjetivo.push(objeto_);
            
        })

        setObjetivo(arrayObjetivo);
        return arrayObjetivo;
    }

    async function getObjetivoPagination(planoEstudoId: string){
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
                dataFim: doc_.dataFim,
                statusObjetivo: doc_.statusObjetivo
            }

            arrayObjetivo.push(objeto_);
            
        })
        var arrayFiltrado = arrayObjetivo.filter(f => f.planoEstudoId == planoEstudoId);

        var arrayFilter:ObjetivoPropsPaginationProps[] = [];
        var limit = 6;

        for (var i = 0; i < arrayFiltrado.length; i = i + limit) {
            var array_slice = arrayFiltrado.slice(i, i + limit);
            var objeto = {ObjetivoArray: array_slice};
            
            arrayFilter.push(objeto);
        }

        return arrayFilter;
    }

    ///Editar status do objetivo
    async function editObjetivo(objetivoId: string, tarefas: TarefaProps[]){
    // Aberto = Temos um objetivo, mas nenhuma tarefa completa.
    // Em andamento = Temos um objetivo, mas não temos todas as tarefas completas.
    // Concluido = Temo um objetivo com todas as tarefas completas.
        

        var objetivoTotalTarefas = tarefas.length;
        var objetivoTotalTarefasCompletas = tarefas.filter(t => t.isComplete == true);

        const objetivoDoc = doc(db, "objetivo", objetivoId);

        //objetivo aberto
        if(objetivoTotalTarefasCompletas.length == 0){

            const newFields = {statusObjetivo: 'Aberto'};
            await updateDoc(objetivoDoc, newFields);

            return objetivoId;
        }

        //objetivo em andamento
        if(objetivoTotalTarefasCompletas.length > 0 && objetivoTotalTarefasCompletas.length < objetivoTotalTarefas){
            
            const newFields = {statusObjetivo: 'Em andamento'};
            await updateDoc(objetivoDoc, newFields);
            
            return objetivoId;
        }

        //objetivo concluido
        if(objetivoTotalTarefasCompletas.length > 0 && objetivoTotalTarefasCompletas.length === objetivoTotalTarefas){

            const newFields = {statusObjetivo: 'Concluido'};
            await updateDoc(objetivoDoc, newFields);

            return objetivoId;
        }

        await updateStatusPlano(objetivoId);
        return "false";
    }

    async function updateStatusPlano(objetivoId: string){
        // console.log(objetivoId);
        
        const execult = await searchObjetivoForObjId(objetivoId).then((result) => {
            var planoEstudoId = result[0].planoEstudoId;

            const planoDoc = doc(db, "planos-estudo", planoEstudoId);
            
            var resultado = false;

            searchObjetivoForId(planoEstudoId).then(async (res) => {
                var objetivoTotal = res.length;
                var objetivoTotalCompleto = res.filter(t => t.statusObjetivo == "Concluido");
                var objetivoTotalAndamento = res.filter(t => t.statusObjetivo == "Em andamento");
                var objetivoTotalAberto = res.filter(t => t.statusObjetivo == "Aberto");

                //plano estudo aberto
                if(objetivoTotalCompleto.length == 0 && objetivoTotalAndamento.length == 0){

                    const newFields = {statusPlano: 'Aberto'};
                    await updateDoc(planoDoc, newFields);

                    resultado = true;
                    return resultado;
                }

                //plano estudo em andamento
                if(objetivoTotalAndamento.length > 0 || objetivoTotalAberto.length > 0 && objetivoTotalCompleto.length < objetivoTotal){
                    
                    const newFields = {statusPlano: 'Em andamento'};
                    await updateDoc(planoDoc, newFields);
                    
                    resultado = true;
                    return resultado;
                }

                //plano estudo concluido
                if(objetivoTotalCompleto.length > 0 && objetivoTotalCompleto.length === objetivoTotal){

                    const newFields = {statusPlano: 'Concluido'};
                    await updateDoc(planoDoc, newFields);

                    resultado = true;
                    return resultado;
                }


                resultado = false;
                return resultado;
            })    

            return resultado;
        })

        return execult;

    }
    
    async function deleteObjetivo(objetivoId: string){
        const objetivoDoc = doc(db, "objetivo", objetivoId);
        await deleteDoc(objetivoDoc);
        getObjetivo();
        
        return true;
    }

    async function searchObjetivoForId(id: string){
        // let planosEstudo_ = planosEstudo.filter(p => p.id == id);

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
                dataFim: doc_.dataFim,
                statusObjetivo: doc_.statusObjetivo
            }

            arrayObjetivo.push(objeto_);
            
        })

        return arrayObjetivo.filter(m => m.planoEstudoId === id);
    }

    async function searchObjetivoForObjId(objetivoId: string){
        // let planosEstudo_ = planosEstudo.filter(p => p.id == id);
        console.log(objetivoId);
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
                dataFim: doc_.dataFim,
                statusObjetivo: doc_.statusObjetivo
            }

            arrayObjetivo.push(objeto_);
            
        })
       
        return arrayObjetivo.filter(m => m.id_objetive === objetivoId);
    }
    

    return(
        <ObjetivoContext.Provider value={{objetivo, editObjetivo, deleteObjetivo, getObjetivo, searchObjetivoForId, searchObjetivoForObjId, updateStatusPlano,
            getObjetivoPagination}}>
            { children }
        </ObjetivoContext.Provider>
    )
}