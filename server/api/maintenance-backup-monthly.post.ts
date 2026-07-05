import { createMonthlyBackup } from '../services/backupService'
import { getClientName } from '../utils/serverConfig'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const client = String(query.client || getClientName())

  return createMonthlyBackup({ client })
})
