import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../components/Header';
import Table from '../components/Table';

const SellPage = () => {
    const headers = ['Card Name', 'Description', 'Family', 'HP', 'Energy', 'Defense', 'Attack', 'Price'];
    const rows = [
        ['Superman', 'The origin story...', 'DC Comics', 500, 100, 50, 200, 100],
        ['Batman', 'Bruce Wayne...', 'DC Comics', 500, 80, 70, 150, 80],
    ];

    return (
        <>
            <Header title="Sell Cards" subtitle="Manage your card sales" icon="money bill alternate" />
            <Container>
                <h1>Sell Cards</h1>
                <Table headers={headers} rows={rows} />
            </Container>
        </>
    );
};

export default SellPage;