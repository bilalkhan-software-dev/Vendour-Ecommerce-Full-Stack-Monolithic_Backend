import { ElectricBoltRounded } from "@mui/icons-material";
import { Avatar, Chip } from "@mui/material";
import type { OrderItemResponse } from "../../../types/order";
import dayjs from "dayjs";
import { placeHolderImage } from "../../../data/account/customerAccount";

interface OrderItemProps {
  item: OrderItemResponse;
  orderStatus: string;
  deliverDate: string;
  couponCode?: string
}

const OrderItem = ({ item, orderStatus, deliverDate, couponCode }: OrderItemProps) => {





  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("ddd, DD MMM YYYY ");
  };

  return (
    <div className="bg-white p-5 border border-gray-200 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <Avatar sx={{ backgroundColor: "primary.main" }}>
            <ElectricBoltRounded />
          </Avatar>
        </div>

        <div className="flex flex-1 justify-between items-start flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-bold text-primary-color text-lg mb-1">{orderStatus}</h1>
            <p className="text-gray-600 text-sm">Delivered on {formatDate(deliverDate)}</p>
          </div>

          {couponCode && (
            <div className="flex-shrink-0">
              <Chip
                label={`Coupon used: ${couponCode}`}
                color="info"
                size="small"
              />
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 rounded-lg bg-teal-50 border border-teal-100 flex gap-4 items-start">
        <div className="flex-shrink-0">
          <img
            src={item?.product.images?.[0] || placeHolderImage}
            alt={item.product.title || "Product image"}
            className="w-16 h-16 object-cover rounded border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeHolderImage;
            }}
          />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="font-semibold text-gray-900 text-base">
            {item.product?.seller?.businessName || "Unknown Seller"}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
            {item.product?.description || "Product Description"}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Size: </strong>
            {item.product?.sizes || "Demo Size"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;