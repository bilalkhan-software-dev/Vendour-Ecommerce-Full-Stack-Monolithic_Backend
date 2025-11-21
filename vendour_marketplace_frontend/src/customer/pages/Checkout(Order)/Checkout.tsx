import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import { selectPaymentMethod } from "../../../data/account/customerAccount";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { HomeRounded } from "@mui/icons-material";
import {
  placeOrderJazzcash,
  placeOrderStripe,
} from "../../../redux/slice/customer/orderSlice";
import type { Address } from "../../../types/seller";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import type { SnackbarProps } from "../../../types/props";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

  const { cart, auth, order } = useAppSelector((store) => store);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("JAZZCASH");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [customerJazzCashMobileNumber, setCustomerJazzCashMobileNumber] =
    useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState(auth.user?.address || []);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });




  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);

    if (selectedMethod !== "JAZZCASH") {
      setCustomerJazzCashMobileNumber("");
      setMobileError("");
    }
  };

  const validateJazzCashNumber = (number: string): boolean => {
    const pakistaniMobileRegex = /^03[0-9]{9}$/;
    return pakistaniMobileRegex.test(number);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address before proceeding to checkout.");
      return;
    }

    if (paymentMethod === "JAZZCASH") {
      if (!customerJazzCashMobileNumber.trim()) {
        setMobileError("Your JazzCash mobile number is required.");
        return;
      }
      if (!validateJazzCashNumber(customerJazzCashMobileNumber)) {
        setMobileError(
          "Please enter a valid Pakistani mobile number (e.g., 03XXXXXXXXX)."
        );
        return;
      }




      const result = await dispatch(
        placeOrderJazzcash({
          addressRequest: selectedAddress,
          paymentMethod,
          jazzCashAccountMobileNo: customerJazzCashMobileNumber,
        })
      );

      if (placeOrderJazzcash.fulfilled.match(result)) {
        navigate("/payment/success-page");
      } else if (placeOrderJazzcash.rejected.match(result)) {
        setSnackbar({
          open: true,
          message:
            result.payload ||
            "We couldn't place your order. Please try again later.",
          severity: "error",
        });
      }

    } else if (paymentMethod === "STRIPE") {

      const result = await dispatch(
        placeOrderStripe({
          addressRequest: selectedAddress,
          paymentMethod,
        })
      );

      if (placeOrderStripe.fulfilled.match(result)) {
        setSnackbar({
          open: true,
          message:
            "Redirecting you to Stripe to complete your payment. Please wait...",
          severity: "success",
        });
      } else if (placeOrderStripe.rejected.match(result)) {
        setSnackbar({
          open: true,
          message:
            result.payload ||
            "We couldn't place your order. Please try again later.",
          severity: "error",
        });
      }
    }

    setMobileError("");
  };



  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);


  const handleAddAddress = (newAddress: Address) => {
    setAddresses((prev) => [...prev, newAddress]);
  };


  if (!auth.user) {
    return (
      <div className="flex justify-center items-center min-h-[200px] md:mb-65">
        <Alert severity="warning" variant="outlined" sx={{ maxWidth: 500 }}>
          <AlertTitle>Login Required</AlertTitle>
          You must log in before checkout, or refresh the page if you are
          already logged in.
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
        <div className="space-y-5 lg:space-y-9 lg:grid lg:grid-cols-3 lg:gap-9">
          {/* Address Section */}
          <div className="col-span-2 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address</h1>
              <Button variant="outlined" onClick={handleOpenModal}>
                Add New Address
              </Button>
            </div>

            <div className="text-xs font-medium space-y-5">
              <p className="italic opacity-60">Saved Addresses</p>
              <div>
                {addresses.length > 0 ?
                  addresses.map((address, index) => (
                    <AddressCard address={address}
                      selected={selectedIndex === index}
                      onSelect={() => {
                        setSelectedIndex(index);
                        setSelectedAddress(address);
                      }
                      }
                    />
                  )) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500 light-thin-border rounded-md">
                      <HomeRounded sx={{ fontSize: 30, color: "gray" }} />
                      <p className="mt-2 text-sm italic">
                        No saved addresses yet.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="light-thin-border rounded-md space-y-5 text-center px-2 ">
              <p className="text-primary-color font-medium pt-2 italic">
                Choose Payment Method
              </p>

              <RadioGroup
                row
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentChange}
                className="flex justify-center gap-4 flex-wrap pb-4 ml-4"
              >
                {selectPaymentMethod.map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.name}
                    control={<Radio />}
                    className="light-thin-border px-4 py-2 rounded-md"
                    label={
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-16 h-10 object-contain mx-auto"
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </div>

            {paymentMethod === "JAZZCASH" && (
              <TextField
                required
                name="customerJazzCashMobileNumber"
                label="JazzCash Mobile Number"
                placeholder="03XXXXXXXXX"
                value={customerJazzCashMobileNumber}
                onChange={(e) => {
                  setCustomerJazzCashMobileNumber(e.target.value);
                  setMobileError("");
                }}
                error={Boolean(mobileError)}
                helperText={mobileError}
                size="small"
                fullWidth
                sx={{ mt: 2 }}
              />
            )}

            <div className="light-thin-border rounded-md mt-4">
              {cart.carts && <PricingCard cart={cart.carts} />}
              <div className="p-5">
                <Button
                  fullWidth
                  variant="contained"
                  type="button"
                  disabled={cart.carts?.cartItems.length === 0 || !selectedAddress || order.loading}
                  onClick={handleCheckout}
                  sx={{
                    py: "12px",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "none",
                    height: "40px",
                  }}
                >
                  {order.loading ? <CircularProgress size={24} color="inherit" /> : "Checkout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Address Form */}
      <Modal
        aria-labelledby="add-address-modal"
        aria-describedby="form-to-add-new-address"
        open={open}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              maxHeight: "90vh",
              overflowY: "auto",
              p: 4,
            }}
            className="hide-scrollbar"
          >
            <AddressForm onClose={handleCloseModal} onSave={handleAddAddress} />
          </Box>
        </Fade>
      </Modal>
      <SnackbarMessage
        message={snackbar.message}
        severity={snackbar.severity}
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default Checkout;
