// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useContext, useEffect } from 'react';

import { format } from 'date-fns';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  TextField,
  Pagination,
  useTheme,
  TableContainer,
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { TicketContext } from 'src/context/TicketContext';

const ReferralTicketListing = () => {
  const { tickets, deleteTicket, searchTickets, ticketSearch, filter } = useContext(TicketContext);

  const theme = useTheme();

  const getVisibleTickets = (tickets, filter, ticketSearch) => {
    switch (filter) {
      case 'total_tickets':
        return tickets.filter(
          (c) => !c.deleted && c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'Conductor':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Type === 'Conductor' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'Pasajero':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Type === 'Pasajero' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      // Filtros por Status en español
      case 'Pendiente':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Pendiente' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'Anulado':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Anulado' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'Aceptado':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Aceptado' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      // Mantenemos los filtros por Status en inglés por compatibilidad
      case 'Pending':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Pendiente' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'Closed':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Anulado' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      case 'Open':
        return tickets.filter(
          (c) =>
            !c.deleted &&
            c.Status === 'Aceptado' &&
            c.ticketTitle.toLocaleLowerCase().includes(ticketSearch),
        );

      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  };
  const visibleTickets = getVisibleTickets(tickets, filter, ticketSearch.toLowerCase());

  const ticketBadge = (ticket) => {
    return ticket.Status === 'Open'
      ? theme.palette.success.light
      : ticket.Status === 'Closed'
      ? theme.palette.error.light
      : ticket.Status === 'Pending'
      ? theme.palette.warning.light
      : ticket.Status === 'Moderate'
      ? theme.palette.primary.light
      : 'primary';
  };

  return (
    <Box mt={4}>
      <Box sx={{ maxWidth: '260px', ml: 'auto' }} mb={3}>
        <TextField
          size="small"
          label="Search"
          fullWidth
          onChange={(e) => searchTickets(e.target.value)}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Id</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Nombre</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Tipo</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Estado</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Comisión</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleTickets.map((ticket) => (
              <TableRow key={ticket.Id} hover>
                <TableCell>{ticket.Id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {ticket.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="h6" fontWeight={400} noWrap>
                      {ticket.Type}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {ticket.Status === 'Anulado' ? (
                    <Chip
                      color="primary"
                      label={ticket.Status}
                      size="small"
                      sx={{ minWidth: '80px', textAlign: 'center' }}
                    />
                  ) : ticket.Status === 'Aceptado' ? (
                    <Chip
                      color="success"
                      label={ticket.Status}
                      size="small"
                      sx={{ minWidth: '80px', textAlign: 'center' }}
                    />
                  ) : ticket.Status === 'Pendiente' ? (
                    <Chip
                      color="warning"
                      label={ticket.Status}
                      size="small"
                      sx={{ minWidth: '80px', textAlign: 'center' }}
                    />
                  ) : (
                    ''
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="h6" fontWeight={400} noWrap>
                      {ticket.Comission}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={3} display="flex" justifyContent={'center'}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
};

export default ReferralTicketListing;
