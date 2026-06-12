'use client'

import { useEffect, useState } from 'react'
import { httpClient } from '@/lib/api/http'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { BandTable } from '@/lib/types/content'

export default function BandTablesPage() {
  const [tables, setTables] = useState<BandTable[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    httpClient
      .get('/api/admin/content/band-tables')
      .then(({ data }) => {
        const raw = data.data as Array<{
          id: string
          skill: string
          variant: string
          rows: Array<{ rawScore: number; band: number }>
          updatedAt: string
        }>
        setTables(
          raw.map((t) => ({
            id: t.id,
            skill: t.skill as BandTable['skill'],
            type: t.variant as BandTable['type'],
            rows: t.rows ?? [],
            updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString().split('T')[0] : '',
          }))
        )
      })
      .catch(() => setTables([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-6 max-w-4xl mx-auto space-y-5">
      <PageHeader
        title="Band Conversion Tables"
        description="Raw score to band score conversion tables. Updated: Aug 2025."
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <Card key={table.id}>
              <CardHeader>
                <CardTitle className="capitalize text-sm">
                  {table.skill} — {table.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Raw Score</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Band</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {table.rows.map((row) => (
                      <tr key={row.rawScore} className="hover:bg-muted/30">
                        <td className="px-3 py-1.5 text-muted-foreground">{row.rawScore}</td>
                        <td className="px-3 py-1.5 font-mono font-semibold text-primary">{row.band.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
