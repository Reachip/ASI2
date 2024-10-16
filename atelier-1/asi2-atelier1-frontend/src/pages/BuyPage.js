import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../components/Header';

const BuyPage = () => {
  const headers = ['Card Name', 'Description', 'Family', 'HP', 'Energy', 'Defense', 'Attack', 'Price'];
  const rows = [
    ['Superman', 'The origin story...', 'DC Comics', 500, 100, 50, 200, 100],
    ['Batman', 'Bruce Wayne...', 'DC Comics', 500, 80, 70, 150, 80],
    ['Deadpool', 'Le clown...', 'Marvel', 999, 100, 15, 250, 200],
  ];

  return (
    <>
      <Header title="Buy Cards" subtitle="Choose your favorite cards" icon="shopping_cart" />
      <Container>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, i) => (
                  <TableCell key={i}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

export default BuyPage;