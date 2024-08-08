import * as React from 'react';
import { List, ListItem, TextField, FormControlLabel, Checkbox } from '@mui/material';

function SettingsForm({ state, setState, updateToken }) {
    return (
        <List>
            <ListItem>
                <TextField
                    id="outlined-token-input"
                    label="Token"
                    type="password"
                    value={state.Token}
                    autoComplete="token"
                    onChange={(e) => updateToken(e)}
                />
            </ListItem>
            <ListItem>
                <TextField
                    id="outlined-gitlab-input"
                    label="Gitlab URL"
                    type="text"
                    autoComplete="gitlab.com"
                    value={state.GitlabHost}
                    onChange={(e) => setState({ ...state, GitlabHost: e.target.value })}
                />
            </ListItem>
            <ListItem>
                <TextField
                    id="outlined-search-input"
                    label="Main Branch"
                    type="text"
                    autoComplete="main"
                    value={state.MainBranch}
                    onChange={(e) => setState({ ...state, MainBranch: e.target.value })}
                />
            </ListItem>
            <ListItem>
                <TextField
                    id="outlined-search-input"
                    label="Search Gitlab"
                    type="search"
                    autoComplete="search"
                    value={state.SearchGitlab}
                    onChange={(e) => setState({ ...state, SearchGitlab: e.target.value })}
                />
            </ListItem>
            <ListItem>
                <FormControlLabel control={
                    <Checkbox
                        checked={!!state.SearchNamespaces}
                        onChange={(e) => setState({ ...state, SearchNamespaces: e.target.checked })}
                    />} label="Search Namespaces" />
            </ListItem>
        </List>
    );
}

export default SettingsForm;