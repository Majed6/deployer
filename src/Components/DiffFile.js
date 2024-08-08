import * as React from 'react';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {Collapse} from "@mui/material";

function DiffFile(props){
    const [expanded, setExpanded] = React.useState(false);
    return (
        <Box>
            {props.diff.new_path}
            <IconButton color="inherit" onClick={() => setExpanded(!expanded)}>
                {expanded ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
            </IconButton>
            <Collapse in={expanded}>
                <pre>{props.diff.diff}</pre>
            </Collapse>
        </Box>
    );
}

export default DiffFile;