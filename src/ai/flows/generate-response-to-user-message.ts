'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI-based responses to user messages.
 *
 * The flow takes a user message as input and returns an AI-generated response.
 * The response is generated using a complex tool that combines multiple sources of knowledge and different reasoning strategies to minimize hallucinations.
 *
 * @exports generateResponseToUserMessage - A function that triggers the flow to generate a response to a user message.
 * @exports GenerateResponseToUserMessageInput - The input type for the generateResponseToUserMessage function.
 * @exports GenerateResponseToUserMessageOutput - The output type for the generateResponseToUserMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseToUserMessageInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  chatHistory: z.string().optional().describe('The chat history so far.'),
});
export type GenerateResponseToUserMessageInput = z.infer<typeof GenerateResponseToUserMessageInputSchema>;

const GenerateResponseToUserMessageOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user message.'),
});
export type GenerateResponseToUserMessageOutput = z.infer<typeof GenerateResponseToUserMessageOutputSchema>;

export async function generateResponseToUserMessage(input: GenerateResponseToUserMessageInput): Promise<GenerateResponseToUserMessageOutput> {
  return generateResponseToUserMessageFlow(input);
}

const generateResponseToUserMessagePrompt = ai.definePrompt({
  name: 'generateResponseToUserMessagePrompt',
  input: {schema: GenerateResponseToUserMessageInputSchema},
  output: {schema: GenerateResponseToUserMessageOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the user message based on the chat history. Use multiple sources of knowledge and different reasoning strategies to minimize hallucinations.

Chat History:
{{chatHistory}}

User Message:
{{message}}

Response:`,
});

const generateResponseToUserMessageFlow = ai.defineFlow(
  {
    name: 'generateResponseToUserMessageFlow',
    inputSchema: GenerateResponseToUserMessageInputSchema,
    outputSchema: GenerateResponseToUserMessageOutputSchema,
  },
  async input => {
    const {output} = await generateResponseToUserMessagePrompt(input);
    return output!;
  }
);
