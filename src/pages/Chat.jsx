import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, User, Shield, CheckCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const Chat = ({ isPopup = false }) => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, getOrCreateChat, markAsRead } = useChat();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      if (currentUser) {
        const id = await getOrCreateChat(currentUser.uid);
        setChatId(id);
        if (id) markAsRead(id);
      }
    };
    initChat();
  }, [currentUser]);

  // Auto scroll bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, message);
      setMessage("");
    } catch (err) {
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => (date ? format(date, "HH:mm") : "");

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Please login to chat with admin.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        isPopup
          ? "h-full flex flex-col"
          : "min-h-screen py-8 px-4 bg-gray-100 dark:bg-gray-900 flex flex-col"
      }
    >
      {/* Popup mode removes header */}
      {!isPopup && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Chat with Admin</h1>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageCircle size={40} className="mb-3" />
            Start a conversation
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === currentUser.uid;
              const isAdmin = msg.senderId === "admin";

              return (
                <motion.div
                  key={msg.id ?? index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-3 ${
                    isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isAdmin
                        ? "bg-purple-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {isAdmin ? (
                      <Shield size={18} className="text-white" />
                    ) : (
                      <User size={18} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-2 rounded-xl text-sm ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : isAdmin
                          ? "bg-purple-600 text-white rounded-bl-sm"
                          : "bg-white dark:bg-gray-700"
                      }`}
                    >
                      {msg.message}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      {formatTime(msg.createdAt)}
                      {isOwn && <CheckCheck size={14} className="text-blue-500" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded-xl"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
