import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Search, MessageSquare, Users } from "lucide-react";
import Layout from "../components/layout/Layout";
import MessageList from "../components/messaging/MessageList";

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = [
    {
      id: 1,
      title: "Website Development Project",
      otherParty: "John Smith",
      otherPartyRole: "issuer",
      lastMessage:
        "Can you provide more details about your experience with React?",
      lastMessageTime: "2025-01-15T10:40:00Z",
      unreadCount: 2,
      tenderId: 1,
    },
    {
      id: 2,
      title: "Mobile App UI Design",
      otherParty: "Sarah Johnson",
      otherPartyRole: "issuer",
      lastMessage:
        "Thank you for your proposal. We'll review it and get back to you.",
      lastMessageTime: "2025-01-14T15:20:00Z",
      unreadCount: 0,
      tenderId: 2,
    },
    {
      id: 3,
      title: "Data Analysis Project",
      otherParty: "Mike Chen",
      otherPartyRole: "issuer",
      lastMessage: "Unfortunately, we've decided to go with another candidate.",
      lastMessageTime: "2025-01-13T09:15:00Z",
      unreadCount: 0,
      tenderId: 3,
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.otherParty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
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
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Messages</h1>
              <p className="text-blue-100 text-lg">
                Communicate with issuers and bidders in real-time
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                        selectedConversation?.id === conversation.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {conversation.otherParty.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.otherParty}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              className={`text-xs ${getRoleColor(
                                conversation.otherPartyRole
                              )}`}
                            >
                              {conversation.otherPartyRole}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 truncate mb-1">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No conversations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message View */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <MessageList conversation={selectedConversation} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
