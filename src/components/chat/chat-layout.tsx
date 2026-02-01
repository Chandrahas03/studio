'use client';

import { PlusCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/lib/types';
import { sendMessageAction } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { Button } from '@/components/ui/button';

const initialMessage: Message = {
  id: 'initial',
  role: 'assistant',
  content: "Hello! I'm Chatterbox AI. How can I assist you today?",
};

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([initialMessage]);
  };

  const handleSubmit = async (values: { message: string }) => {
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: values.message,
    };

    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await sendMessageAction(messages, values.message);
      if (result.error) {
        throw new Error(result.error);
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.response,
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
      // Remove the user message if AI fails to respond
      setMessages(prevMessages =>
        prevMessages.filter(m => m.id !== newUserMessage.id)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold font-headline text-primary">
            Chatterbox AI
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            aria-label="New Chat"
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          scrollContainerRef={scrollContainerRef}
        />
      </main>
      <footer className="border-t p-4">
        <div className="container mx-auto">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}
