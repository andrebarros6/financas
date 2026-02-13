'use client'

import type { Receipt } from '@/hooks/useReceipts'
import { ClientIncomeChart } from '@/components/charts/ClientIncomeChart'

interface TotalPerClientTabProps {
  receipts: Receipt[]
}

export function TotalPerClientTab({ receipts }: TotalPerClientTabProps) {
  return <ClientIncomeChart receipts={receipts} limit={20} showStats />
}
