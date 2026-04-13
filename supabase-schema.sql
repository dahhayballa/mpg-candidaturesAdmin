-- ============================================================
-- SCHEMA SUPABASE — Dashboard Recrutement
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================================

CREATE TABLE public.candidates (
  id bigint NOT NULL DEFAULT nextval('candidates_id_seq'::regclass),
  email_addr text UNIQUE,
  name text,
  num_emails integer DEFAULT 0,
  first_date text,
  last_date text,
  specialty text,
  num_attachments integer DEFAULT 0,
  attachment_names text,
  has_cv integer DEFAULT 0,
  has_motivation integer DEFAULT 0,
  has_id integer DEFAULT 0,
  has_diplomas integer DEFAULT 0,
  status text,
  subjects text,
  body_preview text,
  folder_path text,
  score_niveau real,
  score_experience real,
  score_motivation real,
  score_adequation real,
  score_dossier real,
  score_disponibilite real,
  score_total real,
  mention text,
  note_evaluateur text,
  evalue_le text,
  hors_delai integer DEFAULT 0,
  enriched integer DEFAULT 0,
  retenu integer DEFAULT 0,
  justif_niveau text,
  justif_experience text,
  justif_motivation text,
  justif_adequation text,
  justif_dossier text,
  justif_disponibilite text,
  note_globale text,
  ia_scored integer DEFAULT 0,
  contenu_manquant integer DEFAULT 0,
  verification_required integer DEFAULT 0,
  source text,
  nni text,
  telephone text,
  etat text,
  rang bigint,
  rang_in_specialty bigint,
  CONSTRAINT candidates_pkey PRIMARY KEY (id)
);

CREATE TABLE public.audit_log (
  id bigint NOT NULL DEFAULT nextval('audit_log_id_seq'::regclass),
  action text,
  evaluateur text,
  detail text,
  created_at text,
  CONSTRAINT audit_log_pkey PRIMARY KEY (id)
);

CREATE TABLE public.evaluations (
  id bigint NOT NULL DEFAULT nextval('evaluations_id_seq'::regclass),
  candidate_id integer,
  evaluateur text,
  score_niveau real DEFAULT 0,
  score_experience real DEFAULT 0,
  score_motivation real DEFAULT 0,
  score_adequation real DEFAULT 0,
  score_dossier real DEFAULT 0,
  score_disponibilite real DEFAULT 0,
  score_total real DEFAULT 0,
  mention text,
  note text,
  created_at text,
  CONSTRAINT evaluations_pkey PRIMARY KEY (id)
);

CREATE TABLE public.duplicate_pairs (
  id bigint NOT NULL DEFAULT nextval('duplicate_pairs_id_seq'::regclass),
  candidate_a integer,
  candidate_b integer,
  similarity real,
  status text DEFAULT 'pending'::text,
  created_at text,
  CONSTRAINT duplicate_pairs_pkey PRIMARY KEY (id)
);

CREATE TABLE public.email_infos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre_emails_recu bigint,
  nombre_candidats bigint,
  recu_hors_temps bigint,
  nombre_candidats_papier bigint,
  nbr_dossier_complet bigint,
  nbr_dossier_partiel bigint,
  nbr_dossier_vide bigint,
  nbr_dossier_incomplet bigint,
  CONSTRAINT email_infos_pkey PRIMARY KEY (id)
);

CREATE TABLE public.processing_log (
  id bigint NOT NULL DEFAULT nextval('processing_log_id_seq'::regclass),
  run_date text,
  total_msgs integer,
  processed integer,
  skipped integer,
  duration_s real,
  CONSTRAINT processing_log_pkey PRIMARY KEY (id)
);

-- ── Row Level Security (RLS) ──────────────────────────────────
-- Activer RLS pour sécuriser l'accès
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (ajuster selon besoins)
CREATE POLICY "Allow read for authenticated users"
  ON public.candidates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users"
  ON public.candidates FOR ALL
  USING (auth.role() = 'authenticated');

-- ── Index pour les performances ───────────────────────────────
CREATE INDEX idx_candidates_specialty ON public.candidates(specialty);
CREATE INDEX idx_candidates_etat ON public.candidates(etat);
CREATE INDEX idx_candidates_score ON public.candidates(score_total);
CREATE INDEX idx_candidates_retenu ON public.candidates(retenu);
CREATE INDEX idx_candidates_name ON public.candidates(name);
