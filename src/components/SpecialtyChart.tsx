import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { SpecialtyStats } from '../types'

interface SpecialtyChartProps {
  data: SpecialtyStats[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.find((p: any) => p.dataKey === 'total')?.value ?? 0
    const selected = payload.find((p: any) => p.dataKey === 'selected')?.value ?? 0
    const rate = total > 0 ? ((selected / total) * 100).toFixed(1) : '0'
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium text-gray-800 mb-2">{label}</p>
        <p className="text-gray-500">
          Total: <span className="font-medium text-brand-700">{total}</span>
        </p>
        <p className="text-gray-500">
          Sélectionnés: <span className="font-medium text-success-700">{selected}</span>
        </p>
        <p className="text-gray-500">
          Taux: <span className="font-medium text-amber-600">{rate}%</span>
        </p>
      </div>
    )
  }
  return null
}

export const SpecialtyChart: React.FC<SpecialtyChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    name: d.specialty.length > 20 ? d.specialty.slice(0, 18) + '…' : d.specialty,
    fullName: d.specialty,
    total: d.total,
    selected: d.selected,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Distribution par spécialité
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          barCategoryGap="25%"
          barGap={3}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={160}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            formatter={(value) => (value === 'total' ? 'Total candidats' : 'Sélectionnés')}
          />
          <Bar dataKey="total" fill="#b5d4f4" radius={[0, 3, 3, 0]} name="total" />
          <Bar dataKey="selected" fill="#185fa5" radius={[0, 3, 3, 0]} name="selected" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
