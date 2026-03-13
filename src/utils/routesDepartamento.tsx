// Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Dados para acesso Firestore
import { db }  from './db'

type DepartamentoType = { id: string, nome: string, gestor: string }

// Post colaborador -> Firestore
export const postDepartamento = async (departamento: {nome: string, gestor: string}) => {
  return await addDoc(collection(db, 'departamentos'), {
    nome: departamento.nome
  })
  .then(() => console.log('success'))
  .catch((error) => console.error(error))
}

export const getDepartamentos = async () => {
  const snapshot = await getDocs(collection(db, 'departamentos'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DepartamentoType))
}