import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { BandTable } from '@/lib/types/content'

export function BandTablesView({ tables }: { tables: BandTable[] }) {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Band Conversion Tables"
        description="Raw score to band score conversion tables. Updated: Aug 2025."
      />
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
    </div>
  )
}
