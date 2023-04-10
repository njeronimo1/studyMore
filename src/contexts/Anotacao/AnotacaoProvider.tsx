import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AnotacaoProps } from "../../@types/anotacao";
import { app } from "../../services/firebaseAuth";
import { AnotacaoContext } from "./AnotacaoContext";

export function AnotacaoProvider({children}: {children:JSX.Element}){

    const[anotacao, setAnotacao] = useState<AnotacaoProps[]>([]);

    const db = getFirestore(app);
    const anotacaoCollectionRef = collection(db, "anotacao");

    useEffect(() => {
        getAnotacao();
    }, []);

    async function getAnotacao(){
        const data = await getDocs(anotacaoCollectionRef);
        const array: any = [data.docs.map((doc) => ({...doc.data(), id:doc.id }))];
        
        const arrayAnotacao: AnotacaoProps[] = [];
        array[0].forEach(doc_ => {
            var objeto_ = {
                anotacaoId: doc_.id,
                objetivoId: doc_.objetivoId,
                titulo: doc_.titulo,
                descricao: doc_.descricao,
            }

            arrayAnotacao.push(objeto_);
            
        })

        // console.log(arrayObjetivo, 'provider');
        setAnotacao(arrayAnotacao);
        return true;
    }

    async function editAnotacao(anotacaoId: string, titulo: string, descricao: string, objetivoId: string){
        if(anotacaoId == ''){
            const createAnotacao = await addDoc(anotacaoCollectionRef, {
                titulo,
                descricao,
                objetivoId
            })
        }else{
            const anotacaoDoc = doc(db, "anotacao", anotacaoId);
            const newFields = {titulo: titulo, descricao: descricao};
            await updateDoc(anotacaoDoc, newFields);
        }

        const anotacao_ = await getAnotacao();

        if(anotacao_){
            return true;
        }
    }

    async function deleteAnotacao(anotacaoId: string){
        return true;
    }

    return(
        <AnotacaoContext.Provider value={{getAnotacao, anotacao, editAnotacao, deleteAnotacao}}>
            {children}
        </AnotacaoContext.Provider>
    )
}