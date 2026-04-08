import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSheetData, addSheetRow, updateSheetRow } from '../lib/google-sheets'
import { useSheetStore } from '../store/useSheetStore'
import { ChevronLeft, Save, Trash2, Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

const EntryPage = () => {
  const { index } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { settings, accessToken } = useSheetStore()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const rowIndex = index ? parseInt(index) : null

  const { data, isLoading } = useQuery({
    queryKey: ['sheetData', settings.spreadsheetId, settings.sheetName],
    queryFn: () => fetchSheetData(settings.spreadsheetId, settings.sheetName, accessToken || ''),
    enabled: !!settings.spreadsheetId && !!accessToken
  })

  useEffect(() => {
    if (rowIndex && data?.rows) {
      const row = data.rows.find(r => r.rowIndex === rowIndex)
      if (row) {
        setFormData(row.values)
      }
    }
  }, [rowIndex, data])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!data?.headers) return
      if (rowIndex) {
        await updateSheetRow(settings.spreadsheetId, settings.sheetName, data.headers, rowIndex, formData, accessToken!)
      } else {
        await addSheetRow(settings.spreadsheetId, settings.sheetName, data.headers, formData, accessToken!)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetData'] })
      navigate('/')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  const headers = data?.headers || []
  
  // Logic from SKILL.md: Profit calculation helper
  const calculateLiveProfit = () => {
    const buy = parseFloat(formData[settings.buyColumn]) || 0
    const repair = parseFloat(formData[settings.repairColumn]) || 0
    const sell = parseFloat(formData[settings.sellColumn]) || 0
    return sell - (buy + repair)
  }

  const profit = calculateLiveProfit()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-3 bg-surface-container hover:bg-surface-container-high rounded-2xl text-on-surface-variant transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="font-headline font-bold text-2xl text-on-surface">
          {rowIndex ? 'Edit Entry' : 'New Entry'}
        </h2>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Live Calculation Card */}
        <div className="p-8 bg-primary rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-2">Live Profit Estimation</p>
            <h3 className="font-headline font-black text-5xl tracking-tight mb-2">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(profit)}
            </h3>
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Sparkles className="w-4 h-4" />
              <span>Based on configured buy/repair/sell columns</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-surface-container-low rounded-[2.5rem] p-8 space-y-6">
          {headers.map((header) => (
            <div key={header} className="space-y-2">
              <label 
                className={cn(
                  "block text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                  [settings.titleColumn, settings.buyColumn, settings.sellColumn].includes(header) ? "text-primary" : "text-outline/80"
                )}
              >
                {header}
              </label>
              <input
                type={(header.toLowerCase().includes('price') || header.toLowerCase().includes('cost')) ? 'number' : 'text'}
                value={formData[header] || ''}
                onChange={(e) => setFormData({ ...formData, [header]: e.target.value })}
                className="w-full ledger-input font-headline font-bold text-xl py-2"
                placeholder={`Enter ${header}...`}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex items-center justify-center gap-3 py-5 bg-on-surface text-white font-bold rounded-2xl hover:bg-on-surface/90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          <span className="text-lg">{rowIndex ? 'Update Records' : 'Save Entry'}</span>
        </button>

        {rowIndex && (
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-4 text-error font-bold rounded-2xl hover:bg-error-container/20 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            <span>Remove Permanently</span>
          </button>
        )}
      </motion.form>
    </div>
  )
}

export default EntryPage
