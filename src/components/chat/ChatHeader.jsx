import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ChatHeader = ({ currentAgent }) => {
  return (
    <header className="p-4 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-primary/20 text-primary text-base">
            {currentAgent.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{currentAgent.name}</h2>
          <p className="text-xs text-muted-foreground">{currentAgent.description}</p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;