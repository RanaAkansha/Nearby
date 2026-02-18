-- Add the new constraint that includes 'want' without validating existing rows
ALTER TABLE posts ADD CONSTRAINT posts_category_check 
CHECK (category IN ('sell', 'free', 'want', 'lost', 'found', 'announcement')) NOT VALID;

-- Update the expiration function to handle 'want' category
CREATE OR REPLACE FUNCTION set_post_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category = 'announcement' THEN
    NEW.expires_at := NOW() + INTERVAL '3 days';
  ELSIF NEW.category IN ('sell', 'free', 'want') THEN
    NEW.expires_at := NOW() + INTERVAL '7 days';
  ELSIF NEW.category IN ('lost', 'found') THEN
    NEW.expires_at := NOW() + INTERVAL '14 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
