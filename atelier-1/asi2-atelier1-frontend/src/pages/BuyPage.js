import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../components/Header';
import Table from '../components/Table';

const BuyPage = () => {
    const headers = ['Card Name', 'Description', 'Family', 'HP', 'Energy', 'Defense', 'Attack', 'Price'];
    const rows = [
        ['Superman', 'The origin story...', 'DC Comics', 500, 100, 50, 200, 100],
        ['Batman', 'Bruce Wayne...', 'DC Comics', 500, 80, 70, 150, 80],
        ['Deadpool', 'Le clown...', 'Marvel', 999, 100, 15, 250, 200],
    ];

    return (
        <>
            <Header title="Buy" subtitle="Purchase items here" icon="shopping cart" />
            <Container>
                <h1>Buy Cards</h1>
                <Table headers={headers} rows={rows} />
            </Container>
        </>
    );
};

export default BuyPage;