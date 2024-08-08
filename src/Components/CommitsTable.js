import * as React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Link } from '@mui/material';

function CommitsTable({ commits }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Commit</TableCell>
                        <TableCell align="right">Author Name</TableCell>
                        <TableCell align="right">Message</TableCell>
                        <TableCell align="right">Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {commits.map((commit) => (
                        <TableRow key={commit.short_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Link href={commit.web_url}>{commit.short_id}</Link>
                            </TableCell>
                            <TableCell align="right">{commit.author_name}</TableCell>
                            <TableCell align="right">{commit.message}</TableCell>
                            <TableCell align="right">{commit.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CommitsTable;