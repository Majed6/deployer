import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Settings} from "@mui/icons-material";
import {
    Drawer,
} from "@mui/material";
import {Gitlab} from "@gitbeaker/browser";
import SettingsForm from "./Components/SettingsForm";
import TagsTable from "./Components/TagsTable";
import ProjectsList from "./Components/ProjectsList";
import DeploymentModal from "./Components/DeploymentModal";
import './App.css';

export default function App() {
    // retrieve Token, GitlabHost, SearchGitlab, SearchNamespaces from localStorage
    const [state, setState] = React.useState({
        ProjectsMenu: false,
        Settings: false,
        Token: localStorage.getItem("Token") || "",
        GitlabHost: localStorage.getItem("GitlabHost") || "",
        Projects: [],
        Favorites: localStorage.getItem("Favorites") ? JSON.parse(localStorage.getItem("Favorites")) : [],
        SearchGitlab: localStorage.getItem("SearchGitlab") || "",
        SearchNamespaces: localStorage.getItem("SearchNamespaces") || "",
        SelectedProjectId: 0,
        RepositoryTags: [],
        CurrentTag: {name: "", commit: {id: ""}},
        MainBranch: localStorage.getItem("MainBranch") || "main",
        SelectedTag: {},
        DeploymentModal: false,
        ChangeLogModal: false,
        CommitsDiff: {additive: true, commits: {commits: []}},
        DeploymentInProgress: {},
    });
    // save Token, GitlabHost, SearchGitlab, SearchNamespaces to localStorage
    React.useEffect(() => {
        localStorage.setItem("Token", state.Token);
        localStorage.setItem("GitlabHost", state.GitlabHost);
        localStorage.setItem("SearchGitlab", state.SearchGitlab);
        localStorage.setItem("SearchNamespaces", state.SearchNamespaces);
        localStorage.setItem("Favorites", JSON.stringify(state.Favorites));
        localStorage.setItem("MainBranch", state.MainBranch);
    }, [
        state.Token,
        state.GitlabHost,
        state.SearchGitlab,
        state.SearchNamespaces,
        state.Favorites,
        state.MainBranch,
    ]);

    React.useEffect(() => {
        getRepositoryTags(state.SelectedProjectId);
        // eslint-disable-next-line
    }, [state.SelectedProjectId]);

    async function refreshProjects() {
        if (state.Token === "" || state.GitlabHost === "") return;

        const api = new Gitlab({
            token: state.Token,
            host: state.GitlabHost
        });
        setState({
            ...state, Projects: await api.Projects.all({
                per_page: 100,
                simple: true,
                search: state.SearchGitlab,
                search_namespaces: state.SearchNamespaces,
            })
        });
    }

    const handleSelectToDeploy = async (tag) => {
        let commits = await compareCommits(state.SelectedProjectId, state.CurrentTag.commit.id, tag.commit.id);
        if (commits.commits.length !== 0) {
            setState({...state, SelectedTag: tag, DeploymentModal: true, CommitsDiff: {additive: true, commits}});
        } else {
            commits = await compareCommits(state.SelectedProjectId, tag.commit.id, state.CurrentTag.commit.id);
            setState({...state, SelectedTag: tag, DeploymentModal: true, CommitsDiff: {additive: false, commits}});
        }
    }

    const getRepositoryTags = async (projectId) => {
        if (state.Token === "" || state.GitlabHost === "" || state.SelectedProjectId === 0) return;

        const api = new Gitlab({
            token: state.Token,
            host: state.GitlabHost
        });
        let repositoryTags = await api.Tags.all(projectId);
        // get latest commit in project and append it as if it was tagged
        let latestCommit = await api.Commits.show(projectId,state.MainBranch);
        repositoryTags.unshift({
            name: "latest",
            commit: latestCommit
        });

        setState({
            ...state,
            RepositoryTags: repositoryTags.filter(tag => tag.name !== "current"),
            CurrentTag: repositoryTags.find(tag => tag.name === "current")
        });
    }

    const compareCommits = async (projectId, from, to) => {
        if (state.Token === "" || state.GitlabHost === "" || state.SelectedProjectId === 0) return;

        const api = new Gitlab({
            token: state.Token,
            host: state.GitlabHost
        });
        return await api.Repositories.compare(projectId, from, to, {unidiff: true});
    }

    function updateToken(e) {
        setState({...state, Token: e.target.value});
    }

    async function deploySelectedTag() {
        const api = new Gitlab({
            token: state.Token,
            host: state.GitlabHost
        });
        // Compare selected tag with current tag. If selected is not equal to current, then deploy.
        if (Object.keys(state.SelectedTag).length !== 0 && state.SelectedTag.commit.id !== state.CurrentTag.commit.id) {
            // To deploy we need to remove the current tag and create a new current tag.
            await api.Tags.remove(state.SelectedProjectId, state.CurrentTag.name);
            let currentTag = await api.Tags.create(state.SelectedProjectId, state.CurrentTag.name, state.SelectedTag.commit.id);
            let pipelines = await api.Pipelines.all(state.SelectedProjectId, {ref: state.CurrentTag.name});
            setState({...state, SelectedTag: {}, CurrentTag: currentTag, DeploymentInProgress: pipelines[0]});
        }
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={() => setState({...state, ProjectsMenu: true})}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Deployer
                    </Typography>
                    <IconButton color="inherit"
                                onClick={() => setState({...state, Settings: true})}><Settings/></IconButton>
                </Toolbar>
            </AppBar>
            <TagsTable state={state} handleSelectToDeploy={handleSelectToDeploy} />
            <Drawer anchor={'left'} open={state.ProjectsMenu} onClose={() => setState({...state, ProjectsMenu: false})}>
                <ProjectsList state={state} setState={setState} refreshProjects={refreshProjects} />
            </Drawer>
            <Drawer anchor={'right'} open={state.Settings} onClose={() => setState({...state, Settings: false})}>
                <SettingsForm state={state} setState={setState} updateToken={updateToken} />
            </Drawer>
            <DeploymentModal state={state} setState={setState} deploySelectedTag={deploySelectedTag} />
        </Box>
    )
        ;
}
