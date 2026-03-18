'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface ChartPoint {
  date: string
  price: number
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-[#0B0B0B]">{label}</p>
      <p className="text-[#31470B] font-bold">${payload[0].value.toLocaleString('es-MX')}</p>
    </div>
  )
}

interface PriceChartProps {
  data: ChartPoint[]
  minPrice: number | null
}

export function PriceChart({ data, minPrice }: PriceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#6B6B6B' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#6B6B6B' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        {minPrice && (
          <ReferenceLine
            y={minPrice}
            stroke="#10b981"
            strokeDasharray="4 2"
            strokeWidth={1}
          />
        )}
        <Line
          type="monotone"
          dataKey="price"
          stroke="#31470B"
          strokeWidth={2}
          dot={{ fill: '#31470B', r: 3 }}
          activeDot={{ r: 5, fill: '#31470B' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
