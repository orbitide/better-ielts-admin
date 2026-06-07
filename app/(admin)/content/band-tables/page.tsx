import { getBandTables } from '@/lib/data/content'
import { BandTablesView } from '@/components/content/BandTablesView'

export const metadata = { title: 'Band Tables' }

export default async function BandTablesPage() {
  const tables = await getBandTables()
  return (
    <div className="p-5 sm:p-6 max-w-4xl mx-auto">
      <BandTablesView tables={tables} />
    </div>
  )
}
