import React from 'react'
import type { SpecialtyStats } from '../types'

interface SpecialtyStatsTableProps {
  data: SpecialtyStats[]
  filterText: string
  onFilterChange: (v: string) => void
}

export const SpecialtyStatsTable: React.FC<SpecialtyStatsTableProps> = ({
  data,
  filterText,
  onFilterChange,
}) => {
  const filtered = data.filter((d) =>
    d.specialty.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">Résultats par spécialité</h2>
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filtrer…"
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 w-40"
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="text-left py-2.5 px-5 text-xs font-medium text-gray-400 uppercase tracking-wide">Spécialité</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">Total</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide hidden sm:table-cell">Sélectionnés</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wide hidden sm:table-cell">Rejetés</th>
            <th className="text-right py-2.5 px-5 text-xs font-medium text-gray-400 uppercase tracking-wide">Taux</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d, i) => {
            const rejected = d.total - d.selected
            const rateCls =
              d.rate >= 20
                ? 'bg-success-50 text-success-700'
                : d.rate >= 10
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-warning-50 text-warning-700'

            return (
              <tr
                key={d.specialty}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''
                  }`}
              >
                <td className="py-3 px-5 font-medium text-gray-700">{d.specialty}</td>
                <td className="py-3 px-4 text-right text-gray-600">{d.total}</td>
                <td className="py-3 px-4 text-right text-success-700 font-medium hidden sm:table-cell">
                  {d.selected}
                </td>
                <td className="py-3 px-4 text-right text-danger-700 hidden sm:table-cell">
                  {rejected}
                </td>
                <td className="py-3 px-5 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${rateCls}`}>
                    {d.rate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="py-10 text-center text-sm text-gray-400">Aucune spécialité trouvée</div>
      )}
    </div>
  )
}
