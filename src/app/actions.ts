'use server';

import { generateResponseToUserMessage } from '@/ai/flows/generate-response-to-user-message';
import type { Message } from '@/lib/types';

export async function sendMessageAction(
  history: Message[],
  newMessage: string
): Promise<{ response: string } | { error: string }> {
  try {
    const chatHistory = history
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const result = await generateResponseToUserMessage({
      message: newMessage,
      chatHistory: chatHistory,
    });

    if (!result.response) {
      return { error: 'The AI did not provide a response. Please try again.' };
    }

    return { response: result.response };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
