import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Divider, IconButton } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function ProjectsList({ state, setState, refreshProjects }) {
    const toggleFavorite = (projectId) => {
        const isFavorite = state.Favorites.includes(projectId);
        const newFavorites = isFavorite
            ? state.Favorites.filter(id => id !== projectId)
            : [...state.Favorites, projectId];
        setState({ ...state, Favorites: newFavorites });
    };

    const sortedProjects = [
        ...state.Projects.filter(project => state.Favorites.includes(project.id)),
        ...state.Projects.filter(project => !state.Favorites.includes(project.id))
    ];

    return (
        <List>
            <ListItem secondaryAction={
                <IconButton edge="end" aria-label="refresh" onClick={() => refreshProjects()}>
                    <AutorenewIcon />
                </IconButton>
            }>
                <ListItemText primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: 'medium',
                    letterSpacing: 0,
                }} primary="Projects" />
            </ListItem>
            <Divider />
            {sortedProjects.map((project) => (
                <ListItem key={project.id} secondaryAction={
                    <IconButton edge="end" aria-label="favorite" onClick={() => toggleFavorite(project.id)}>
                        {state.Favorites.includes(project.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                }>
                    <ListItemButton onClick={() => setState({ ...state, SelectedProjectId: project.id })}>
                        <ListItemText primary={project.name_with_namespace} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

export default ProjectsList;