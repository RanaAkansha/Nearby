-- Update the category check constraint to include 'wanted'
ALTER TABLE posts DROP CONSTRAINT posts_category_check;

ALTER TABLE posts ADD CONSTRAINT posts_category_check 
  CHECK (category IN ('sell', 'free', 'lost', 'found', 'announcement', 'wanted'));

-- Update the expiration trigger to handle 'wanted' items (7 days like sell/free)
CREATE OR REPLACE FUNCTION set_post_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category = 'announcement' THEN
    NEW.expires_at := NOW() + INTERVAL '3 days';
  ELSIF NEW.category IN ('sell', 'free', 'wanted') THEN
    NEW.expires_at := NOW() + INTERVAL '7 days';
  ELSIF NEW.category IN ('lost', 'found') THEN
    NEW.expires_at := NOW() + INTERVAL '14 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
