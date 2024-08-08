import * as React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { CloudUpload, CloudDone } from '@mui/icons-material';

function TagsTable({ state, handleSelectToDeploy }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Tag</TableCell>
                        <TableCell align="right">Commit</TableCell>
                        <TableCell align="right">Author Name</TableCell>
                        <TableCell align="right">Message</TableCell>
                        <TableCell align="right">Tag Created At</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.RepositoryTags.map((row) => (
                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.commit.short_id}</TableCell>
                            <TableCell align="right">{row.commit.author_name}</TableCell>
                            <TableCell align="right">{row.commit.message}</TableCell>
                            <TableCell align="right">{row.commit.created_at}</TableCell>
                            <TableCell align="right">
                                {state.CurrentTag.commit.id !== row.commit.id ? (
                                    <IconButton color="inherit" onClick={() => handleSelectToDeploy(row)}>
                                        <CloudUpload />
                                    </IconButton>
                                ) : (
                                    <IconButton color="inherit" disabled>
                                        <CloudDone />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default TagsTable;