import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./db";

export const deleteColaborador = async (id: string) => {

  return await deleteDoc(doc(db, 'colaboradores', id))
    .then(() => console.log('Colaborador deletado!'))
    .catch((error) => console.error(error))

}