'use client';

import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatContainer() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
