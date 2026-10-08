-- Up Migration
CREATE TABLE profile (
  user_id uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  username text NOT NULL CHECK (username ~ '^[A-Za-z0-9_]{3,30}$')
);
CREATE UNIQUE INDEX profile_username_key ON profile (lower(username));

-- Down Migration
DROP TABLE profile;