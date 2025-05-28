import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot, MessageSquare } from 'lucide-react';

const MessageBubble = ({ msg }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3, ease: "circOut" }}
    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div className={`flex items-end max-w-[75%] space-x-2`}>
      {msg.sender === 'ai' && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback className="bg-primary/20 text-primary text-base">
            {msg.agent?.avatar || <Bot size={18}/>}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`p-3 rounded-xl shadow-md ${
          msg.sender === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-secondary text-secondary-foreground rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70'}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {msg.sender === 'user' && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarFallback><User size={18}/></AvatarFallback>
        </Avatar>
      )}
    </div>
  </motion.div>
);

const TypingIndicator = ({ currentAgent }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start items-end space-x-2"
  >
    <Avatar className="h-8 w-8 self-start">
      <AvatarFallback className="bg-primary/20 text-primary text-base">{currentAgent.avatar}</AvatarFallback>
    </Avatar>
    <div className="p-3 rounded-xl shadow-md bg-secondary text-secondary-foreground rounded-bl-none">
      <div className="flex space-x-1 items-center">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="h-2 w-2 bg-muted-foreground rounded-full" />
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2, ease: "easeInOut" }} className="h-2 w-2 bg-muted-foreground rounded-full" />
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4, ease: "easeInOut" }} className="h-2 w-2 bg-muted-foreground rounded-full" />
      </div>
    </div>
  </motion.div>
);

const EmptyChatPlaceholder = ({ currentAgentName }) => (
  <div className="text-center py-10 text-muted-foreground flex flex-col items-center justify-center h-full">
    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
    <p className="text-lg">Comece uma conversa!</p>
    <p className="text-sm">Envie uma mensagem para o {currentAgentName}.</p>
  </div>
);

const MessageList = ({ messages, isTyping, currentAgent, scrollAreaRef }) => {
  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-6 max-w-3xl mx-auto h-full">
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator currentAgent={currentAgent} />}
        {messages.length === 0 && !isTyping && (
          <EmptyChatPlaceholder currentAgentName={currentAgent.name} />
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;