/**
 * Tests for CsvUploader component
 */

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CsvUploader } from './CsvUploader'

describe('CsvUploader', () => {
  const mockOnUploadComplete = vi.fn()
  const mockOnUploadError = vi.fn()

  beforeEach(() => {
    mockOnUploadComplete.mockClear()
    mockOnUploadError.mockClear()
  })

  it('renders upload interface', () => {
    render(
      <CsvUploader
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    )

    expect(screen.getByText(/Arraste o ficheiro SIRE aqui/i)).toBeInTheDocument()
    expect(screen.getByText(/ou clique para selecionar/i)).toBeInTheDocument()
  })

  it('shows instructions for AT Portal', () => {
    render(
      <CsvUploader
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    )

    expect(screen.getByText(/Como exportar do Portal AT:/i)).toBeInTheDocument()
    expect(screen.getByText(/Portal das Finanças/i)).toBeInTheDocument()
  })

  it('has file input for CSV files', () => {
    render(
      <CsvUploader
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).not.toBeNull()
    expect(input?.accept).toBe('.csv')
  })

  it('renders drag and drop area', () => {
    render(
      <CsvUploader
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    )

    const dropzone = screen.getByText(/Arraste o ficheiro SIRE aqui/i).closest('div')
    expect(dropzone).toBeInTheDocument()
  })
})
