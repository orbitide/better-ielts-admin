'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type SubscriptionBreakdownEntry = { plan: string; count: number; percentage: number }

const PLAN_COLORS: Record<string, string> = {
  free: '#94a3b8',
  pro: '#10b981',
  elite: '#0ea5e9',
}
const FALLBACK_COLOR = '#a3a3a3'

export function SubscriptionBreakdown({ data }: { data: SubscriptionBreakdownEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="count"
          nameKey="plan"
        >
          {data.map((entry) => (
            <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan.toLowerCase()] ?? FALLBACK_COLOR} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
          }}
          formatter={(value) => [(value as number).toLocaleString(), '']}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
