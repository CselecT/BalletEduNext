import React from 'react'
import Pagination from '@mui/material/Pagination';
import { Table } from '@radix-ui/themes';
// import Stack from '@mui/material/Stack';

interface Props {
    params: { headers: Array<string>, data: Array<Array<string>> }
}

const PaginatedTable = ({ params }: Props) => {
    return (
        <div>
            <Table.Root variant='surface'>
                <Table.Header>
                    <Table.Row>
                        {params.headers.map((header,index) => (
                            <Table.ColumnHeaderCell key={index}>{header}</Table.ColumnHeaderCell>
                        ))}

                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {params.data.map((row,index) => (
                        <Table.Row key={index}>
                            {row.map((cell,i) => (
                                <Table.RowHeaderCell key={i}>{cell}</Table.RowHeaderCell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            <Pagination count={10} color="primary" />
        </div>
    )
}

export default PaginatedTable