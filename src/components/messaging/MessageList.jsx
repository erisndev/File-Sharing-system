import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Send, Paperclip, MoreVertical } from "lucide-react";

const MessageList = ({ conversation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 2,
      senderName: "John Smith",
      senderRole: "issuer",
      content:
        "Hi! I have some questions about your proposal for the website development project.",
      timestamp: "2025-01-15T10:30:00Z",
      read: true,
    },
    {
      id: 2,
      senderId: 1,
      senderName: "Current User",
      senderRole: "bidder",
      content:
        "Hello! I'd be happy to answer any questions you have. What would you like to know?",
      timestamp: "2025-01-15T10:35:00Z",
      read: true,
    },
    {
      id: 3,
      senderId: 2,
      senderName: "John Smith",
      senderRole: "issuer",
      content:
        "Can you provide more details about your experience with React and the timeline you proposed?",
      timestamp: "2025-01-15T10:40:00Z",
      read: true,
    },
    {
      id: 4,
      senderId: 1,
      senderName: "Current User",
      senderRole: "bidder",
      content:
        "Absolutely! I have 5+ years of experience with React and have built several e-commerce platforms. For this project, I estimate 8-10 weeks for completion, including testing and deployment.",
      timestamp: "2025-01-15T10:45:00Z",
      read: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: 1, // Current user
      senderName: "Current User",
      senderRole: "bidder",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "issuer":
        return "bg-blue-100 text-blue-800";
      case "bidder":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {conversation?.title || "Website Development Project"}
            </CardTitle>
            <p className="text-sm text-gray-500">
              Conversation with {conversation?.otherParty || "John Smith"}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === 1;

          return (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-xs lg:max-w-md ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                } items-end space-x-2`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.senderName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex flex-col ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">
                      {isCurrentUser ? "You" : message.senderName}
                    </span>
                    <Badge
                      className={`text-xs ${getRoleColor(message.senderRole)}`}
                    >
                      {message.senderRole}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isCurrentUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default MessageList;
