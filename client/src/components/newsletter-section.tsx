import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || null,
          interests: []
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for subscribing to our newsletter. You'll receive updates on our programs and permaculture tips.",
        });
        setEmail('');
        setName('');
      } else {
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: "Failed to subscribe to newsletter. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Stay Updated with RRF
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Get the latest updates on our programs, success stories, and permaculture tips delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Input 
              placeholder="Enter your email" 
              className="flex-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isSubmitting || !email}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}