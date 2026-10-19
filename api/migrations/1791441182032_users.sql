-- Up Migration
CREATE TABLE users (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
email text NOT NULL UNIQUE
CHECK (email = lower(email) AND char_length(email) BETWEEN 3 AND 254),
password_hash text,
email_verified_at timestamptz,
created_at timestamptz NOT NULL DEFAULT now()
);


-- Down Migration
DROP TABLE users;