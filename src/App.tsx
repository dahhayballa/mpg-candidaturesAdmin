import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  CheckCircle,
  BarChart3,
  Briefcase,
  Plus,
  Menu,
  LayoutDashboard,
  List,
  ChevronRight,
  Mail,
  FileText,
  AlertTriangle,
  Clock,
  ClipboardCheck,
  Package,
  FileQuestion
} from 'lucide-react'

import { StatsCard } from './components/StatsCard'
import { SpecialtyChart } from './components/SpecialtyChart'
import { SpecialtyStatsTable } from './components/SpecialtyStatsTable'
import { FilterSidebar } from './components/FilterSidebar'
import { CandidateTable } from './components/CandidateTable'
import { CandidateModal } from './components/CandidateModal'
import { ToastContainer } from './components/ToastContainer'
import { useToast } from './hooks/useToast'
import {
  fetchCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  fetchDashboardStats,
  fetchEmailInfos
} from './services/StatisticsService'
import type { Candidate, CandidateFilters, KpiData, SpecialtyStats, EmailInfos } from './types'

type ActiveTab = 'dashboard' | 'candidates' | 'specialties'

const DEFAULT_FILTERS: CandidateFilters = {
  search: '',
  specialty: '',
  etat: '',
  hasCV: false,
  retenu: false,
  dossierComplet: false,
  minScore: 0,
}

function App() {
  const { toasts, addToast, removeToast } = useToast()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [specialtyFilter, setSpecialtyFilter] = useState('')

  // KPI data
  const [kpi, setKpi] = useState<KpiData>({
    totalCandidatures: 0,
    totalSelected: 0,
    selectionRate: 0,
    totalSpecialties: 0,
  })
  const [specialtyStats, setSpecialtyStats] = useState<SpecialtyStats[]>([])
  const [emailInfos, setEmailInfos] = useState<EmailInfos | null>(null)

  const loadDashboardData = useCallback(async () => {
    try {
      const [{ kpi, stats }, emails] = await Promise.all([
        fetchDashboardStats(),
        fetchEmailInfos()
      ])
      setKpi(kpi)
      setSpecialtyStats(stats)
      setEmailInfos(emails)
    } catch (err) {
      addToast('Erreur lors du chargement des statistiques', 'error')
    }
  }, [addToast])

  // Candidates tab state
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_FILTERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [savingCandidate, setSavingCandidate] = useState(false)

  const loadCandidates = useCallback(async () => {
    setLoadingCandidates(true)
    try {
      const data = await fetchCandidates(filters)
      setCandidates(data)
    } catch (err) {
      addToast('Erreur lors du chargement des candidats', 'error')
    } finally {
      setLoadingCandidates(false)
    }
  }, [filters, addToast])

  useEffect(() => {
    if (activeTab === 'candidates') {
      loadCandidates()
    } else if (activeTab === 'dashboard' || activeTab === 'specialties') {
      loadDashboardData()
    }
  }, [activeTab, loadCandidates, loadDashboardData])

  const handleOpenCreate = () => {
    setEditingCandidate(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (c: Candidate) => {
    setEditingCandidate(c)
    setModalOpen(true)
  }

  const handleSave = async (data: Partial<Candidate>) => {
    setSavingCandidate(true)
    try {
      if (editingCandidate) {
        await updateCandidate(editingCandidate.id, data)
        addToast('Candidat mis à jour avec succès', 'success')
      } else {
        await createCandidate(data as Omit<Candidate, 'id'>)
        addToast('Candidat créé avec succès', 'success')
      }
      setModalOpen(false)
      loadCandidates()
    } catch {
      addToast('Erreur lors de la sauvegarde', 'error')
    } finally {
      setSavingCandidate(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCandidate(id)
      addToast('Candidat supprimé', 'success')
      loadCandidates()
    } catch {
      addToast('Erreur lors de la suppression', 'error')
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-100">
            <Briefcase size={20} />
          </div>
          <span className="font-black text-gray-900 tracking-tighter text-xl">MPG</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard'
                ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100/50'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
          >
            <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'text-brand-500' : 'text-gray-400'} />
            Tableau de bord
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'candidates'
                ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100/50'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
          >
            <List size={18} className={activeTab === 'candidates' ? 'text-brand-500' : 'text-gray-400'} />
            Candidats
          </button>
          <button
            onClick={() => setActiveTab('specialties')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'specialties'
                ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100/50'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
          >
            <BarChart3 size={18} className={activeTab === 'specialties' ? 'text-brand-500' : 'text-gray-400'} />
            Statistiques
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs ring-2 ring-white">
              RH
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700">Administrateur</span>
              <span className="text-xs text-gray-400">Recrutement</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-gray-50/20">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-3 md:gap-0">
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight hidden sm:block">
              {activeTab === 'dashboard' ? 'Vue d\'ensemble' : activeTab === 'candidates' ? 'Gestion des candidats' : 'Résultats par spécialité'}
            </h2>
            <h2 className="text-base font-bold text-gray-800 tracking-tight sm:hidden">
              MPG Candidatures
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'candidates' && (
              <>
                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-all shadow-[0_2px_10px_-3px_rgba(217,119,87,0.5)]"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Nouveau profil</span>
                  <span className="sm:hidden">Nouveau</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* ── DASHBOARD TAB ──────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <main className="flex-1 p-4 md:p-8 overflow-auto scrollbar-thin">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center gap-2 text-xs text-brand-600 font-medium">
                <LayoutDashboard size={14} className="text-brand-400" />
                <span>Accueil</span>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-gray-500">Vue d'ensemble</span>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {emailInfos && (
                  <StatsCard
                    label="Emails Reçus"
                    value={emailInfos.nombre_emails_recu?.toLocaleString('fr-FR') || 0}
                    sub="flux boîte mail"
                    icon={Mail}
                    color="blue"
                  />
                )}
              
                <StatsCard
                  label="Total candidatures"
                  value={kpi.totalCandidatures.toLocaleString('fr-FR')}
                  icon={Users}
                  color="blue"
                />

                {emailInfos && (
                  <StatsCard
                    label="Candidats par Email"
                    value={emailInfos.nombre_candidats?.toLocaleString('fr-FR') || 0}
                    sub="extraits des emails"
                    icon={FileText}
                    color="blue"
                  />
                )}

                {emailInfos && (
                  <StatsCard
                    label="Candidats Papier"
                    value={emailInfos.nombre_candidats_papier || 0}
                    sub="dépôt physique"
                    icon={ClipboardCheck}
                    color="blue"
                  />
                )}

                <StatsCard
                  label="Candidats sélectionnés"
                  value={kpi.totalSelected}
                  sub="dossiers retenus"
                  icon={CheckCircle}
                  color="blue"
                />

                {emailInfos && (
                  <>
                    <StatsCard
                      label="Hors Délai"
                      value={emailInfos.recu_hors_temps || 0}
                      sub="reçus après limite"
                      icon={Clock}
                      color="blue"
                    />
                    <StatsCard
                      label="Dossiers Complets"
                      value={emailInfos.nbr_dossier_complet || 0}
                      sub="toutes pièces OK"
                      icon={Package}
                      color="blue"
                    />
                    <StatsCard
                      label="Dossiers Incomplets"
                      value={(emailInfos.nbr_dossier_incomplet || 0) + (emailInfos.nbr_dossier_partiel || 0)}
                      sub="manque des documents"
                      icon={AlertTriangle}
                      color="blue"
                    />
                    <StatsCard
                      label="Dossiers Vides"
                      value={emailInfos.nbr_dossier_vide || 0}
                      sub="sans pièces jointes"
                      icon={FileQuestion}
                      color="blue"
                    />
                  </>
                )}

                <StatsCard
                  label="Taux de sélection"
                  value={`${kpi.selectionRate}%`}
                  sub={`${(100 - kpi.selectionRate).toFixed(1)}% non retenus`}
                  icon={BarChart3}
                  color="blue"
                />
              </div>
            </div>
          </main>
        )}

        {/* ── SPECIALTIES TAB ─────────────────────────────────────────── */}
        {activeTab === 'specialties' && (
          <main className="flex-1 p-4 md:p-8 overflow-auto scrollbar-thin">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-brand-600 font-medium">
                <BarChart3 size={14} className="text-brand-400" />
                <span>Accueil</span>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-gray-500">Résultats par spécialité</span>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                <SpecialtyChart data={specialtyStats} />
              </div>

              {/* Specialty stats table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <SpecialtyStatsTable
                  data={specialtyStats}
                  filterText={specialtyFilter}
                  onFilterChange={setSpecialtyFilter}
                />
              </div>
            </div>
          </main>
        )}

        {/* ── CANDIDATES TAB ─────────────────────────────────────────── */}
        {activeTab === 'candidates' && (
          <main className="flex-1 min-w-0 p-4 md:p-8 overflow-auto scrollbar-thin bg-gray-50/30">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des candidats</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {loadingCandidates ? 'Recherche en cours…' : `${candidates.length} profil${candidates.length !== 1 ? 's' : ''} trouvé${candidates.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />

              {/* Table card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                <CandidateTable
                  candidates={candidates}
                  loading={loadingCandidates}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <CandidateModal
          candidate={editingCandidate}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          loading={savingCandidate}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App
