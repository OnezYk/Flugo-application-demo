import { useState } from "react"
import type { ColaboradorFormData } from "../pages/Formulario"

export const useForm = (form?: ColaboradorFormData) => {

  const [salarioError, setSalarioError] = useState(false)
  const [stringError, setStringError] = useState<Record<string, boolean>>({})
  const [erroSalarioReason, setErroSalarioReason] = useState('false')

  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement, Element>, assignFunc: (val : number | string) => void, type:string, field:string) => {

    if (type == 'number') {

      const salarioInput = Number(e.target.value.replace(/\D/g, "").slice(0, 9)) / 100;
      if (salarioInput > 40000) { setSalarioError(true); setErroSalarioReason('Salário alto detectado, deseja prosseguir?') }
      else { setSalarioError(false) }
      assignFunc(salarioInput)


    }

    if (type == 'string') {
      const nameNegator = /[^a-zA-ZÀ-ÿ\s]/g;
      const val = e.target.value;
      setStringError(prev => ({ ...prev, [field]: /[^a-zA-ZÀ-ÿ\s]/.test(val) }))
      assignFunc(val.replace(nameNegator, ''))
    }

    if (type == 'email') {
      const val = e.target.value;
      setStringError(prev => ({ ...prev, [field]: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) }))
      assignFunc(val)
    }

  } 

  const isEmptyCheck = (e: React.ChangeEvent<HTMLInputElement, Element>) => {
    
    const val = e.target.value

    const isEmpty = () => {
      if (typeof val === 'number') return val === 0
    return val.trim() === ''
}

    return  isEmpty

  }

  const toBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form?.email ?? '') && /^[a-zA-ZÀ-ÿ\s]+$/.test(form?.nome ?? '');
    const isNomeValid = /^[a-zA-ZÀ-ÿ\s]+$/.test(form?.nome ?? '');

  return {toBRL, onChangeFunc, isEmptyCheck, stringError, salarioError, erroSalarioReason, isValid, isNomeValid}

} 