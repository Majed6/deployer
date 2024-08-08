// src/Components/DeploymentModal.js
import React from 'react';
import { Box, Button, Link, Modal, Typography } from '@mui/material';
import DeploymentProgress from './DeploymentProgress';
import ChangeLog from './ChangeLog';
import CommitsTable from './CommitsTable';
import DiffFile from './DiffFile';

const DeploymentModal = ({ state, setState, deploySelectedTag }) => {
    return (
        <Modal
            open={state.DeploymentModal}
            onClose={() => setState({ ...state, DeploymentModal: false, DeploymentInProgress: {} })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 2,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Difference to Current
                    <Button variant="text" onClick={() => setState({ ...state, ChangeLogModal: true })}>
                        {state.CommitsDiff.additive ? ' + ' : ' - '}
                        {state.CommitsDiff.commits.commits.length}
                    </Button>
                </Typography>
                {Object.keys(state.DeploymentInProgress).length === 0 ?
                    <Box sx={{ margin: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={() => deploySelectedTag()}>Deploy</Button>
                    </Box>
                    :
                    <React.Fragment>
                        <Box sx={{ margin: 2 }}>
                            <DeploymentProgress />
                        </Box>
                        <Box sx={{ margin: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Link href={state.DeploymentInProgress.web_url} target="_blank" rel="noopener">View Deployment</Link>
                        </Box>
                    </React.Fragment>
                }
                <Modal
                    open={state.ChangeLogModal}
                    onClose={() => setState({ ...state, ChangeLogModal: false })}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <ChangeLog commitsTab={
                            <CommitsTable commits={state.CommitsDiff.commits.commits} />
                        } diffTab={
                            state?.CommitsDiff?.commits?.diffs?.map((diff) => (
                                <DiffFile diff={diff} />
                            ))
                        } />
                    </Box>
                </Modal>
            </Box>
        </Modal>
    );
};

export default DeploymentModal;