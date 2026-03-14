import { Box, Dialog, Typography, Button } from "@mui/material"
import { deleteColaborador } from "../utils/deleteColaborador"

type DeleteTabProps = {
  open: boolean,
  handleClose: () => void,
  selectedId: string,
  refresh: () => void
}

const DeleteGestor = ({ open, handleClose, refresh, selectedId }: DeleteTabProps) => {

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { borderRadius: 4, width: 450, height: 140, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
        }
      }}
    >
      <Box>
        <Typography fontWeight={600} fontSize={18}>Excluir gestor?</Typography>
        <Typography fontSize={15} sx={{color: 'text.secondary', mt: 1}}>O departamento ficará sem gestor até que você adicione outro em 'Adicionar colaborador'</Typography>
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} variant="contained" sx={{ bgcolor: 'text.disabled', color: 'text.primary' }}>
          Cancelar
        </Button>
        <Button variant="contained" color="error" onClick={() => {
          deleteColaborador(selectedId).catch(error => alert(error))
          refresh()
          handleClose()
        }}>
          Excluir
        </Button>
      </Box>
    </Dialog>
  )
}

export default DeleteGestor