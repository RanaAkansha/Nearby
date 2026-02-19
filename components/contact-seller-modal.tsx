'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerRoom: string;
  postTitle: string;
};

export function ContactSellerModal({
  isOpen,
  onClose,
  sellerName,
  sellerRoom,
  postTitle,
}: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [yourName, setYourName] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim() || !yourName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSending(true);
    // In a real app, this would send the message to the backend
    try {
      // Simulate sending
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Message sent to ${sellerName}!`);
      setMessage('');
      setYourName('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Contact {sellerName}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Post:</span> {postTitle}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Seller Room:</span> {sellerRoom}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
