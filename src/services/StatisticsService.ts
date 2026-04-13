import { supabase } from './supabaseClient'
import type { Candidate, CandidateFilters, SpecialtyStats, KpiData, EmailInfos } from '../types'

export async function fetchDashboardStats(): Promise<{ kpi: KpiData; stats: SpecialtyStats[] }> {
  let allData: any[] = []
  let from = 0
  const limit = 1000
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('candidates')
      .select('specialty, retenu')
      .range(from, from + limit - 1)
      
    if (error) throw error
    
    if (data && data.length > 0) {
      allData = [...allData, ...data]
      if (data.length < limit) {
        hasMore = false
      } else {
        from += limit
      }
    } else {
      hasMore = false
    }
  }

  let totalCandidatures = 0
  let totalSelected = 0

  const specMap: Record<string, { total: number; selected: number }> = {}

  for (const row of allData || []) {
    totalCandidatures++
    const isSelected = row.retenu === 1 || row.retenu === true
    if (isSelected) {
      totalSelected++
    }

    let spec = row.specialty
    if (!spec) spec = 'Non spécifié'

    if (!specMap[spec]) {
      specMap[spec] = { total: 0, selected: 0 }
    }
    specMap[spec].total++
    if (isSelected) {
      specMap[spec].selected++
    }
  }

  const stats: SpecialtyStats[] = []
  for (const [specialty, counts] of Object.entries(specMap)) {
    stats.push({
      specialty,
      total: counts.total,
      selected: counts.selected,
      rate: counts.total > 0 ? Math.round((counts.selected / counts.total) * 1000) / 10 : 0,
    })
  }

  stats.sort((a, b) => b.total - a.total)

  return {
    kpi: {
      totalCandidatures,
      totalSelected,
      selectionRate: totalCandidatures > 0 ? Math.round((totalSelected / totalCandidatures) * 1000) / 10 : 0,
      totalSpecialties: stats.length,
    },
    stats,
  }
}

export async function fetchCandidates(filters: CandidateFilters): Promise<Candidate[]> {
  let allData: Candidate[] = []
  let from = 0
  const limit = 1000
  let hasMore = true

  while (hasMore) {
    let query = supabase.from('candidates').select('*').order('rang', { ascending: true })
    
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email_addr.ilike.%${filters.search}%,telephone.ilike.%${filters.search}%`
      )
    }
    if (filters.specialty) query = query.eq('specialty', filters.specialty)
    if (filters.etat) {
      if (filters.etat === 'rejet') {
        query = query.or('etat.eq.rejet,etat.is.null')
      } else {
        query = query.eq('etat', filters.etat)
      }
    }
    if (filters.hasCV) query = query.eq('has_cv', 1)
    if (filters.retenu) query = query.eq('retenu', 1)
    if (filters.dossierComplet) query = query.eq('has_id', 1).eq('has_diplomas', 1)
    if (filters.minScore > 0) query = query.gte('score_total', filters.minScore)

    const { data, error } = await query.range(from, from + limit - 1)
    if (error) throw error
    
    if (data && data.length > 0) {
      allData = [...allData, ...data]
      if (data.length < limit) {
        hasMore = false
      } else {
        from += limit
      }
    } else {
      hasMore = false
    }
  }

  return allData
}

export async function createCandidate(
  candidate: Omit<Candidate, 'id'>
): Promise<Candidate> {
  const { data, error } = await supabase
    .from('candidates')
    .insert([candidate])
    .select()
    .single()
  if (error) throw error
  return data as Candidate
}

export async function updateCandidate(
  id: number,
  updates: Partial<Candidate>
): Promise<Candidate> {
  const { data, error } = await supabase
    .from('candidates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Candidate
}

export async function deleteCandidate(id: number): Promise<void> {
  const { error } = await supabase.from('candidates').delete().eq('id', id)
  if (error) throw error
}

export async function fetchSpecialties(): Promise<string[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('specialty')
    .not('specialty', 'is', null)
    .order('specialty')

  if (error) throw error
  if (!data) return []

  const unique = Array.from(new Set(data.map((item) => item.specialty)))
  return unique as string[]
}

export async function fetchEtats(): Promise<string[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('etat')
    .not('etat', 'is', null)
    .order('etat')

  if (error) throw error
  if (!data) return []

  const unique = Array.from(new Set(data.map((item) => item.etat)))
  return unique as string[]
}

export async function fetchEmailInfos(): Promise<EmailInfos | null> {
  const { data, error } = await supabase
    .from('email_infos')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching email_infos:', error)
    return null
  }
  return data as EmailInfos
}
