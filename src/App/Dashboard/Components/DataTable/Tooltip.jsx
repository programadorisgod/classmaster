import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Tooltips from '@mui/material/Tooltip';

export function Tooltip() {
    return (<Tooltips title="Para realizar alguna de las acciones debes escoger una asignatura y grupo.">
        <IconButton>
            <HelpOutlineIcon />
        </IconButton>
    </Tooltips>);
    
}