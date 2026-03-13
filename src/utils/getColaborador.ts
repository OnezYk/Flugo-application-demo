// Firebase
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Dados para acesso Firestore
import { db }  from './db';

// Componentes
import type { ColaboradorFormData } from '../pages/Formulario';

//Função poli-rota
export const getColaboradores = async (field: string = 'nome', order: 'asc' | 'desc' = 'asc') => {
  const q = query(collection(db, 'colaboradores'), orderBy(field, order))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as ColaboradorFormData
  }))
};


  