import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box,
  IconButton,
  Typography,
  DialogTitle,
  Chip,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ColaboradorProp } from '../pages/Colaboradores';
import InputField from './InputField';
import { useForm } from '../hooks/useForm';
import { useEffect, useState } from 'react';
import type { ColaboradorFormData } from '../pages/Formulario';
import InputSelect from './InputSelect';
import { getDepartamentos } from '../utils/routesDepartamento';
import { postColaborador } from '../utils/postColaborador';
import { getColaboradores } from '../utils/getColaborador';

type CrudInfoProps = {

  colaboradorInfo?: string | number,
  title?: string,
  
}

type CrudProps = CrudInfoProps & {
  
  open: boolean,
  colaborador: ColaboradorProp | null,
  handleClose?: () => void,
  refresh: () => void,
  selectedDepartamento: string

}

export const CreateCrud = ({ open, handleClose, refresh, selectedDepartamento}: CrudProps) => {
  // Determine if we are editing or creating
  const {toBRL, onChangeFunc, stringError, salarioError, erroSalarioReason} = useForm()

  
  const [newColaborador, setNewColaborador] = useState<ColaboradorFormData>({
    nome: '',
    email: '',
    departamento: selectedDepartamento, // ← set here
    cargo: '',
    senioridade: '',
    salarioBase: 0,
    dataDeAdmissao: new Date(),
    status: false,
  })

  const resetColaborador = {
    nome: '',
    email: '',
    departamento: '',
    cargo: '',
    senioridade: '',
    salarioBase: 0,
    dataDeAdmissao: new Date(),
    status: false,
  }

  const [colaboradores, setColaboradores] = useState<ColaboradorProp[]>([]) 
  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [errorBtn, setErrorBtn] = useState(false)

  const handleReset = () => {
    setNewColaborador(resetColaborador);
    handleClose?.();
  }

  useEffect(() => {
    getDepartamentos().then(data => setDepartamentos(data.map(e => e.nome)))
    getColaboradores().then(data => setColaboradores(data))
  }, [open])

  const isAllValid = 
  newColaborador.nome.trim() !== '' &&
  newColaborador.email.trim() !== '' &&
  newColaborador.cargo.trim() !== '' &&
  !!newColaborador.salarioBase &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newColaborador.email);

  const handleSubmit = async () => {

    if (isAllValid) {

    await postColaborador(newColaborador);
    refresh();
    handleReset()
  }
}

  const handleClick = () => {
    setErrorBtn(true)

    setTimeout(() => {
      setErrorBtn(false)
    }, 1500);

  }

  const hasGestor = colaboradores.some(
      c => c.departamento === selectedDepartamento && c.senioridade === 'Gestor'
    )

  
return (
    <Dialog 
      open={open} 
      onClose={handleReset}
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          sx:{
          borderRadius: '20px', // Rounder corners for the "floating" look
          padding: 1,
          boxShadow: '0px 20px 50px rgba(0,0,0,0.1)' // Soft deep shadow
        }
        }
      }}
    >

      {/* Header with Close Button */}
      <DialogTitle component='div' sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{display: 'flex',alignItems: 'center', gap: 1}}>
          <Typography variant="h6" fontWeight="bold" sx={{ml: 1}}>
            {`Colaborador: ${newColaborador?.nome}` }
          </Typography>
            <Chip
              label={newColaborador?.status ? "Ativo" : "Inativo"}
              size="medium"
              sx={{
                borderRadius: 1.5,
                bgcolor:
                  newColaborador?.status ? 'success.light' : "error.light",
                color:
                  newColaborador?.status ? "success.main" : "error.main",
                fontWeight: 600,
                fontSize: 12,
              }}
            />
        </Box>
        <IconButton onClick={handleReset}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: 'none', display:'flex',flexDirection: 'column' ,gap:4, mb: 0}}>

        <Box component="form" sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 3, mt: 1}}>

          {/* Infos */}
          <InputField
            info="Nome"
            value={newColaborador.nome}
            error={Boolean(stringError['nome'] || errorBtn)}
            errorCall={stringError['nome'] ? 'caractere inválido' : 'Insira um nome'}
            // Ao digitar, insere valor em val e testa de imediato para prever erro
            onChange={(e) => {

              onChangeFunc(e, (val) => setNewColaborador!(prev => ({...prev!, nome: String(val)})), 'string', 'nome')}}
          />

          <InputField
            info="E-mail"
            value={newColaborador!.email}
            error={stringError['email'] || errorBtn}
            errorCall={stringError['email'] ? 'Insira um e-mail válido!' : 'Insira um e-mail'}
            onChange={(e) => onChangeFunc(e, (val) => setNewColaborador!(prev => ({...prev!, email: String(val)})), 'email', 'email')}
          />

        </Box>

        <Divider></Divider>

        <Box component="form" sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 1 }}>

          {/* Infos */}
          <InputField
            info="Cargo"
            value={newColaborador!.cargo}
            error={stringError['cargo'] || errorBtn}
            errorCall={stringError['cargo'] ? 'Caractere inválido!' : 'Insira um cargo!'}
            // Ao digitar, insere valor em val e testa de imediato para prever erro
            onChange={(e) => onChangeFunc(e, (val) => setNewColaborador!(prev => ({...prev!, cargo: String(val)})), 'string', 'cargo')}
          />

          <InputSelect 
            title='Departamento' 
            items={departamentos} 
            value={String(selectedDepartamento)} 
            onChange={(e) => setNewColaborador(prev => ({...prev!, departamento: e.target.value}))}
            isEdit={false}
          />

          <InputField
            info="Salário"
            value={toBRL(Number(newColaborador!.salarioBase))}
            error={salarioError || errorBtn}
            errorCall={salarioError ? erroSalarioReason : 'Insira um valor'}
            onChange={(e) => onChangeFunc(e, (salarioInput) => setNewColaborador!(prev => ({ ...prev!, salarioBase: Number(salarioInput)})),'number', 'number')}
          />

          <InputSelect 
            title='Senioridade' 
            items={
              newColaborador.senioridade === 'Gestor'
                ? ['Gestor']
                : hasGestor
                  ? ['Estagiário', 'Júnior', 'Pleno', 'Sênior']
                  : ['Estagiário', 'Júnior', 'Pleno', 'Sênior', 'Gestor']
            } 
            value={newColaborador.senioridade === '' ? 'Estagiário' : newColaborador.senioridade} 
            onChange={(e) => setNewColaborador(prev => ({...prev!, senioridade: e.target.value}))}
          />

        </Box>

                



      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between'}}>
          <Button 
            onClick={handleReset}
            variant="contained" 
            sx={{ borderRadius: '10px', px: 4, fontWeight: 'bold', color: 'text.primary', bgcolor: 'text.disabled', ':hover': {bgcolor: '#cfcfcf'}}}
          >
            Cancelar
          </Button>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                !newColaborador?.nome.trim() ||
                !newColaborador?.email.trim() ||
                !newColaborador?.cargo.trim() ||
                !newColaborador?.salarioBase ||
                stringError['email']
              }
              sx={{ borderRadius: '10px', px: 4, fontWeight: 'bold' }}
            >
              Adicionar colaborador
            </Button>
            {!isAllValid && (
              <Box
                onClick={handleClick}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  cursor: 'not-allowed',
                }}
              />
            )}
          </Box>
      </DialogActions>
    </Dialog>
  )};

export default CreateCrud;