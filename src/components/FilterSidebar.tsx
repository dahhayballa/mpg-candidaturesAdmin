import React from 'react'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import type { CandidateFilters } from '../types'

interface FilterSidebarProps {
  filters: CandidateFilters
  onChange: (filters: CandidateFilters) => void
  onReset: () => void
}

const SPECIALTIES = [
  "Tuyauterie industrielle",
  "Électricité industrielle",
  "Opérations pétrolières et gazières",
  "HSE",
  "Techniques minières",
  "Maintenance industrielle",
  "Construction métallique et soudure"
]

const ETATS = ['selectionne', 'en_attente', 'rejet']
const ETAT_LABELS: Record<string, string> = {
  selectionne: 'Sélectionné',
  en_attente: 'En attente',
  rejet: 'Rejeté / Refusé',
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const set = (key: keyof CandidateFilters, value: unknown) =>
    onChange({ ...filters, [key]: value })

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.specialty) ||
    Boolean(filters.etat) ||
    filters.hasCV ||
    filters.retenu ||
    filters.dossierComplet ||
    filters.minScore > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-800 font-bold">
          <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
            <SlidersHorizontal size={18} />
          </div>
          <span>Filtres de recherche</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 px-3 py-1.5 bg-brand-50 rounded-lg transition-colors"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Recherche</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              placeholder="Nom, email..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50/50 hover:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Spécialité</label>
          <div className="relative">
            <select
              value={filters.specialty}
              onChange={(e) => set('specialty', e.target.value)}
              className="w-full py-2.5 pl-3.5 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50/50 hover:bg-white transition-all shadow-sm appearance-none"
            >
              <option value="">Toutes les spécialités</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Etat */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">État</label>
          <div className="relative">
            <select
              value={filters.etat}
              onChange={(e) => set('etat', e.target.value)}
              className="w-full py-2.5 pl-3.5 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50/50 hover:bg-white transition-all shadow-sm appearance-none"
            >
              <option value="">Tous les états</option>
              {ETATS.map((e) => (
                <option key={e} value={e}>{ETAT_LABELS[e] || e}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Score */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Score min.</label>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-1.5 rounded">{filters.minScore}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minScore}
            onChange={(e) => set('minScore', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>
      </div>

      {/* Toggles */}
      {/* <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-8">
        {[
          { key: 'hasCV' as const, label: 'CV présent' },
          { key: 'retenu' as const, label: 'Candidat retenu' },
          { key: 'dossierComplet' as const, label: 'Dossier complet' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set(key, !filters[key])}
              className={`w-10 h-5.5 rounded-full outline-none transition-all flex-shrink-0 relative cursor-pointer border ${
                filters[key] ? 'bg-brand-500 border-brand-500' : 'bg-gray-200 border-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                  filters[key] ? 'translate-x-4' : 'translate-x-0'
                }`}
                style={{ width: '1.125rem', height: '1.125rem' }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
          </label>
        ))}
      </div> */}
    </div>
  )
}
