// React
import { useNavigate } from 'react-router-dom';

// MUI assets
import { Button } from '@mui/material';

// Type para props
type BtnProps = {

  children: string,
  to?: string,
  onClick?: () => void,
  disabled?: boolean

};

// Botão principal
const PrimaryBtn = ({children, to, onClick, disabled}: BtnProps) => {

  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled}

      // to: string de rota de destino, ou, na ausência, outra funcção
      onClick={to ? () => navigate(to) : onClick }
      sx={{
        textTransform: "none",
        fontWeight: "600",
        letterSpacing: 0.4,
        px: 2.3,
        py: 1.5,
        transition: "all 0.2s",
        ":hover": {transform: "scale(1.05)", bgcolor: "primary.light"},
        ":active": {transform: "scale(0.95)"},
      }}
    >
      {children}
    </Button>
  )
}

export default PrimaryBtn;