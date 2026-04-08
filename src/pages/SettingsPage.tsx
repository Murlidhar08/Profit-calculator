import { useSheetStore } from '../store/useSheetStore'
import { Save, ExternalLink, Database, LayoutGrid, Type, ChevronRight, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import { fetchSheetData } from '../lib/google-sheets'

const SettingsPage = () => {
  const { settings, updateSettings, accessToken } = useSheetStore()

  const { data } = useQuery({
    queryKey: ['sheetHeaders', settings.spreadsheetId, settings.sheetName],
    queryFn: () => fetchSheetData(settings.spreadsheetId, settings.sheetName, accessToken || ''),
    enabled: !!settings.spreadsheetId && !!accessToken
  })

  const headers = data?.headers || []

  const updateField = (key: string, value: string) => {
    updateSettings({ [key]: value })
  }

  const sections = [
    {
      id: 'connection',
      title: 'Data Connection',
      icon: Database,
      fields: [
        { label: 'Spreadsheet ID', key: 'spreadsheetId', placeholder: 'Enter your Google Sheet ID' },
        { label: 'Sheet Name', key: 'sheetName', placeholder: 'e.g. Sheet1' },
      ]
    },
    {
      id: 'mapping',
      title: 'Column Mapping',
      icon: LayoutGrid,
      fields: [
        { label: 'Title Column', key: 'titleColumn' },
        { label: 'Description Column', key: 'descriptionColumn' },
      ]
    },
    {
      id: 'calculations',
      title: 'Financial Logic',
      icon: Type,
      fields: [
        { label: 'Buy Price Column', key: 'buyColumn' },
        { label: 'Repair Cost Column', key: 'repairColumn' },
        { label: 'Sell Price Column', key: 'sellColumn' },
      ]
    }
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto pb-20">
      <div className="mb-10">
        <h2 className="font-headline font-extrabold text-4xl text-on-surface mb-2 tracking-tight">System Configuration</h2>
        <p className="text-on-surface-variant font-medium">Fine-tune the relationship between your spreadsheet and SheetFlow.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <section.icon className="w-5 h-5" />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{section.title}</h3>
            </div>

            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline/80 group-focus-within:text-primary transition-colors">
                      {field.label}
                    </label>
                    {field.key === 'spreadsheetId' && (
                      <a 
                        href={`https://docs.google.com/spreadsheets/d/${settings.spreadsheetId}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        VIEW SHEET <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  
                  {headers.length > 0 && field.id !== 'connection' && field.key !== 'spreadsheetId' && field.key !== 'sheetName' ? (
                    <select
                      value={(settings as any)[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full ledger-input font-headline font-bold text-lg py-2 appearance-none"
                    >
                      <option value="">Select a column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={(settings as any)[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full ledger-input font-headline font-bold text-lg py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex gap-4">
          <Info className="w-6 h-6 text-primary shrink-0" />
          <p className="text-sm text-on-surface-variant leading-relaxed">
            <strong>Spreadsheet ID</strong> can be found in your Google Sheet URL: 
            <code className="mx-1 bg-primary/10 text-primary px-1 rounded">/spreadsheets/d/[ID]/edit</code>. 
            Ensure your columns are located in the first row.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
