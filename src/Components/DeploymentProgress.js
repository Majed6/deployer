import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '100%', mr: 1}}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{minWidth: 35}}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

function DeploymentProgress(props) {
    const [progress, setProgress] = React.useState(1);
    const {onCompletion} = props;

    React.useEffect(() => {
        const completionTimeInSeconds = 5 * 60;
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 1));
            if (progress >= 100) {
                if (onCompletion) {
                    onCompletion();
                }
                clearInterval(timer);
            }
            // Set the interval to in a way that the progress bar will be completed in completionTimeInSeconds
        }, completionTimeInSeconds * 10);
        return () => {
            clearInterval(timer);
        };
    }, [onCompletion, progress]);

    return (
        <Box sx={{width: '100%'}}>
            <LinearProgressWithLabel value={progress}/>
        </Box>
    );
}

DeploymentProgress.propTypes = {
    onCompletion: PropTypes.func,
}
export default DeploymentProgress;
