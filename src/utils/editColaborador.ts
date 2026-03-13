import { doc, updateDoc } from 'firebase/firestore'
import { db } from './db'
import type { ColaboradorFormData } from '../pages/Formulario'

export const putColaborador = async (id: string, form: ColaboradorFormData) => {
  return await updateDoc(doc(db, 'colaboradores', id), {
    nome: form.nome,
    email: form.email.toLowerCase(),
    departamento: form.departamento,
    cargo: form.cargo,
    senioridade: form.senioridade,
    salarioBase: form.salarioBase,
    status: form.status,
  })
  .then(() => console.log('updated'))
  .catch((error) => console.error(error))
}