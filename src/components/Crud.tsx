import { useForm } from '../hooks/useForm';
import { useEffect, useState } from 'react';

import {  Dialog,  DialogContent,  DialogActions,  Button,  Box, IconButton, Typography, DialogTitle, Chip, Divider} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import InputField from './InputField';
import InputSelect from './InputSelect';

import { putColaborador } from '../utils/editColaborador';
import { getDepartamentos } from '../utils/routesDepartamento';

import type { ColaboradorProp } from '../pages/Colaboradores';
import type { ColaboradorFormData } from '../pages/Formulario';

type CrudInfoProps = {

  colaboradorInfo?: string | number,
  title?: string,
  isEdit: boolean,
  
}

type CrudProps = CrudInfoProps & {
  
  open: boolean,
  colaborador: ColaboradorProp | null,
  handleClose?: () => void,
  refresh: () => void,
  colaboradores: ColaboradorProp[]

}

// Floating tab para visualização / edição via condição: isEdit 
export const Crud = ({ open, handleClose, colaborador, isEdit, refresh, colaboradores}: CrudProps) => {

  const {toBRL, onChangeFunc, stringError, salarioError, erroSalarioReason} = useForm()

  const [editColaborador, setEditColaborador] = useState<ColaboradorFormData | null>(colaborador ?? null)
  const [departamentos, setDepartamentos] = useState<string[]>([])

  // Reset e fechamento do formulário
  const handleReset = () => {
    setEditColaborador(colaborador);
    handleClose?.();
  }

  // Fetch para opções de realocação de departamentos existentes
  useEffect(() => {

    getDepartamentos().then(data => 
      setDepartamentos(data.map(e => e.nome)))

  }, [])

  if (!colaborador) {
    return null
  }

  // Para prevenir renderização nula de "EditColaborador", ele copia os valores do colaborador
  const displayData = editColaborador ?? colaborador;

  // Submit, re-fetch e fechamento da tab
  const handleSubmit = () => {

    putColaborador(colaborador.id, editColaborador!);
    refresh();
    handleReset();

  }

  // Check de gestor para edit InputSelect em senioridade
  const currentDepartamento = editColaborador?.departamento ?? colaborador.departamento
  const currentSenioridade = editColaborador?.senioridade ?? colaborador.senioridade
  const isGestor = currentSenioridade === 'Gestor'

  const hasGestor = colaboradores.some(
    c => c.departamento === currentDepartamento
      && c.senioridade === 'Gestor'
      && c.id !== colaborador.id  // exclui ele mesmo
  )

  const senioridadeItems = (() => {
  const base = ['Estagiário', 'Júnior', 'Pleno', 'Sênior']
  if (isGestor) return ['Gestor']
  return hasGestor ? base : [...base, 'Gestor']
  })()

return (
    <Dialog 
      open={open} 
      onClose={handleReset}
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          sx:{
          borderRadius: '20px', 
          padding: 1,
          boxShadow: '0px 20px 50px rgba(0,0,0,0.1)'
        }
        }
      }}
    >

      <DialogTitle component='div' sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{display: 'flex',alignItems: 'center', gap: 1}}>

          <Typography variant="h6" fontWeight="bold" sx={{ml: 1}}>
            {isEdit ? 'Editar Registro' : `Colaborador: ${colaborador.nome}` }
          </Typography>

            <Chip
              label={editColaborador?.status ? "Ativo" : "Inativo"}
              size="medium"
              onClick={isEdit ? () => setEditColaborador(prev => ({...prev!, status: !prev!.status})) : undefined}
              sx={{
                borderRadius: 1.5,
                bgcolor:
                  editColaborador?.status ? 'success.light' : "error.light",
                color:
                  editColaborador?.status ? "success.main" : "error.main",
                fontWeight: 600,
                fontSize: 12,
              }}
            />

        </Box>
        <IconButton onClick={handleReset}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: 'none', display:'flex',flexDirection: 'column' ,gap:4, mb: isEdit ? 2 : 0 }}>

        <Box component="form" sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 3, mt: 1}}>

          {/* Infos básicas */}
          <InputField
            info="Nome"
            value={isEdit ? displayData.nome : colaborador.nome}
            error={stringError['nome'] || displayData.nome.trim() === ''}
            errorCall={!stringError ? 'Insira um nome' : 'caractere inválido'}
            isEdit={isEdit}
            onChange={(e) => {
              onChangeFunc(e, (val) => setEditColaborador!(prev => ({...prev!, nome: String(val)})), 'string', 'nome')}}
          />

          <InputField
            info="E-mail"
            value={isEdit ? displayData.email : colaborador.email}
            error={stringError['email'] || displayData.email.trim() === ''}
            errorCall='Insira um e-mail válido!'
            isEdit={isEdit}
            onChange={(e) => onChangeFunc(e, (val) => setEditColaborador!(prev => ({...prev!, email: String(val)})), 'email', 'email')}
          />

        </Box>

        <Divider></Divider>

        <Box component="form" sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 1 }}>

          {/* Infos profissionais */}
          <InputField
            info="Cargo"
            value={isEdit ? displayData.cargo : colaborador.cargo}
            error={stringError['cargo'] || displayData.cargo.trim() === ''}
            errorCall={'Caractere inválido!'}
            isEdit={isEdit}
            onChange={(e) => onChangeFunc(e, (val) => setEditColaborador!(prev => ({...prev!, cargo: String(val)})), 'string', 'cargo')}
          />

          <InputSelect 
            title='Departamento' 
            items={departamentos} 
            value={editColaborador?.departamento ?? colaborador.departamento} 
            onChange={(e) => setEditColaborador(prev => ({...prev!, departamento: e.target.value}))}
            isEdit={isEdit}
          />

          <InputField
            info="Salário"
            value={toBRL(Number(displayData.salarioBase))}
            error={salarioError || displayData.salarioBase === 0}
            errorCall={erroSalarioReason}
            isEdit={isEdit}
            onChange={(e) => onChangeFunc(e, (salarioInput) => setEditColaborador!(prev => ({ ...prev!, salarioBase: Number(salarioInput)})),'number', 'number')}
          />

          <InputSelect 
            title='Senioridade' 
            items={senioridadeItems}
            value={currentSenioridade}
            onChange={(e) => setEditColaborador(prev => ({...prev!, senioridade: e.target.value}))}
            isEdit={isEdit}
          />

        </Box>

        {/* ------------------------------------------------------ */}

      </DialogContent>

      {isEdit &&
      <DialogActions sx={{ p: 3, justifyContent: 'space-between'}}>
          <Button 
            onClick={handleReset}
            variant="contained" 
            sx={{ borderRadius: '10px', px: 4, fontWeight: 'bold', color: 'text.primary', bgcolor: 'text.disabled', ':hover': {bgcolor: '#cfcfcf'}}}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={
              !displayData.nome.trim() ||
              !displayData.email.trim() ||
              !displayData.cargo.trim() ||
              !displayData.salarioBase ||
              stringError['email']
            }
            sx={{ borderRadius: '10px', px: 4, fontWeight: 'bold' }}
          >
            Salvar Alterações
          </Button>
      </DialogActions>
      }
    </Dialog>
  );
};

export default Crud;