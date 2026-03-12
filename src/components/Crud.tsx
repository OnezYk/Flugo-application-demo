import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  TextField, 
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

type CrudInfoProps = {

  colaboradorInfo?: string | number,
  title?: string,
  isEdit: boolean,
  
}

type CrudProps = CrudInfoProps & {
  
  open: boolean,
  colaborador: ColaboradorProp | null,
  handleClose?: () => void,


}

export const Crud = ({ open, handleClose, colaborador, isEdit}: CrudProps) => {
  // Determine if we are editing or creating
  
  if (!colaborador) {
    console.log("Colaborador não encontrado");
    return null
  }

return (
    <Dialog 
      open={open} 
      onClose={handleClose}
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
            {isEdit ? 'Editar Registro' : `Colaborador: ${colaborador.nome}` }
          </Typography>
            <Chip
              label={colaborador.status ? "Ativo" : "Inativo"}
              size="medium"
              sx={{
                borderRadius: 1.5,
                bgcolor:
                  colaborador.status ? 'success.light' : "error.light",
                color:
                  colaborador.status ? "success.main" : "error.main",
                fontWeight: 600,
                fontSize: 12,
              }}
            />
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: 'none', display:'flex',flexDirection: 'column' ,gap:4, mb: isEdit ? 2 : 0 }}>

        <Box component="form" sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 3, mt: 1}}>

          {/* Infos */}
          <Card title='Nome' colaboradorInfo={colaborador.nome} isEdit={isEdit}/>
          <Card title='E-mail' colaboradorInfo={colaborador.email} isEdit={isEdit}/>

        </Box>

        <Divider></Divider>

        <Box component="form" sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 1 }}>

          {/* Infos */}
          <Card title='Departamento' colaboradorInfo={colaborador.departamento} isEdit={isEdit}/>
          <Card title='Cargo' colaboradorInfo={colaborador.cargo} isEdit={isEdit}/>
          <Card title='Salário' colaboradorInfo={colaborador.salarioBase} isEdit={isEdit}/>
          <Card title='Senioridade' colaboradorInfo={colaborador.senioridade} isEdit={isEdit}/>

        </Box>



      </DialogContent>

      {isEdit &&
      <DialogActions sx={{ p: 3, justifyContent: 'space-between'}}>
          <Button 
            onClick={handleClose}
            variant="contained" 
            sx={{ borderRadius: '10px', px: 4, fontWeight: 'bold', color: 'text.primary', bgcolor: 'text.disabled', ':hover': {bgcolor: '#cfcfcf'}}}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
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

const Card = ({title, colaboradorInfo, isEdit}: CrudInfoProps) => {

  const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  return (
    <TextField 
      label={title} 
      variant="outlined" 
      fullWidth 
      defaultValue={typeof(colaboradorInfo) == 'string' ? colaboradorInfo : formatBRL(colaboradorInfo!)}
      slotProps={{
        input: {
          readOnly: isEdit ? false : true
        },
    }}
    />
  )

}