import { ChatbotService } from '../../types/chatbot';
import { ChatMessage } from '../../types/chatbot';
import { mockChatMessages, mockSuggestedPrompts } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let conversationHistory: ChatMessage[] = [...mockChatMessages];

function generateResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('quiz')) {
    return "Sure! Here's a quick question: What is the output of `print(2 ** 3)` in Python? A) 6, B) 8, C) 9, D) 23. Take your time and reply with your answer!";
  }
  if (lower.includes('easier') || lower.includes('simpler')) {
    return "Of course! Let me break it down more simply. Think of a variable as a labeled box where you store something. For example, `age = 25` means we put the number 25 in a box labeled 'age'. Does that make more sense?";
  }
  if (lower.includes('why') && lower.includes('wrong')) {
    return "Great question! Let me explain. The key thing to remember is that Python uses indentation (spaces) to group code. If your indentation is off, Python won't understand which lines belong together. Would you like me to show you an example?";
  }
  if (lower.includes('explain') || lower.includes('topic')) {
    return "Sure! Let me explain this concept. A function in Python is like a recipe — it's a set of instructions you can reuse. You define it once with `def`, and then you can 'call' it whenever you need it. For example: `def greet(): print('Hello!')`. Want me to go deeper?";
  }
  if (lower.includes('example')) {
    return "Here's another example: If you want to count from 1 to 5, you can write:\n```\nfor i in range(1, 6):\n    print(i)\n```\nThis will print 1, 2, 3, 4, 5. The `range(1, 6)` generates numbers from 1 up to (but not including) 6.";
  }
  return "That's a great question! I'm a mock AI assistant, so I can give you basic explanations and examples. When the real AI backend is connected, I'll be able to provide detailed, personalized help. For now, try asking me to 'explain this topic', 'give me an example', or 'quiz me'!";
}

export const mockChatbotApi: ChatbotService = {
  async sendMessage(message: string): Promise<ChatMessage> {
    await delay(1000);
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    conversationHistory.push(userMsg);

    const aiMsg: ChatMessage = {
      id: 'msg_' + (Date.now() + 1),
      role: 'assistant',
      content: generateResponse(message),
      timestamp: new Date().toISOString(),
    };
    conversationHistory.push(aiMsg);
    return aiMsg;
  },

  async getConversationHistory(): Promise<ChatMessage[]> {
    await delay(300);
    return conversationHistory;
  },

  getSuggestedPrompts(): string[] {
    return mockSuggestedPrompts;
  },
};
