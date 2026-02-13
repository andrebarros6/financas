'use client'

import { useMemo } from 'react'
import type { Receipt } from '@/hooks/useReceipts'
import type { TimeMode } from '@/lib/dashboard/types'
import { aggregateByTimePeriod } from '@/lib/dashboard/filters'
import { DetailedTimeChart } from '@/components/charts/DetailedTimeChart'

interface DetailedTimeTabProps {
  receipts: Receipt[]
  timeMode: TimeMode
}

export function DetailedTimeTab({ receipts, timeMode }: DetailedTimeTabProps) {
  const timeData = useMemo(
    () => aggregateByTimePeriod(receipts, timeMode),
    [receipts, timeMode]
  )

  return <DetailedTimeChart data={timeData} />
}
