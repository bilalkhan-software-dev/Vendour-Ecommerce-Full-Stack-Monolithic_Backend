import { ElectricBoltRounded } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import type { OrderItemResponse } from "../../../types/order";
import dayjs from "dayjs";
import { placeHolderImage } from "../../../data/account/customerAccount";

interface OrderItemProps {
  item: OrderItemResponse;
  orderStatus: string;
  deliverDate: string;
}

const OrderItem = ({ item, orderStatus, deliverDate }: OrderItemProps) => {





  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("ddd, DD MMM YYYY ");
  };

  return (
    <>
      <div className='text-sm bg-white p-5 light-thin-border rounded-md cursor-pointer max-h-screen overflow-y-auto'>
        <div className="flex items-center gap-5">

          <div>
            <Avatar sizes="small" sx={{ backgroundColor: "primary.main" }} >
              <ElectricBoltRounded />
            </Avatar>
          </div>

          <div>
            <h1 className="font-bold text-primary-color">{orderStatus}</h1>
            <p>Delivered on {formatDate(deliverDate)}</p>
          </div>
        </div>

        <div className="p-5 mt-2 rounded-md bg-teal-50 flex gap-3">
          <div>
            {item?.product.images && item.product.images?.length > 0 ?
              <img
                src={item.product.images[0]}
                alt={item.product.title}
                className="w-[70px]" />
              :
              <img
                src={placeHolderImage}
                alt={item.product.title ?? ''}
                className="w-[70px]" />
            }

          </div>
          <div className="w-full space-y-2">
            <h1 className="font-bold">{item.product?.seller?.businessName ?? "Unknown Seller"}</h1>
            <p>{item.product?.description ?? "Product Description"}</p>
            <p><strong>Size: </strong>{item.product?.sizes ?? "Demo Size"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderItem;