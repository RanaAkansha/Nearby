-- Create posts table for hostel community board
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('sell', 'free', 'lost', 'found', 'announcement')),
  price DECIMAL(10, 2),
  name TEXT NOT NULL,
  room TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create an index on category and created_at for efficient querying
CREATE INDEX idx_posts_category_created ON posts(category, created_at DESC);
CREATE INDEX idx_posts_expires_at ON posts(expires_at);

-- Enable RLS (Row Level Security) - allow all reads, anyone can insert
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read posts
CREATE POLICY "Allow public read access" ON posts
  FOR SELECT USING (true);

-- Policy: Allow anyone to create posts
CREATE POLICY "Allow public insert" ON posts
  FOR INSERT WITH CHECK (true);

-- Function to automatically set expiration time on insert
CREATE OR REPLACE FUNCTION set_post_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category = 'announcement' THEN
    NEW.expires_at := NOW() + INTERVAL '3 days';
  ELSIF NEW.category IN ('sell', 'free') THEN
    NEW.expires_at := NOW() + INTERVAL '7 days';
  ELSIF NEW.category IN ('lost', 'found') THEN
    NEW.expires_at := NOW() + INTERVAL '14 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the expiration function
CREATE TRIGGER trigger_set_post_expiration
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION set_post_expiration();

-- Function to delete expired posts (run periodically)
CREATE OR REPLACE FUNCTION delete_expired_posts()
RETURNS TABLE(deleted_count BIGINT) AS $$
BEGIN
  DELETE FROM posts WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN QUERY SELECT deleted_count;
END;
$$ LANGUAGE plpgsql;
