// src/Components/DeploymentModal.js
import React from 'react';
import { Box, Button, Link, Modal, Typography } from '@mui/material';
import DeploymentProgress from './DeploymentProgress';
import ChangeLog from './ChangeLog';
import CommitsTable from './CommitsTable';
import {Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui-slim';
import 'diff2html/bundles/css/diff2html.min.css';

const DeploymentModal = ({ state, setState, deploySelectedTag }) => {
    function onDiffTabDisplayed() {
        const diffTarget = document.getElementById('diff-ui');
        const diff = state?.CommitsDiff?.commits?.diffs?.reduce((acc, diff) => acc + diff.diff, '') || ''
        const diffConfig = {}
        const diff2htmlUi = new Diff2HtmlUI(
            diffTarget,
            diff,
            diffConfig
        );
        diff2htmlUi.draw();
        diff2htmlUi.highlightCode();
    }

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
                        boxShadow: 24,
                    }}>
                        <ChangeLog onDiffTabDisplayed={onDiffTabDisplayed} commitsTab={
                            <CommitsTable commits={state.CommitsDiff.commits.commits} />
                        } diffTab={
                            <div id="diff-ui"/>
                        } />
                    </Box>
                </Modal>
            </Box>
        </Modal>
    );
};

export default DeploymentModal;