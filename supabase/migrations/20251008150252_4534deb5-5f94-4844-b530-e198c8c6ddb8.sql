-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create shoutouts table
CREATE TABLE public.shoutouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shoutouts ENABLE ROW LEVEL SECURITY;

-- Shoutouts policies
CREATE POLICY "Shoutouts are viewable by everyone"
  ON public.shoutouts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create shoutouts"
  ON public.shoutouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Create shoutout_recipients junction table (for tagging multiple people)
CREATE TABLE public.shoutout_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID REFERENCES public.shoutouts(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shoutout_id, recipient_id)
);

-- Enable RLS
ALTER TABLE public.shoutout_recipients ENABLE ROW LEVEL SECURITY;

-- Shoutout recipients policies
CREATE POLICY "Shoutout recipients are viewable by everyone"
  ON public.shoutout_recipients FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add recipients"
  ON public.shoutout_recipients FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create reactions table
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID REFERENCES public.shoutouts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'clap', 'star')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shoutout_id, user_id, reaction_type)
);

-- Enable RLS
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone"
  ON public.reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON public.reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoutout_id UUID REFERENCES public.shoutouts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();