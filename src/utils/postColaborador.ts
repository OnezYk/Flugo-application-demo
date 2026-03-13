// Firebase
import { collection, addDoc } from 'firebase/firestore'

// Dados para acesso Firestore
import { db }  from './db'

// Type
import type { ColaboradorFormData } from '../pages/Formulario'

// Post colaborador -> Firestore
export const postColaborador = async (form: ColaboradorFormData) => {
  return await addDoc(collection(db, 'colaboradores'), {
    nome: form.nome,
    email: form.email.toLowerCase(),
    departamento: form.departamento,
    cargo: form.cargo,
    senioridade: form.senioridade,
    salarioBase: form.salarioBase,
    dataDeAdmissao: form.dataDeAdmissao,
    status: form.status,
  })
  .then(() => console.log('success'))
  .catch((error) => console.error(error))
}

