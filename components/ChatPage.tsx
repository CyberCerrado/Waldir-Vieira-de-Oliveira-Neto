import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CONVERSATIONS, MOCK_MAKERS } from '../constants';
import type { Conversation, Maker, ChatMessage } from '../types';
import { SendIcon, CubeIcon } from './Icons';

interface ChatPageProps {
  currentUser: Maker;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS.filter(c => c.participantIds.includes(currentUser.id)));
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedConversations = conversations.map(convo => {
      if (convo.id === selectedConversationId) {
        return { ...convo, messages: [...convo.messages, message] };
      }
      return convo;
    });

    setConversations(updatedConversations);
    setNewMessage('');
  };

  const getParticipant = (convo: Conversation): Maker | undefined => {
      const participantId = convo.participantIds.find(id => id !== currentUser.id);
      return MOCK_MAKERS.find(m => m.id === participantId);
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-[calc(100vh-128px)] animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg h-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-maker-dark">Conversas</h2>
          </div>
          <div className="flex-grow overflow-y-auto">
            {conversations.map(convo => {
              const participant = getParticipant(convo);
              if (!participant) return null;
              
              const lastMessage = convo.messages[convo.messages.length - 1];
              const isSelected = convo.id === selectedConversationId;

              return (
                <div
                  key={convo.id}
                  onClick={() => setSelectedConversationId(convo.id)}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-maker-primary/10' : ''}`}
                >
                  <img src={participant.avatarUrl} alt={participant.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div className="flex-grow overflow-hidden">
                    <h3 className="font-semibold text-maker-dark">{participant.name}</h3>
                    <p className="text-sm text-maker-gray truncate">{lastMessage?.text || 'Sem mensagens'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center flex-shrink-0">
                 <img src={getParticipant(selectedConversation)?.avatarUrl} alt={getParticipant(selectedConversation)?.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                 <h3 className="text-lg font-bold text-maker-dark">{getParticipant(selectedConversation)?.name}</h3>
              </div>
              
              {/* Messages */}
              <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {selectedConversation.messages.map(msg => {
                    const isCurrentUser = msg.senderId === currentUser.id;
                    const sender = MOCK_MAKERS.find(m => m.id === msg.senderId);
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                         {!isCurrentUser && <img src={sender?.avatarUrl} alt={sender?.name} className="w-8 h-8 rounded-full object-cover" />}
                         <div className={`max-w-md p-3 rounded-lg shadow-sm ${isCurrentUser ? 'bg-maker-primary text-white rounded-br-none' : 'bg-white text-maker-dark rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                         {currentUser && isCurrentUser && <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover" />}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-grow block w-full shadow-sm sm:text-sm border-gray-300 rounded-full py-2 px-4"
                  />
                  <button type="submit" className="bg-maker-primary text-white p-3 rounded-full hover:bg-opacity-90 transition-colors disabled:bg-gray-300" disabled={!newMessage.trim()}>
                    <SendIcon className="w-5 h-5"/>
                  </button>
                </form>
              </div>
            </>
          ) : (
             <div className="flex-grow flex items-center justify-center text-center text-maker-gray">
                <div>
                    <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="font-semibold">Selecione uma conversa</p>
                    <p className="text-sm">Escolha um maker na lista ao lado para começar a conversar.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
