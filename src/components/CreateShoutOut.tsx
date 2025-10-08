import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  department: string | null;
}

interface CreateShoutOutProps {
  currentUserId: string;
  onShoutOutCreated: () => void;
}

const CreateShoutOut = ({ currentUserId, onShoutOutCreated }: CreateShoutOutProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Profile[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, department")
      .neq("id", currentUserId);

    if (error) {
      console.error("Error fetching profiles:", error);
      return;
    }

    setProfiles(data || []);
  };

  const handleAddRecipient = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile && !selectedRecipients.find((r) => r.id === profileId)) {
      setSelectedRecipients([...selectedRecipients, profile]);
    }
  };

  const handleRemoveRecipient = (profileId: string) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== profileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message required",
        description: "Please write a shout-out message",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: shoutout, error: shoutoutError } = await supabase
        .from("shoutouts")
        .insert({
          author_id: currentUserId,
          message: message.trim(),
        })
        .select()
        .single();

      if (shoutoutError) throw shoutoutError;

      if (selectedRecipients.length > 0) {
        const recipients = selectedRecipients.map((r) => ({
          shoutout_id: shoutout.id,
          recipient_id: r.id,
        }));

        const { error: recipientsError } = await supabase
          .from("shoutout_recipients")
          .insert(recipients);

        if (recipientsError) throw recipientsError;
      }

      toast({
        title: "Shout-out posted!",
        description: "Your recognition has been shared with the team.",
      });

      setMessage("");
      setSelectedRecipients([]);
      onShoutOutCreated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-[var(--shadow-soft)] border-border/50 bg-gradient-to-br from-card to-card/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
            <Award className="w-5 h-5 text-accent-foreground" />
          </div>
          Give Recognition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your Shout-Out</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share why you appreciate your colleague..."
              rows={4}
              className="resize-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Tag Colleagues</Label>
            <Select onValueChange={handleAddRecipient}>
              <SelectTrigger>
                <SelectValue placeholder="Select team members" />
              </SelectTrigger>
              <SelectContent>
                {profiles
                  .filter((p) => !selectedRecipients.find((r) => r.id === p.id))
                  .map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name}
                      {profile.department && ` - ${profile.department}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedRecipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedRecipients.map((recipient) => (
                  <Badge
                    key={recipient.id}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
                  >
                    {recipient.full_name}
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(recipient.id)}
                      className="ml-2 p-0.5 hover:bg-primary/30 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-[var(--shadow-hover)] transition-all"
          >
            {loading ? "Posting..." : "Post Shout-Out"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateShoutOut;
