import { collection, getDocs } from 'firebase/firestore'
import { db }  from './db'
import type { FormData } from '../pages/Formulario'

const getColaboradores = async () => {
  const snapshot = await getDocs(collection(db, 'colaboradores'))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as FormData
  }))

}
  
export default getColaboradores