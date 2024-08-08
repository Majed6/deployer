import * as React from 'react';
import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import ChangeLogTab from "./ChangeLogTab";

function ChangeLog(props){
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Commits" id="simple-tab-0" />
                    <Tab label="Diff" id="simple-tab-1" />
                </Tabs>
            </Box>
            <ChangeLogTab value={value} index={0}>
                {props.commitsTab}
            </ChangeLogTab>
            <ChangeLogTab value={value} index={1}>
                {props.diffTab}
            </ChangeLogTab>
        </Box>
    );
}

export default ChangeLog;