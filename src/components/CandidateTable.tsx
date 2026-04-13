import React, { useState } from 'react'
import {
  FileText,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from 'lucide-react'
import type { Candidate } from '../types'

import { DocsModal } from './DocsModal'

interface CandidateTableProps {
  candidates: Candidate[]
  loading: boolean
  onEdit: (c: Candidate) => void
  onDelete: (id: number) => void
}

const ETAT_CONFIG: Record<string, { label: string; cls: string }> = {
  selectionne: { label: 'Sélectionné', cls: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200/60' },
  en_attente: { label: 'En attente', cls: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60' },
  rejet: { label: 'Rejeté', cls: 'bg-danger-50 text-danger-700 ring-1 ring-danger-200/60' },
}

const PAGE_SIZE = 15

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  loading,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(1)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [viewingDocs, setViewingDocs] = useState<Candidate | null>(null)

  const totalPages = Math.max(1, Math.ceil(candidates.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageData = candidates.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleDelete = (id: number) => {
    onDelete(id)
    setConfirmId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm font-sans">
        <div className="animate-spin w-5 h-5 border-2 border-brand-300 border-t-brand-600 rounded-full mr-2" />
        Chargement des documents…
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 font-sans">
        <FileText size={40} className="mb-3 opacity-30" />
        <p className="text-sm font-medium">Aucun candidat trouvé</p>
        <p className="text-xs mt-1">Essayez de modifier vos filtres pour voir plus de profils</p>
      </div>
    )
  }

  return (
    <div>
      {/* Confirm delete overlay */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm font-sans">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-danger-50 rounded-lg">
                <AlertTriangle size={18} className="text-danger-700" />
              </div>
              <h3 className="font-semibold text-gray-800">Confirmer la suppression</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Cette action est irréversible. Le candidat sera définitivement supprimé.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={14} /> Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="px-4 py-2 text-sm bg-danger-500 text-white rounded-lg hover:bg-danger-700 font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Docs Modal */}
      {viewingDocs && (
        <DocsModal 
          candidate={viewingDocs} 
          onClose={() => setViewingDocs(null)} 
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100/60 bg-gray-50/50">
              <th className="text-left py-3.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Candidat</th>
              <th className="text-left py-3.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Spécialité</th>
              <th className="text-left py-3.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">État</th>
              <th className="text-right py-3.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Score</th>
              <th className="text-center py-3.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Docs</th>
              <th className="py-3.5 px-4 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((c) => {
              const currentEtat = c.etat === null ? 'rejet' : c.etat
              const etatCfg = ETAT_CONFIG[currentEtat ?? ''] ?? { label: currentEtat ?? '—', cls: 'bg-gray-100 text-gray-500' }
              const score = c.score_total != null ? Math.round(c.score_total * 10) / 10 : null
              const scoreColor =
                score == null
                  ? 'text-gray-400'
                  : score >= 70
                    ? 'text-success-700 font-semibold'
                    : score >= 40
                      ? 'text-warning-700 font-semibold'
                      : 'text-danger-700 font-semibold'

              return (
                <tr key={c.id} className="border-b border-gray-100/50 hover:bg-brand-50/30 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-100/80 border border-brand-200 flex items-center justify-center text-brand-600 text-xs font-bold">
                        {(c.name ?? '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{c.name ?? '—'}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{c.email_addr ?? c.telephone ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 hidden md:table-cell">
                    <span className="truncate block max-w-[200px] font-medium">{c.specialty ?? '—'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${etatCfg.cls}`}>
                      {etatCfg.label}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 text-right hidden sm:table-cell ${scoreColor}`}>
                    {score != null ? score : '—'}
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-2">
                       <button
                         onClick={() => setViewingDocs(c)}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-brand-50 text-gray-500 hover:text-brand-600 rounded-lg text-[11px] font-bold transition-all border border-gray-100 hover:border-brand-200 shadow-sm"
                       >
                         <FileText size={14} />
                         <span>{c.num_attachments || 0} Dossiers</span>
                       </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(c)}
                        className="p-1.5 rounded-lg hover:bg-brand-100 text-gray-400 hover:text-brand-600 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmId(c.id)}
                        className="p-1.5 rounded-lg hover:bg-danger-100 text-gray-400 hover:text-danger-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-3 border-t border-gray-100 mt-1">
          <span className="text-xs text-gray-400">
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, candidates.length)} sur {candidates.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-gray-600 px-2">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
