// Firebase
import { collection, addDoc } from 'firebase/firestore'

// Dados para acesso Firestore
import { db }  from './db'

// Type
import type { FormData } from '../pages/Formulario'

// Post colaborador -> Firestore
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

