import { Box } from "@mui/material";

const TypingDots = () => {
    return (
        <Box sx={{ display: "flex", gap: "4px", alignItems: "center", p: 1 }}>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "gray",
                        animation: "bounce 1.4s infinite",
                        animationDelay: `${i * 0.2}s`,
                        "@keyframes bounce": {
                            "0%, 80%, 100%": { transform: "scale(0)" },
                            "40%": { transform: "scale(1)" },
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default TypingDots;
