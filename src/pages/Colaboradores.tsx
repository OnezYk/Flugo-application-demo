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
  useMediaQuery,
} from "@mui/material";

// MUI icons
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";

// Notionists
import { createAvatar } from '@dicebear/core';
import { notionists } from '@dicebear/collection';
import PrimaryBtn from "../components/PrimaryBtn";

// My utils
import {getColaboradores} from '../utils/getColaborador'
import { useEffect, useState } from "react";
import type { FormData } from "./Formulario";
type ColaboradorProp = FormData & { id: string }

const Colaboradores = () => {

  const isSmall = useMediaQuery('(max-width: 660px)')

  return (
    <Box
      sx={{
        p: 4,
        flexGrow: 0,
        ml: {lg: '300px', md: '100px', xs: 0},
        transform: !isSmall ?'scale(1)':'scale(0.8)',
        transition: 'all 1s'
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

const ColaboradoresTable = () => {

  const [colaboradores, setColaboradores] = useState<ColaboradorProp[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {

    getColaboradores().then(data => setColaboradores(data));

  },[])

  const getAvatar = (seed: string) => {
    return createAvatar(notionists, { 
      seed,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
    }).toString();
  }
  
  
  const handleGetColaborador = (col: string) => {
  const field = col.toLowerCase()
  const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
  console.log(sortOrder)
  setSortOrder(newOrder)
  getColaboradores(field, newOrder).then(data => setColaboradores(data))
}

  return (
    <TableContainer
      sx={{
        boxShadow: 3,
        borderColor: "text.disabled",
        borderRadius: 2,
        marginTop: 2,
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'scroll',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{bgcolor: "text.disabled"}}>
            {["Nome", "Email", "Departamento", "Status"].map((col) => (
              <TableCell
                onClick={() => handleGetColaborador(col)}
                key={col}
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textAlign: col === "Status" ? "right" : "left",
                  transition: 'all 0.2s',
                  ':hover': {cursor: 'pointer', bgcolor: 'action.hover'},
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
          {colaboradores.map((row:ColaboradorProp) => (
            <TableRow key={row.id} sx={{"&:last-child td": {border: 0}}}>
              <TableCell>
                <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                  <Avatar src={`data:image/svg+xml;utf8,${encodeURIComponent(getAvatar(row.nome))}`} sx={{width: 36, height: 36}} />
                  <Typography fontWeight={500}>{row.nome}</Typography>
                </Box>
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.departamento}</TableCell>
              <TableCell sx={{textAlign: "right"}}>
                <Chip
                  label={row.status ? "Ativo" : "Inativo"}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    bgcolor:
                      row.status ? 'success.light' : "error.light",
                    color:
                      row.status ? "success.main" : "error.main",
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
