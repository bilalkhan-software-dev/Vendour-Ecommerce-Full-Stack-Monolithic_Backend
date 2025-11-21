import { Box, Typography } from "@mui/material";
import { placeHolderImage } from "../../../data/account/customerAccount";
import type { ProductResponse } from "../../../types/product";
import LazyImage from "../../component/LazyImage/LazyImage";

interface SimilarProductCardProps {
  product: ProductResponse;
  onProductClick?: (productId: number) => void;
}

const SimilarProductCard = ({
  product,
  onProductClick
}: SimilarProductCardProps) => {
  const {
    id,
    title,
    images,
    sellingPrice,
    mrpPrice,
    discountInPercentage,
    seller
  } = product;

  const handleProductClick = () => {
    if (onProductClick && id) {
      onProductClick(id);
    }
  };

  return (
    <Box
      className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      onClick={handleProductClick}
    >
      {/* Image Section */}
      <Box className="relative h-48 overflow-hidden rounded-t-lg">
        <LazyImage
          src={images?.[0] || placeHolderImage}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />

        {/* Discount Badge */}
        {discountInPercentage > 0 && (
          <Box
            className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
          >
            {discountInPercentage}% OFF
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <Box className="p-3">
        {/* Brand Name */}
        <Typography
          variant="caption"
          className="text-gray-500 font-medium block mb-1"
        >
          {seller?.businessName || "Brand"}
        </Typography>

        {/* Product Title */}
        <Typography
          variant="body2"
          className="font-medium text-gray-900 line-clamp-2 mb-2"
          title={title}
        >
          {title}
        </Typography>

        {/* Price */}
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="font-bold text-gray-900">
            Rs. {sellingPrice}
          </Typography>
          {discountInPercentage > 0 && (
            <Typography
              variant="caption"
              className="line-through text-gray-400"
            >
              Rs. {mrpPrice}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SimilarProductCard;