import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { 
  HiSearch,
  HiDotsVertical,
  HiPaperAirplane,
  HiEmojiHappy,
  HiPaperClip,
  HiPhone,
  HiVideoCamera,
  HiUser,
  HiChevronLeft,
  HiCheck,
  HiCheckCircle,
  HiTrash,
  HiArchive
} from "react-icons/hi";
import { useSocket } from "../../src/contexts/SocketContext";
import ProfileAvatar from "../../src/components/common/ProfileAvatar";
import { 
  getUserChats, 
  getChatMessages, 
  sendMessage, 
  markMessagesAsRead,
  createOrGetChat,
  deleteChat,
  archiveChat
} from "../api";

interface Chat {
  _id: string;
  participants: any[];
  lastMessage?: {
    _id: string;
    content: string;
    sender: any;
    createdAt: string;
  };
  lastMessageAt: string;
  createdAt: string;
}

interface Message {
  _id: string;
  content: string;
  sender: any;
  messageType: string;
  isRead: boolean;
  readBy: any[];
  isEdited: boolean;
  editedAt?: string;
  replyTo?: any;
  createdAt: string;
}

const ChatPage: NextPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);
  const { socket, isConnected, onlineUsers } = useSocket();

  useEffect(() => {
    if (token && currentUser) {
      fetchChats();
    } else {
      router.push("/auth/login");
    }
  }, [token, currentUser]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit('join_chat', selectedChat._id);
      socket.on('new_message', handleNewMessage);
      socket.on('message_sent', handleMessageSent);
      socket.on('user_typing', handleUserTyping);
      socket.on('user_stopped_typing', handleUserStoppedTyping);
      socket.on('message_read', handleMessageRead);

      return () => {
        socket.emit('leave_chat', selectedChat._id);
        socket.off('new_message', handleNewMessage);
        socket.off('message_sent', handleMessageSent);
        socket.off('user_typing', handleUserTyping);
        socket.off('user_stopped_typing', handleUserStoppedTyping);
        socket.off('message_read', handleMessageRead);
      };
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await getUserChats({}, token);
      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data } = await getChatMessages(chatId, {}, token);
      if (data.success) {
        setMessages(data.data);
        await markMessagesAsRead(chatId, token);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
    fetchMessages(chat._id);
  };

  // Helper function to check if a user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.some((onlineUser) => onlineUser.userId === userId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    try {
      setSendingMessage(true);
      const { data } = await sendMessage(selectedChat._id, {
        content: newMessage.trim(),
        messageType: 'text'
      }, token);

      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessage("");
        
        if (socket) {
          socket.emit('send_message', {
            chatId: selectedChat._id,
            content: newMessage.trim(),
            messageType: 'text'
          });
        }

        setChats(prev => prev.map(chat => 
          chat._id === selectedChat._id 
            ? { ...chat, lastMessage: data.data, lastMessageAt: data.data.createdAt }
            : chat
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleNewMessage = (messageData: any) => {
    if (messageData.chatId === selectedChat?._id) {
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        content: messageData.content,
        sender: messageData.sender,
        messageType: messageData.messageType,
        isRead: false,
        readBy: [],
        isEdited: false,
        createdAt: messageData.timestamp
      }]);
    }

    setChats(prev => prev.map(chat => 
      chat._id === messageData.chatId 
        ? { 
            ...chat, 
            lastMessage: {
              _id: Date.now().toString(),
              content: messageData.content,
              sender: messageData.sender,
              createdAt: messageData.timestamp
            },
            lastMessageAt: messageData.timestamp
          }
        : chat
    ));
  };

  const handleMessageSent = (messageData: any) => {
    // console.log('Message sent confirmation:', messageData);
  };

  const handleUserTyping = (data: any) => {
    if (data.chatId === selectedChat?._id && data.userId !== currentUser._id) {
      setTypingUsers(prev => {
        const exists = prev.find(user => user.userId === data.userId);
        if (!exists) {
          return [...prev, data];
        }
        return prev;
      });
    }
  };

  const handleUserStoppedTyping = (data: any) => {
    if (data.chatId === selectedChat?._id) {
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
    }
  };

  const handleMessageRead = (data: any) => {
    // console.log('Message read:', data);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket && selectedChat) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing_start', { chatId: selectedChat._id });
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing_stop', { chatId: selectedChat._id });
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const { data } = await deleteChat(chatId, token);
      if (data.success) {
        toast.success("Chat deleted successfully");
        setShowDeleteConfirm(null);
        setShowChatMenu(null);
        
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          setMessages([]);
          setShowMobileChat(false);
        }
        
        fetchChats();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleArchiveChat = async (chatId: string) => {
    try {
      const { data } = await archiveChat(chatId, token);
      if (data.success) {
        toast.success("Chat archived successfully");
        setShowChatMenu(null);
        
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
          setMessages([]);
          setShowMobileChat(false);
        }
        
        fetchChats();
      }
    } catch (error) {
      console.error("Error archiving chat:", error);
      toast.error("Failed to archive chat");
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p._id !== currentUser._id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat);
    const searchLower = searchTerm.toLowerCase();
    return (
      otherParticipant?.fname?.toLowerCase().includes(searchLower) ||
      otherParticipant?.lname?.toLowerCase().includes(searchLower) ||
      otherParticipant?.businessInfo?.businessName?.toLowerCase().includes(searchLower) ||
      chat.lastMessage?.content?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      <div className="flex h-screen">
        {/* Chat List Sidebar */}
        <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HiDotsVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? "No chats found" : "No messages yet"}
              </div>
            ) : (
              filteredChats.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                const isUnread = chat.lastMessage && 
                  chat.lastMessage.sender._id !== currentUser._id && 
                  !chat.lastMessage.isRead;

                return (
                  <div
                    key={chat._id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        onClick={() => handleChatSelect(chat)}
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                      >
                        <ProfileAvatar
                          user={otherParticipant}
                          size="lg"
                          showOnlineStatus={true}
                          isOnline={isUserOnline(otherParticipant?._id)}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {otherParticipant?.businessInfo?.businessName || 
                               `${otherParticipant?.fname} ${otherParticipant?.lname}`}
                            </h3>
                            {chat.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.lastMessageAt)}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm truncate ${
                            isUnread ? 'font-semibold text-gray-900' : 'text-gray-500'
                          }`}>
                            {chat.lastMessage ? (
                              chat.lastMessage.sender._id === currentUser._id ? (
                                `You: ${chat.lastMessage.content}`
                              ) : (
                                chat.lastMessage.content
                              )
                            ) : (
                              "No messages yet"
                            )}
                          </p>
                        </div>

                        {isUnread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowChatMenu(showChatMenu === chat._id ? null : chat._id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <HiDotsVertical className="h-4 w-4 text-gray-600" />
                        </button>

                        {showChatMenu === chat._id && (
                          <div 
                            className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleArchiveChat(chat._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <HiArchive className="h-4 w-4" />
                              <span>Archive</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDeleteConfirm(chat._id);
                                setShowChatMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <HiTrash className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                    >
                      <HiChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <ProfileAvatar
                        user={getOtherParticipant(selectedChat)}
                        size="md"
                        showOnlineStatus={true}
                        isOnline={isUserOnline(getOtherParticipant(selectedChat)?._id)}
                      />
                      
                      {/* <div>
                        <h2 className="font-semibold text-gray-900">
                          {(() => {
                            const otherParticipant = getOtherParticipant(selectedChat);
                            return otherParticipant?.businessInfo?.businessName || 
                                   `${otherParticipant?.fname} ${otherParticipant?.lname}`;
                          })()}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {isConnected ? "Online" : "Offline"}
                        </p>
                      </div> */}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const otherParticipant = getOtherParticipant(selectedChat);
                        router.push(`/users/${otherParticipant._id}`);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <HiUser className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <HiPhone className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <HiVideoCamera className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <HiDotsVertical className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender._id === currentUser._id;
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                        isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {!isOwnMessage && (
                          <ProfileAvatar
                            user={message.sender}
                            size="sm"
                          />
                        )}
                        
                        <div className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {formatTime(message.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <div className="flex items-center">
                                {message.isRead ? (
                                  <HiCheckCircle className="h-3 w-3" />
                                ) : (
                                  <HiCheck className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs">...</span>
                      </div>
                      <div className="px-4 py-2 bg-gray-200 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <HiPaperClip className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <HiEmojiHappy className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiPaperAirplane className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiUser className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
                <p className="text-gray-500">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <HiTrash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Chat
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this chat? This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteChat(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showChatMenu || showDeleteConfirm) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowChatMenu(null);
            setShowDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
