import * as React from 'react';
import Box from "@mui/material/Box";


function ChangeLogTab(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{
                p: 3,
                overflow: 'scroll',
                maxHeight: '80vh',
            }}>{children}</Box>}
        </div>
    );
}

export default ChangeLogTab;