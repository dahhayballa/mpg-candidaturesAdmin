import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'amber' | 'red'
}

const colorMap = {
  blue: {
    icon: 'bg-brand-50 text-brand-600',
    value: 'text-gray-900',
  },
  green: {
    icon: 'bg-success-50 text-success-600',
    value: 'text-gray-900',
  },
  amber: {
    icon: 'bg-warning-50 text-warning-600',
    value: 'text-gray-900',
  },
  red: {
    icon: 'bg-danger-50 text-danger-600',
    value: 'text-gray-900',
  },
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, sub, icon: Icon, color }) => {
  const c = colorMap[color]
  return (
    <div className="bg-white rounded-xl border border-gray-100/60 p-4 pb-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight pr-2">{label}</p>
        <div className={`rounded-lg p-2 shadow-sm shrink-0 ${c.icon}`}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className={`text-xl font-black ${c.value} tracking-tight leading-none`}>{value}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-1.5 font-bold leading-tight line-clamp-2">{sub}</p>}
      </div>
    </div>
  )
}
