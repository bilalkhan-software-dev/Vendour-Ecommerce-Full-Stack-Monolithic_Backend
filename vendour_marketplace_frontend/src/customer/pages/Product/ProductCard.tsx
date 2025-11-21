import { Box, Button, CircularProgress, IconButton, Paper, TextField, Typography } from "@mui/material";
import "./ProductCard.css";
import { CloseRounded, Favorite, ModeComment, SendRounded } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import React, { useEffect, useRef, useState } from "react";
import type { ProductResponse } from "../../../types/product";
import { placeHolderImage } from "../../../data/account/customerAccount";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { addProductToWishlist } from "../../../redux/slice/customer/wishlistSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { askAiAboutProduct } from "../../../redux/slice/customer/chatBotSlice";
import TypingDots from "../../../component/TypingDots";
import markdownComponents from "../../../util/markdownSupport";
import ReactMarkdown from "react-markdown";

interface ProductCardProps {
  productDetail: ProductResponse;
  chatProductId: number | null;
  setChatProductId: (id: number | null) => void;
}

const ProductCard = ({ productDetail, chatProductId, setChatProductId }: ProductCardProps) => {
  const { user } = useAppSelector(store => store.auth);
  const chatbot = useAppSelector(store => store.chatbot);
  const dispatch = useAppDispatch();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [question, setQuestion] = useState('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([
    {
      sender: "ai",
      text: "Hello! What would you like to ask about this product?",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const isChatOpen = chatProductId === productDetail.id;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatbot.loading]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % productDetail?.images.length);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, productDetail?.images?.length]);

  const handleAddToWishlist = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!user) {
      setSnackbar({
        open: true,
        message: "You must log in to add products to wishlist.",
        severity: "error",
      });
      return;
    }
    const result = await dispatch(addProductToWishlist({ productId }));
    if (addProductToWishlist.fulfilled.match(result)) {
      setSnackbar({
        open: true,
        message: "Product added to wishlist successfully.",
        severity: "success",
      });
    } else if (addProductToWishlist.rejected.match(result)) {
      setSnackbar({
        open: true,
        message: result.payload || "Unable to add product to wishlist. Please try again.",
        severity: "error",
      });
    }
  };

  // Chat open/close
  const handleChatOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatProductId(productDetail.id ?? 1);
  };

  const handleChatClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatProductId(null);
    setMessages([
      { sender: "ai", text: "Hello! What would you like to ask about this product?" },
    ]);
  };

  // Send message to AI
  const handleSend = async (e: React.KeyboardEvent | React.MouseEvent) => {
    e.stopPropagation();
    if (!question.trim()) return;
    const userQuestion = question.trim();

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: userQuestion }]);
    setQuestion("");

    const result = await dispatch(
      askAiAboutProduct({
        productId: productDetail.id ?? 0,
        question: userQuestion,
      })
    );

    if (askAiAboutProduct.fulfilled.match(result)) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: result.payload || "No response received." },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I couldn't get an answer. Please try again later." },
      ]);
      setSnackbar({
        open: true,
        message: "Failed to fetch AI response.",
        severity: "error",
      });
    }
  };

  // Stop propagation for text field events
  const handleTextFieldKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleSend(e);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setQuestion(e.target.value);
  };

  const handleTextFieldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const { seller, mrpPrice, sellingPrice, discountInPercentage, title } = productDetail;

  return (
    <>
      {/* Chat Panel */}
      {isChatOpen && (
        <Paper
          elevation={8}
          className="fixed top-24 right-16 w-[420px] h-[440px] flex flex-col rounded-2xl z-[1600] overflow-hidden animate-[fadeInUp_0.4s_ease]"
          onClick={(e: React.MouseEvent) => e.stopPropagation()} // Stop propagation on the entire chat panel
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#1DB954',
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()} // Stop propagation on header
          >
            <Typography fontWeight="bold">AI Product Assistant</Typography>
            <IconButton
              onClick={handleChatClose}
              sx={{ color: "white" }}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()} // Stop propagation on icon button
            >
              <CloseRounded />
            </IconButton>
          </Box>

          {/* Chat Body */}
          <Box
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 text-sm"
            sx={{ fontFamily: "Inter, sans-serif" }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()} // Stop propagation on chat body
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3 rounded-xl ${msg.sender === "user"
                  ? "ml-auto bg-primary-color text-white"
                  : "bg-white border border-gray-200 text-gray-800"
                  }`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {msg.sender === 'ai' ? (
                  <ReactMarkdown components={markdownComponents}>
                    {msg.text}
                  </ReactMarkdown>)
                  :
                  (
                    <Box>
                      {msg.text}
                    </Box>
                  )
                }
              </div>
            ))}

            {chatbot.loading && <TypingDots />}

            <div ref={chatEndRef} />
          </Box>

          {/* Input */}
          <Box
            className="border-t border-gray-200 p-3 flex gap-2 items-center bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()} 
          >
            <TextField
              fullWidth
              placeholder="Type your question..."
              size="small"
              value={question}
              onChange={handleTextFieldChange}
              onKeyDown={handleTextFieldKeyDown}
              onClick={handleTextFieldClick}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()} 
            />
            <Button
              variant="contained"
              disabled={question.length === 0 || chatbot.loading}
              onClick={(e: React.MouseEvent) => handleSend(e)}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              sx={{
                minWidth: "40px",
                height: "40px",
                borderRadius: "50%"
              }}
            >
              {chatbot.loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <SendRounded />
              )}
            </Button>
          </Box>
        </Paper>
      )}

      <div className="group px-4 relative">
        <div
          className="card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {productDetail.images ?
            productDetail?.images.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`product-image-${index + 1}`}
                className="card-media object-top rounded-md"
                style={{
                  transform: `translateX(${(index - currentImage) * 100}%)`,
                }}
                loading="lazy"
              />
            ))
            :
            <img
              src={placeHolderImage}
              alt="product-image-"
              className="card-media object-top rounded-md"
            />
          }

          {/* Hover Actions */}
          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-4">
              <div className="flex gap-3">
                <Button
                  size="small"
                  onClick={(e) => handleAddToWishlist(e, productDetail.id ?? 0)}
                  sx={{
                    minWidth: "40px",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <Favorite color="primary" />
                </Button>
                <Button
                  size="small"
                  onClick={handleChatOpen}
                  sx={{
                    minWidth: "40px",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <ModeComment color="primary" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
          <div className="name">
            <div className="group max-w-xs">
              <p className="text-gray-900 font-medium truncate group-hover:overflow-visible group-hover:whitespace-normal group-hover:text-clip">
                {title}
              </p>
            </div>

            <h1 className="font-semibold text-gray-500">Brand: {seller?.businessName}</h1>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="font-sans text-gray-800">Rs. {sellingPrice}</span>
            <span className="thin-line-through text-gray-400">Rs. {mrpPrice}</span>
            <span className="discount text-primary-color font-semibold">
              {discountInPercentage}%Off
            </span>
          </div>
        </div>
      </div>
      <SnackbarMessage
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }))
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </>
  );
};

export default ProductCard;