import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chat from "../../pages/Chat";

const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl z-[9999] transition-all"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Popup Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[520px] md:w-[380px] md:h-[560px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-500 text-white">
            <p className="font-semibold">Chat Support</p>
            <button onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>

          {/* Chat UI */}
          <div className="h-[calc(100%-56px)]">
            <Chat isPopup={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
