import { Award, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-[var(--shadow-soft)]">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                BragBoard
              </h1>
              <p className="text-xs text-muted-foreground">Employee Recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {userName}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
