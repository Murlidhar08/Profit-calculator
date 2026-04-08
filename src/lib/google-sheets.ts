import axios from 'axios'

const GOOGLE_SHEETS_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

export interface SheetRow {
  rowIndex: number
  values: Record<string, any>
}

export const fetchSheetData = async (spreadsheetId: string, sheetName: string, accessToken: string): Promise<{ headers: string[], rows: SheetRow[] }> => {
  if (!spreadsheetId || !accessToken) return { headers: [], rows: [] }

  const response = await axios.get(`${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${sheetName}!A1:Z1000`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  const values = response.data.values || []
  if (values.length === 0) return { headers: [], rows: [] }

  const headers = values[0]
  const rows = values.slice(1).map((row: any[], index: number) => {
    const rowData: Record<string, any> = {}
    headers.forEach((header: string, i: number) => {
      rowData[header] = row[i] || ''
    })
    return {
      rowIndex: index + 2, // 1-indexed, and skipping header
      values: rowData
    }
  })

  return { headers, rows }
}

export const addSheetRow = async (spreadsheetId: string, sheetName: string, headers: string[], rowValues: Record<string, any>, accessToken: string) => {
  const rowArray = headers.map(header => rowValues[header] || '')
  
  await axios.post(`${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`, 
    { values: [rowArray] },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export const updateSheetRow = async (spreadsheetId: string, sheetName: string, headers: string[], rowIndex: number, rowValues: Record<string, any>, accessToken: string) => {
  const rowArray = headers.map(header => rowValues[header] || '')
  
  await axios.put(`${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${sheetName}!A${rowIndex}:Z${rowIndex}?valueInputOption=USER_ENTERED`, 
    { values: [rowArray] },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}
