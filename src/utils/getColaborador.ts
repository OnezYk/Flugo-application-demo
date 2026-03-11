import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db }  from './db'
import type { FormData } from '../pages/Formulario'

export const getColaboradores = async (field: string = 'nome', order: 'asc' | 'desc' = 'asc') => {
  const q = query(collection(db, 'colaboradores'), orderBy(field, order))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as FormData
  }))
}


  