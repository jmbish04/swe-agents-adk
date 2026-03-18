import { AIChatAgent } from "@cloudflare/ai-chat";

export class ProductManagerAgent extends AIChatAgent<Env> {
  async onChatMessage(message: string) {
    // Initial implementation
    return "Hello, I am the Product Manager Agent. How can I help you today?";
  }
}
