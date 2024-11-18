import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip
} from '@mui/material';

const CardsTable = ({ 
  cards, 
  selectedCard, 
  onSelectCard, 
  action = "buy" 
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Card Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>HP</TableCell>
            <TableCell>Energy</TableCell>
            <TableCell>Defense</TableCell>
            <TableCell>Attack</TableCell>
            <TableCell>
              {action === "sell" ? "Sell Price" : "Price"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cards.map((card) => (
            <TableRow
              key={card.id}
              hover
              selected={selectedCard?.id === card.id}
              onClick={() => onSelectCard(card)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {card.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {card.description}
                </Typography>
              </TableCell>
              <TableCell>{card.hp}</TableCell>
              <TableCell>{card.energy}</TableCell>
              <TableCell>{card.defence}</TableCell>
              <TableCell>{card.attack}</TableCell>
              <TableCell>
                <Typography 
                  color={action === "sell" ? "error.main" : "primary.main"}
                  fontWeight="bold"
                >
                  {card.price}$
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CardsTable;