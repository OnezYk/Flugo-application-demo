import { Box, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

type InputSelectProps = {onChange?: (e: SelectChangeEvent) => void, value: string, title: string, items: string[], isEdit?:boolean, error?: boolean, errorCall?: string}

// Componente para lista dropdown
const InputSelect = ({onChange, value, title, items, isEdit = true, error, errorCall} : InputSelectProps) => {

  // Disparando o evento ao parent
  const handleChange = (event: SelectChangeEvent) => {
    onChange!(event);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel sx={{color: error ? 'error.main' : 'text.secondary'}} id="select-label">{title}</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={value}
          error={error}
          label="Departamento"
          onChange={handleChange}
          inputProps={{ readOnly: !isEdit }}
        >

          {items.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
        </Select>
          {error && <FormHelperText sx={{color: 'error.main'}}>{errorCall}</FormHelperText>}
      </FormControl>
    </Box>
  );
}

export default InputSelect;