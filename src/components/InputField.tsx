import { TextField } from "@mui/material"

const InputField = ({info, value, onChange, error, errorCall, isEdit = true} : {
  info: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error: boolean,
  errorCall: string,
  isEdit?: boolean
}) => {
  return (
    <TextField
      label={info}
      variant="outlined"
      fullWidth
      error={error}
      helperText={error ? errorCall : ''}
      autoComplete='off'
      value={value}
      onChange={onChange}
      slotProps={{
        htmlInput: { readOnly: !isEdit }
      }}
    />
  )
}

export default InputField