import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Sparkles, Star, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ShoutOutCardProps {
  id: string;
  authorName: string;
  message: string;
  recipients: Array<{ id: string; full_name: string }>;
  createdAt: string;
  reactions: {
    like: number;
    clap: number;
    star: number;
  };
  userReactions: string[];
  currentUserId: string;
  onReactionUpdate: () => void;
}

const ShoutOutCard = ({
  id,
  authorName,
  message,
  recipients,
  createdAt,
  reactions,
  userReactions,
  currentUserId,
  onReactionUpdate,
}: ShoutOutCardProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const reactionIcons = {
    like: ThumbsUp,
    clap: Sparkles,
    star: Star,
  };

  const handleReaction = async (type: "like" | "clap" | "star") => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const hasReacted = userReactions.includes(type);

      if (hasReacted) {
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("shoutout_id", id)
          .eq("user_id", currentUserId)
          .eq("reaction_type", type);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("reactions").insert({
          shoutout_id: id,
          user_id: currentUserId,
          reaction_type: type,
        });

        if (error) throw error;
      }

      onReactionUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-foreground leading-relaxed mb-3">{message}</p>
        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipients.map((recipient) => (
              <Badge
                key={recipient.id}
                variant="secondary"
                className="bg-accent/20 text-accent-foreground border border-accent/30 hover:bg-accent/30 transition-colors"
              >
                @{recipient.full_name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-3 border-t border-border/40 flex gap-2">
        {(Object.keys(reactionIcons) as Array<"like" | "clap" | "star">).map((type) => {
          const Icon = reactionIcons[type];
          const isActive = userReactions.includes(type);
          const count = reactions[type];

          return (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(type)}
              disabled={isUpdating}
              className={`gap-2 ${
                isActive
                  ? "bg-accent/20 text-accent-foreground hover:bg-accent/30"
                  : "hover:bg-secondary"
              } transition-all`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "fill-current" : ""}`} />
              {count > 0 && <span className="text-sm font-medium">{count}</span>}
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 ml-auto hover:bg-secondary transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Comment</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShoutOutCard;
