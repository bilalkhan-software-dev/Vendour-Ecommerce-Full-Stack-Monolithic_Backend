import { AddRounded, CloseRounded, RemoveRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Divider, IconButton, Tooltip, tooltipClasses, Zoom } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { deleteCartItem, updateCartItem } from "../../../redux/slice/customer/cartSlice";
import type { CartItemResponse } from "../../../types/cart";
import { placeHolderImage } from "../../../data/account/customerAccount";


interface CartItemProps {
    item: CartItemResponse;
    showSnackbar: (message: string, severity: "success" | "error" | "warning" | "info") => void;
}
const CartItem = ({ item, showSnackbar }: CartItemProps) => {

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(store => store.cart);

    const handleUpdateQuantity = async (value: number) => {
        const result = await dispatch(updateCartItem({
            request: {
                quantity: item.quantity + value,
            },
            cartItemId: item.id
        }))
        if (updateCartItem.fulfilled.match(result)) {
            showSnackbar("Quantity updated successfully.", "success");
        } else {
            showSnackbar(result.payload || "Unable to update the quantity.", "error");
        }
    }

    const handleRemoveCartItem = async (value: number) => {

        const result = await dispatch(deleteCartItem({ cartItemId: value }))

        if (deleteCartItem.fulfilled.match(result)) {
            showSnackbar("Item removed successfully.", "success");
        } else if (deleteCartItem.rejected.match(result)) {
            showSnackbar(result.payload || "Unable to remove item. Please try again later!", "error");
        }
    }

    if (loading) {
        return (
            <Box className="flex justify-center items-center min-h-[200px]">
                <CircularProgress />
            </Box>
        );
    }


    return (
        <>
            <div className='border border-gray-200/100 rounded-md relative'>

                <div className="p-5 flex gap-3">
                    <div>
                        <img
                            src={item.product?.images[0] ?? placeHolderImage}
                            alt={item.product.title}
                            className="w-[90px] rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-semi-bold text-lg">
                            {item.product.seller?.businessName}
                        </h1>
                        <p className="text-gray-600 font-medium text-sm">{item.product.title}</p>
                        <p className="text-gray-400 text-xs"><strong>Sold By: </strong>{item.product.seller?.businessName}</p>
                        <p className="text-sm">7 days free replacemen available</p>
                        <p className="text-sm text-gray-500"><strong>Quantity: </strong>{item.quantity}</p>
                    </div>
                    <Divider />
                </div>

                <div className="px-5 flex justify-between items-center py-2 border rounded-b-md border-gray-200/100">
                    <div className="flex justify-between items-center gap-2 w-[140px]">
                        <Button
                            disabled={item.quantity == 0}
                            onClick={() => handleUpdateQuantity(-1)}
                        >
                            <RemoveRounded />
                        </Button>
                        <span className="text-gray-800 font-bold">{item.quantity}</span>
                        <Button onClick={() => handleUpdateQuantity(1)}>
                            <AddRounded />
                        </Button>
                    </div>
                    {/* <div className="font-bold italic"> */}
                    <p className="text-gray-700 italic font-semibold">Rs. {item.product.sellingPrice}</p>
                    {/* </div> */}
                </div>
                <div className="absolute top-1 right-1">
                    <Tooltip
                        title="Remove this item from Cart"
                        slots={{
                            transition: Zoom,
                        }}
                        slotProps={{
                            popper: {
                                sx: {
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                        { marginTop: "0px" },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                                        { marginBottom: "0px" },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                                        { marginLeft: "0px" },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                                        { marginRight: "0px" },
                                },
                            },
                        }}
                    >
                        <IconButton color="primary"
                            onClick={() => handleRemoveCartItem(item.id)}
                        >
                            <CloseRounded />
                        </IconButton>
                    </Tooltip>
                </div>
            </div >
        </>
    );
};

export default CartItem;