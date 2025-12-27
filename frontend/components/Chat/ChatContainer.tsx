'use client';

import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatContainer() {
  return (
    <div className="flex flex-col h-full w-full bg-bg-primary gradient-mesh noise-texture relative overflow-hidden">
      {/* Decorative background elements - subtle accent orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/8 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-secondary/6 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full w-full">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}
