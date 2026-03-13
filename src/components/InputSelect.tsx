import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";


const InputSelect = ({onChange, value, title, items, isEdit = true} : {onChange: (e: SelectChangeEvent) => void, value: string, title: string, items: string[], isEdit?:boolean}) => {

  // Disparando o evento ao parent
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="select-label">{title}</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={value}
          label="Departamento"
          onChange={handleChange}
          inputProps={{ readOnly: !isEdit }}
        >

          {items.map((item) => <MenuItem value={item}>{item}</MenuItem>)}

        </Select>
      </FormControl>
    </Box>
  );
}

export default InputSelect