import React, { useState, useEffect, useRef } from 'react';
import { createGardeningChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon, LeafIcon } from './Icons';
import { GenerateContentResponse } from '@google/genai';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm GreenThumb 🌱. Ask me anything about your plants!" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<ReturnType<typeof createGardeningChat> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session
    chatSessionRef.current = createGardeningChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSessionRef.current || isLoading) return;

    const userMessage = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullResponse = "";
      
      // Add placeholder for streaming response
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of result) {
          const responseChunk = chunk as GenerateContentResponse;
          const text = responseChunk.text || "";
          fullResponse += text;
          
          setMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg.role === 'model') {
                  lastMsg.text = fullResponse;
              }
              return newMessages;
          });
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered a problem. Can you try asking that again?", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-leaf-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-leaf-600 p-4 flex items-center space-x-3 shadow-sm z-10">
        <div className="bg-white/20 p-2 rounded-full text-white">
            <LeafIcon className="w-5 h-5" />
        </div>
        <div>
            <h3 className="text-white font-semibold">Botanist Chat</h3>
            <p className="text-leaf-100 text-xs">Powered by Gemini</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-leaf-600 text-white rounded-tr-none' 
                  : msg.isError 
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }
              `}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-end space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pruning, pests, or fertilizer..."
            className="flex-1 max-h-32 min-h-[50px] p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent resize-none text-slate-700 text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-leaf-600 text-white rounded-xl hover:bg-leaf-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;