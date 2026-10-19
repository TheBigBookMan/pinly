-- Up Migration
CREATE TABLE auth_identity (
  provider text NOT NULL CHECK (provider IN ('google')),
  provider_subject text NOT NULL,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider, provider_subject)
);
CREATE INDEX auth_identity_user_id_idx ON auth_identity (user_id);

-- Down Migration
DROP TABLE auth_identity;