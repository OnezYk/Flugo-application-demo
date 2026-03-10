// MUI copmonents
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
} from "@mui/material";

// MUI icons
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";

// Notionists
import { createAvatar } from '@dicebear/core';
import { notionists } from '@dicebear/collection';
import PrimaryBtn from "../components/PrimaryBtn";

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

        <PrimaryBtn to="/formulario"> Novo Colaborador </PrimaryBtn>

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

  const getAvatar = (seed: string) => {
    return createAvatar(notionists, { 
      seed,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
    }).toString();
  }

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
                  <Avatar src={`data:image/svg+xml;utf8,${encodeURIComponent(getAvatar(row.name))}`} sx={{width: 36, height: 36}} />
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
                      row.status === "Ativo" ? 'success.light' : "error.light",
                    color:
                      row.status === "Ativo" ? "success.main" : "error.main",
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
