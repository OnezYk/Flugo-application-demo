import { Box, Dialog, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import type { SelectChangeEvent } from "@mui/material";
import InputSelect from "./InputSelect";
import { deleteDepartamento, getDepartamentos, type DepartamentoType } from "../utils/routesDepartamento";

type DeleteTabProps = {
  open: boolean,
  handleClose: () => void,
  activeTab: string,
  refresh: () => void
};

// Dialog para InputSelect de deleção de Departamento
const DeleteTab = ({ open, handleClose, activeTab, refresh }: DeleteTabProps) => {

  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);
  const [selected, setSelected] = useState(activeTab);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {

  getDepartamentos().then(data => { 
    setDepartamentos(data); // Popula a lista InputSelect
    const dep = data.find(departamentos => departamentos.nome === activeTab); // Acha o departamento com o nome da aba ativa
    setSelectedId(dep?.id ?? ''); // Pré seleciona o ID dessa departamento
  });
  }, [open]);

  useEffect(() => {
    setSelected(activeTab); // Quando active tab muda, o nome pré selecionado atualiza
  }, [activeTab]);

  // Handler para inputSelect
  const handleChange = (e: SelectChangeEvent) => {

    const nome = e.target.value;
    setSelected(nome);
    const dep = departamentos.find(d => d.nome === nome);
    setSelectedId(dep?.id ?? '');

  };

  // Handler do delete
  const handleDelete = async () => {

    await deleteDepartamento(selectedId, selected).catch(error => alert(error));
    refresh();
    handleClose();
   
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { borderRadius: 4, width: 400, height: 300, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
        }
      }}
    >
      <Typography fontWeight={600} fontSize={18}>Excluir departamento</Typography>

      <InputSelect
        title="Departamento"
        items={departamentos.map(e => e.nome)}
        value={selected}
        onChange={handleChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} variant="contained" sx={{ bgcolor: 'text.disabled', color: 'text.primary' }}>
          Cancelar
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      </Box>
    </Dialog>
  )
}

export default DeleteTab;