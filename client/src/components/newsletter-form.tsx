import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Thank you for joining our newsletter. You'll receive updates about our permaculture programs.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-rrf-green to-rrf-dark-green text-white">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl">Join Our Newsletter</CardTitle>
        <p className="text-white/90 text-sm">
          Stay updated with our latest permaculture programs and success stories
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-rrf-green hover:bg-white/90"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rrf-green mr-2"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}