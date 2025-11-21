import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { HomeCategoryResponse } from "../../../../types/homeCategory";

interface ElectronicCategoryCardProps {
  data: HomeCategoryResponse;
}

const ElectronicCategoryCard: React.FC<ElectronicCategoryCardProps> = ({ data }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    navigate(`/products/category/${data.name}/${data.categoryId}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      sx={{
        width: isMobile ? 140 : 160,
        height: "100%",
        borderRadius: 2,
        boxShadow: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          p: 2,
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            width: "100%",
            height: 104,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 1,
          }}
        >
          <img
            src={data.image}
            alt={data.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Content */}
        <CardContent
          sx={{
            p: 0,
            width: "100%",
            textAlign: "center",
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          <Typography
            variant="subtitle1"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.4em",
            }}
          >
            {data.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ElectronicCategoryCard;