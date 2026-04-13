export interface Candidate {
  id: number
  email_addr: string | null
  name: string | null
  num_emails: number
  first_date: string | null
  last_date: string | null
  specialty: string | null
  num_attachments: number
  attachment_names: string | null
  has_cv: number
  has_motivation: number
  has_id: number
  has_diplomas: number
  status: string | null
  subjects: string | null
  body_preview: string | null
  folder_path: string | null
  score_niveau: number | null
  score_experience: number | null
  score_motivation: number | null
  score_adequation: number | null
  score_dossier: number | null
  score_disponibilite: number | null
  score_total: number | null
  mention: string | null
  note_evaluateur: string | null
  evalue_le: string | null
  hors_delai: number
  enriched: number
  retenu: number
  justif_niveau: string | null
  justif_experience: string | null
  justif_motivation: string | null
  justif_adequation: string | null
  justif_dossier: string | null
  justif_disponibilite: string | null
  note_globale: string | null
  ia_scored: number
  contenu_manquant: number
  verification_required: number
  source: string | null
  nni: string | null
  telephone: string | null
  etat: string | null
  rang: number | null
  rang_in_specialty: number | null
}

export interface SpecialtyStats {
  specialty: string
  total: number
  selected: number
  rate: number
}

export interface CandidateFilters {
  search: string
  specialty: string
  etat: string
  hasCV: boolean
  retenu: boolean
  dossierComplet: boolean
  minScore: number
}

export interface EmailInfos {
  id: number
  nombre_emails_recu: number | null
  nombre_candidats: number | null
  recu_hors_temps: number | null
  nombre_candidats_papier: number | null
  nbr_dossier_complet: number | null
  nbr_dossier_partiel: number | null
  nbr_dossier_vide: number | null
  nbr_dossier_incomplet: number | null
}

export interface KpiData {
  totalCandidatures: number
  totalSelected: number
  selectionRate: number
  totalSpecialties: number
}
