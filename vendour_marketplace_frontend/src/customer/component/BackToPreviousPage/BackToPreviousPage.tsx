import { ArrowBackRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface BackToPreviousPageProps {
    position?: 'right' | 'left' | 'top' | 'bottom';
    arrow?: boolean
}



const BackToPreviousPage = ({ position = 'right', arrow = true }: BackToPreviousPageProps) => {

    const navigate = useNavigate();

    return (
        <>
                <IconButton onClick={() => navigate(-1)}>
                    <Tooltip title="Back to previous" placement={position} arrow={arrow}>
                        <ArrowBackRounded />
                    </Tooltip>
                </IconButton>
        </>
    );
};

export default BackToPreviousPage;