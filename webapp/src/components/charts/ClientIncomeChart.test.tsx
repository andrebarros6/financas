/**
 * Tests for ClientIncomeChart component
 */

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClientIncomeChart } from './ClientIncomeChart'
import type { Receipt } from '@/hooks/useReceipts'

// Mock Chart.js to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Chart</div>,
  getElementAtEvent: () => [],
}))

describe('ClientIncomeChart', () => {
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
    {
      id: '3',
      userId: 'user1',
      referencia: 'FR003',
      tipoDocumento: 'Fatura-Recibo',
      atcud: 'ATCUD003',
      situacao: 'Emitido',
      dataTransacao: new Date('2024-03-10'),
      motivoEmissao: null,
      dataEmissao: new Date('2024-03-10'),
      paisAdquirente: 'PORTUGAL',
      nifAdquirente: '123456789',
      nomeAdquirente: 'Cliente A',
      valorTributavel: 1500,
      valorIva: 345,
      impostoSeloRetencao: null,
      valorImpostoSelo: 0,
      valorIrs: 375,
      totalImpostos: 720,
      totalComImpostos: 1845,
      totalRetencoes: 375,
      contribuicaoCultura: 0,
      totalDocumento: 1470,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('renders chart title and description', () => {
    render(<ClientIncomeChart receipts={mockReceipts} />)

    expect(screen.getByText('Rendimento por Cliente')).toBeInTheDocument()
    expect(screen.getByText(/Top \d+ clientes por faturação/)).toBeInTheDocument()
  })

  it('renders chart component', () => {
    render(<ClientIncomeChart receipts={mockReceipts} />)

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('respects limit prop', () => {
    render(<ClientIncomeChart receipts={mockReceipts} limit={1} />)

    expect(screen.getByText(/Top 1 clientes/)).toBeInTheDocument()
  })

  it('handles empty receipts', () => {
    render(<ClientIncomeChart receipts={[]} />)

    expect(screen.getByText('Rendimento por Cliente')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })
})
