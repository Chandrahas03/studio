import React from 'react';
import type { Message } from '@/lib/types';
import ChatMessage from './chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessages({
  messages,
  isLoading,
  scrollContainerRef,
}: ChatMessagesProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-6 space-y-6" ref={scrollContainerRef}>
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-accent/50 p-3 text-sm shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-0" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-150" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-300" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
