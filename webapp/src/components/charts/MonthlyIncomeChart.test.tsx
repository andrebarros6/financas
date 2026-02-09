/**
 * Tests for MonthlyIncomeChart component
 */

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MonthlyIncomeChart } from './MonthlyIncomeChart'
import type { Receipt } from '@/hooks/useReceipts'

// Mock Chart.js to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Chart</div>,
}))

describe('MonthlyIncomeChart', () => {
  const mockReceipts: Receipt[] = [
    {
      id: '1',
      userId: 'user1',
      referencia: 'FR001',
      tipoDocumento: 'Fatura-Recibo',
      atcud: 'ATCUD001',
      situacao: 'Emitido',
      dataTransacao: new Date('2024-01-15'),
      motivoEmissao: null,
      dataEmissao: new Date('2024-01-15'),
      paisAdquirente: 'PORTUGAL',
      nifAdquirente: '123456789',
      nomeAdquirente: 'Cliente A',
      valorTributavel: 1000,
      valorIva: 230,
      impostoSeloRetencao: null,
      valorImpostoSelo: 0,
      valorIrs: 250,
      totalImpostos: 480,
      totalComImpostos: 1230,
      totalRetencoes: 250,
      contribuicaoCultura: 0,
      totalDocumento: 980,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user1',
      referencia: 'FR002',
      tipoDocumento: 'Fatura-Recibo',
      atcud: 'ATCUD002',
      situacao: 'Emitido',
      dataTransacao: new Date('2024-02-20'),
      motivoEmissao: null,
      dataEmissao: new Date('2024-02-20'),
      paisAdquirente: 'PORTUGAL',
      nifAdquirente: '987654321',
      nomeAdquirente: 'Cliente B',
      valorTributavel: 2500,
      valorIva: 575,
      impostoSeloRetencao: null,
      valorImpostoSelo: 0,
      valorIrs: 625,
      totalImpostos: 1200,
      totalComImpostos: 3075,
      totalRetencoes: 625,
      contribuicaoCultura: 0,
      totalDocumento: 2450,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('renders chart title and description', () => {
    render(<MonthlyIncomeChart receipts={mockReceipts} />)

    expect(screen.getByText('Evolução Mensal')).toBeInTheDocument()
    expect(screen.getByText('Rendimento total por mês')).toBeInTheDocument()
  })

  it('renders chart component', () => {
    render(<MonthlyIncomeChart receipts={mockReceipts} />)

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('handles empty receipts', () => {
    render(<MonthlyIncomeChart receipts={[]} />)

    expect(screen.getByText('Evolução Mensal')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })
})
