import React from 'react';
import { Table as SUITable } from 'semantic-ui-react';

const Table = ({ headers, rows, className }) => (
    <SUITable celled className={className}>
        <SUITable.Header>
            <SUITable.Row>
                {headers.map((header, index) => (
                    <SUITable.HeaderCell key={index}>{header}</SUITable.HeaderCell>
                ))}
            </SUITable.Row>
        </SUITable.Header>
        <SUITable.Body>
            {rows.map((row, index) => (
                <SUITable.Row key={index}>
                    {row.map((cell, i) => (
                        <SUITable.Cell key={i}>{cell}</SUITable.Cell>
                    ))}
                </SUITable.Row>
            ))}
        </SUITable.Body>
    </SUITable>
);

export default Table;