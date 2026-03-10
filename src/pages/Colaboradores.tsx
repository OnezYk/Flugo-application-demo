import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
  Typography,
  Button,
} from "@mui/material";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";

const Colaboradores = () => {
  return (
    <Box
      sx={{
        height: "100%",
        p: 4,
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          color="text.primary"
          variant="h1"
          sx={{
            fontSize: 27,
            fontWeight: 600,
          }}
        >
          Colaboradores
        </Typography>

        <Button
          variant="contained"
          color="primary"
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
          Novo Colaborador
        </Button>
      </Box>

      <ColaboradoresTable />
    </Box>
  );
};

const rows = [
  {
    id: 1,
    name: "Fernanda Torres",
    email: "fernandatorres@flugo.com",
    dept: "Design",
    status: "Ativo",
    avatar: "",
  },
  {
    id: 2,
    name: "Joana D'Arc",
    email: "joanadarc@flugo.com",
    dept: "TI",
    status: "Ativo",
    avatar: "",
  },
  {
    id: 3,
    name: "Mari Froes",
    email: "marifroes@flugo.com",
    dept: "Marketing",
    status: "Ativo",
    avatar: "",
  },
  {
    id: 4,
    name: "Clara Costa",
    email: "claracosta@flugo.com",
    dept: "Produto",
    status: "Inativo",
    avatar: "",
  },
];

const ColaboradoresTable = () => {
  return (
    <TableContainer
      sx={{
        boxShadow: 3,
        borderColor: "text.disabled",
        borderRadius: 2,
        marginTop: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{bgcolor: "text.disabled"}}>
            {["Nome", "Email", "Departamento", "Status"].map((col) => (
              <TableCell
                key={col}
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: col === "Status" ? "right" : "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent:
                      col === "Status" ? "flex-end" : "flex-start",
                  }}
                >
                  {col} <SouthRoundedIcon sx={{fontSize: 14}} />
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{"&:last-child td": {border: 0}}}>
              <TableCell>
                <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                  <Avatar src={row.avatar} sx={{width: 36, height: 36}} />
                  <Typography fontWeight={500}>{row.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.dept}</TableCell>
              <TableCell sx={{textAlign: "right"}}>
                <Chip
                  label={row.status}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    bgcolor:
                      row.status === "Ativo" ? '#def7e7' : "#ffe4de",
                    color:
                      row.status === "Ativo" ? "#04c950" : "#ff0303",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Colaboradores;
