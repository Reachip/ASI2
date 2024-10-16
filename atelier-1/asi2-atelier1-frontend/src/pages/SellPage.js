import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../components/Header';

const SellPage = () => {
  const headers = ['Card Name', 'Description', 'Family', 'HP', 'Energy', 'Defense', 'Attack', 'Price'];
  const rows = [
    ['Superman', 'The origin story...', 'DC Comics', 500, 100, 50, 200, 100],
    ['Batman', 'Bruce Wayne...', 'DC Comics', 500, 80, 70, 150, 80],
  ];

  return (
    <>
      <Header title="Sell Cards" subtitle="List your cards for sale" icon="sell" />
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

export default SellPage;