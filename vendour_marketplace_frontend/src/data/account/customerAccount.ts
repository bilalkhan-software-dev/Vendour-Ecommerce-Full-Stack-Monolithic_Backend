import stripeLogo from "../../assets/pics/Stripe_Logo_1.png";
import jazzLogo from "../../assets/pics/jazzLogo.png";
import placeHolderImagePic from "../../assets/pics/placeHolderImage.png"

export const menu = [
  { name: "Orders", path: "/account/orders" },
  { name: "Profile", path: "/account" },
  { name: "My reviews", path: "/account/my/reviews" },
  { name: "Saved Cards", path: "/account/saved-cards" },
  { name: "Addresses", path: "/account/addresses" },
  { name: "Logout", path: "/logout" },
];

export const selectPaymentMethod = [
  { name: "JAZZCASH", image: jazzLogo, label: "jazzcash" },
  { name: "STRIPE", image: stripeLogo, label: "stripe" },
];

// const steps = [
//   { name: "Order Placed", description: "on Thur, 10 Sep", value: "PLACED" },
//   {
//     name: "Packed",
//     description: "Item Packed in Dispatch Warehouse",
//     value: "CONFIRMED",
//   },
//   { name: "Shipped", description: "by Mon, 14 Sep", value: "SHIPPED" },
//   { name: "Arriving", description: "by 15 Sep - 18 Sep", value: "ARRIVING" },
//   { name: "Arrived", description: "by 15 Sep - 18 Sep", value: "DELIVERED" },
// ];


// const cancelledSteps = [
//   { name: "Order Placed", description: "on Mon, 15 Sep", value: "PLACED" },
//   {
//     name: "Order Cancelled",
//     description: "on Mon, 15 Sep",
//     value: "CANCELLED",
//   },
// ];


export const formBecomeSellerSteps = [
  { name: "Tax Details & Mobile", id: "1" },
  { name: "Bank Details", id: "2" },
  { name: "Business Details", id: "3" },
  { name: "Pickup Address", id: "4" },
];


export const placeHolderImage = placeHolderImagePic;
