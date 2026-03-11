import { collection, addDoc } from 'firebase/firestore'
import { db }  from './db'
import type { FormData } from '../pages/Formulario'

export const postColaborador = async (form: FormData) => {
  return await addDoc(collection(db, 'colaboradores'), {
    nome: form.nome,
    email: form.email,
    departamento: form.departamento,
    status: form.status,
  })
  .then(() => console.log('success'))
  .catch((error) => console.error(error))
}

