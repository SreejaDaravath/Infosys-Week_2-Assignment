import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import CreateShoutOut from "@/components/CreateShoutOut";
import ShoutOutCard from "@/components/ShoutOutCard";

interface ShoutOut {
  id: string;
  message: string;
  created_at: string;
  author: {
    id: string;
    full_name: string;
  };
  recipients: Array<{ id: string; full_name: string }>;
  reactions: {
    like: number;
    clap: number;
    star: number;
  };
  userReactions: string[];
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [shoutouts, setShoutouts] = useState<ShoutOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchShoutouts();
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    if (data) {
      setUserName(data.full_name);
    }
  };

  const fetchShoutouts = async () => {
    setLoading(true);

    // Fetch shoutouts with authors
    const { data: shoutoutsData, error: shoutoutsError } = await supabase
      .from("shoutouts")
      .select(
        `
        id,
        message,
        created_at,
        author:profiles!shoutouts_author_id_fkey(id, full_name)
      `
      )
      .order("created_at", { ascending: false });

    if (shoutoutsError) {
      console.error("Error fetching shoutouts:", shoutoutsError);
      setLoading(false);
      return;
    }

    // Fetch recipients for all shoutouts
    const shoutoutIds = shoutoutsData.map((s) => s.id);
    const { data: recipientsData } = await supabase
      .from("shoutout_recipients")
      .select(
        `
        shoutout_id,
        recipient:profiles!shoutout_recipients_recipient_id_fkey(id, full_name)
      `
      )
      .in("shoutout_id", shoutoutIds);

    // Fetch reactions for all shoutouts
    const { data: reactionsData } = await supabase
      .from("reactions")
      .select("shoutout_id, user_id, reaction_type")
      .in("shoutout_id", shoutoutIds);

    // Process data
    const processedShoutouts: ShoutOut[] = shoutoutsData.map((shoutout) => {
      const recipients =
        recipientsData
          ?.filter((r) => r.shoutout_id === shoutout.id)
          .map((r) => r.recipient) || [];

      const shoutoutReactions =
        reactionsData?.filter((r) => r.shoutout_id === shoutout.id) || [];

      const reactions = {
        like: shoutoutReactions.filter((r) => r.reaction_type === "like").length,
        clap: shoutoutReactions.filter((r) => r.reaction_type === "clap").length,
        star: shoutoutReactions.filter((r) => r.reaction_type === "star").length,
      };

      const userReactions = shoutoutReactions
        .filter((r) => r.user_id === user?.id)
        .map((r) => r.reaction_type);

      return {
        id: shoutout.id,
        message: shoutout.message,
        created_at: shoutout.created_at,
        author: shoutout.author as { id: string; full_name: string },
        recipients: recipients as Array<{ id: string; full_name: string }>,
        reactions,
        userReactions,
      };
    });

    setShoutouts(processedShoutouts);
    setLoading(false);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-light/5 to-accent-light/10">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading BragBoard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-accent-light/10">
      <Header userName={userName} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <CreateShoutOut currentUserId={user.id} onShoutOutCreated={fetchShoutouts} />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Recent Recognition
              </span>
            </h2>

            {shoutouts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No shout-outs yet. Be the first to recognize a colleague!
                </p>
              </div>
            ) : (
              shoutouts.map((shoutout) => (
                <ShoutOutCard
                  key={shoutout.id}
                  id={shoutout.id}
                  authorName={shoutout.author.full_name}
                  message={shoutout.message}
                  recipients={shoutout.recipients}
                  createdAt={shoutout.created_at}
                  reactions={shoutout.reactions}
                  userReactions={shoutout.userReactions}
                  currentUserId={user.id}
                  onReactionUpdate={fetchShoutouts}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
