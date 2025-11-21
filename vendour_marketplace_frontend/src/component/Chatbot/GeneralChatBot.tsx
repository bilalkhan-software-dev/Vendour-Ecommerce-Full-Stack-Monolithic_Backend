import { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
    Slide,
    Paper,
    Tooltip,
} from "@mui/material";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { SendRounded } from "@mui/icons-material";
import AspectRatioRoundedIcon from "@mui/icons-material/AspectRatioRounded";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import TypingDots from "../TypingDots";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { askAi, askAiWithCredentials } from "../../redux/slice/customer/chatBotSlice";
import ReactMarkdown from "react-markdown";
import markdownComponents from "../../util/markdownSupport";

interface ChatMessage {
    sender: "user" | "ai";
    text: string;
}

const ChatBot = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [cinemaMode, setCinemaMode] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: "ai", text: "Hello! Ask me anything about our products." },
    ]);
    const [input, setInput] = useState("");
    const dispatch = useAppDispatch();
    const chatbot = useAppSelector((store) => store.chatbot);
    const user = useAppSelector((store) => store.auth);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, chatbot.loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages((prev) => [...prev, { sender: "user", text: userText }]);
        setInput("");

        if (user) {
            const result = await dispatch(askAiWithCredentials({ question: userText }));

            if (askAiWithCredentials.fulfilled.match(result)) {
                setMessages((prev) => [
                    ...prev,
                    { sender: "ai", text: result.payload || "Sorry, I couldn't get a response." },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { sender: "ai", text: "Something went wrong. Try again later." },
                ]);
            }
            
        } else {
            const result = await dispatch(askAi({ question: userText }));

            if (askAi.fulfilled.match(result)) {
                setMessages((prev) => [
                    ...prev,
                    { sender: "ai", text: result.payload || "Sorry, I couldn't get a response." },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { sender: "ai", text: "Something went wrong. Try again later." },
                ]);
            }
        }
    };

    const toggleCinemaMode = () => {
        setCinemaMode((prev) => !prev);
    };

    const handleClose = () => {
        setChatOpen(false);
        // Reset cinema mode when closing chat
        setCinemaMode(false);
    };

    const chatWidth = cinemaMode ? 800 : 420;
    const chatHeight = cinemaMode ? 470 : 440;

    return (
        <>
            {/* Floating Chat Button */}
            <IconButton
                onClick={() => setChatOpen((prev) => !prev)}
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    boxShadow: 4,
                    zIndex: 1600,
                }}
            >
                <ChatRoundedIcon />
            </IconButton>

            {/* Floating Chat Box */}
            <Slide direction="up" in={chatOpen} mountOnEnter unmountOnExit>
                <Paper
                    elevation={8}
                    sx={{
                        position: "fixed",
                        bottom: 80,
                        right: 20,
                        width: chatWidth,
                        height: chatHeight,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                        zIndex: 1600,
                        transition: "all 0.3s ease",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: "primary.main",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography fontWeight="bold">
                            Product Assistant 
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            {/* Cinema Mode Toggle */}
                            <Tooltip title={cinemaMode ? "Exit cinema mode" : "Enter cinema mode"}>
                                <IconButton
                                    size="small"
                                    onClick={toggleCinemaMode}
                                    sx={{ color: "white" }}
                                >
                                    {cinemaMode ? <AspectRatioRoundedIcon /> : <AspectRatioOutlinedIcon />}
                                </IconButton>
                            </Tooltip>
                            
                            {/* Close Button */}
                            <IconButton
                                size="small"
                                onClick={handleClose}
                                sx={{ color: "white" }}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            bgcolor: "#f9f9f9",
                        }}
                    >
                        {messages.map((msg, i) => (
                            <Box
                                key={i}
                                sx={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    bgcolor: msg.sender === "user" ? "primary.light" : "white",
                                    color: msg.sender === "user" ? "white" : "black",
                                    px: 2,
                                    py: 1,
                                    fontSize: cinemaMode ? 14 : 13,
                                    borderRadius: 2,
                                    maxWidth: cinemaMode ? "85%" : "80%",
                                    boxShadow: 1,
                                    "& .markdown-content": {
                                        "& p": { margin: 0 },
                                        "& h1, & h2, & h3, & h4, & h5, & h6": { margin: "4px 0" },
                                        "& ul, & ol": { margin: "2px 0" },
                                        fontSize: cinemaMode ? "14px" : "13px",
                                    },
                                }}
                            >
                                {msg.sender === "ai" ? (
                                    <div className="markdown-content">
                                        <ReactMarkdown components={markdownComponents}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                            </Box>
                        ))}

                        {chatbot.loading && <TypingDots />}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box sx={{ p: 2, borderTop: "1px solid #eee", display: "flex", gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tell me your question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                            sx={{
                                "& .MuiInputBase-input": {
                                    fontSize: cinemaMode ? "14px" : "13px",
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={chatbot.loading || !input.trim()}
                            sx={{ 
                                minWidth: "40px", 
                                borderRadius: "50%",
                                "& .MuiSvgIcon-root": {
                                    fontSize: cinemaMode ? "20px" : "18px",
                                }
                            }}
                        >
                            <SendRounded fontSize="small" />
                        </Button>
                    </Box>
                </Paper>
            </Slide>
        </>
    );
};

export default ChatBot;