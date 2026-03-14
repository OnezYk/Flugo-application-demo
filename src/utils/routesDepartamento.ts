// Firebase
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore'

// Dados para acesso Firestore
import { db }  from './db'

export type DepartamentoType = { id: string, nome: string, gestor: string }

// Post colaborador -> Firestore
export const postDepartamento = async (departamento: {nome: string, gestor: string}) => {
  
  const snapshot = await getDocs(
    query(collection(db, 'departamentos'), where('nome', '==', departamento.nome))
  )

  if (!snapshot.empty) {
    throw new Error('Já existe um departamento com esse nome.')
  }

  await addDoc(collection(db, 'departamentos'), {
    nome: departamento.nome
  })
}

export const getDepartamentos = async () => {
  const snapshot = await getDocs(collection(db, 'departamentos'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DepartamentoType))
}

export const deleteDepartamento = async (id: string, nome:string) => {

  const snapshot = await getDocs(
    query(collection(db, 'colaboradores'), where('departamento', '==', nome))
  )

  if (!snapshot.empty) {
    throw new Error('Departamento possui colaboradores. Remova-os antes de excluir.')
  }

  return await deleteDoc(doc(db, 'departamentos', id))
    .then(() => console.log('Departamento deletado!'))
    .catch((error) => console.error(error))

}