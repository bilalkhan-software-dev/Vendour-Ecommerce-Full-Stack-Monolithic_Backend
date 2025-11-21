import { Box, Typography } from "@mui/material";

interface ProfileFieldCardProps {
    keys: string;
    value?: string;
    icon?: React.ReactNode;
}

const ProfileFieldCard = ({ icon, keys, value }: ProfileFieldCardProps) => (
    <Box
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
    >
        {icon && <Box>{icon}</Box>}
        <Box>
            <Typography variant="subtitle2" className="text-gray-500 font-medium">
                {keys}
            </Typography>
            <Typography variant="body1" className="text-gray-800 font-semibold">
                {value}
            </Typography>
        </Box>
    </Box>
);

export default ProfileFieldCard;
