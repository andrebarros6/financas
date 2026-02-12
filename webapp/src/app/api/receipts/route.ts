/**
 * API Route: Receipts
 *
 * GET /api/receipts - Retrieves user's receipts from the database
 * DELETE /api/receipts - Deletes all user's receipts from the database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    // Type cast to work around generic type inference issues
    const receiptsTable = supabase.from('receipts') as any

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const client = searchParams.get('client')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build query
    let query = receiptsTable
      .select('*')
      .eq('user_id', user.id)
      .order('data_transacao', { ascending: false })

    // Apply filters
    if (year) {
      query = query.gte('data_transacao', `${year}-01-01`).lte('data_transacao', `${year}-12-31`)
    }

    if (client) {
      query = query.eq('nif_adquirente', client)
    }

    if (startDate) {
      query = query.gte('data_transacao', startDate)
    }

    if (endDate) {
      query = query.lte('data_transacao', endDate)
    }

    const { data: receipts, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Erro ao carregar recibos' },
        { status: 500 }
      )
    }

    // Transform snake_case to camelCase for frontend
    const transformedReceipts = receipts.map((receipt: any) => ({
      id: receipt.id,
      userId: receipt.user_id,
      referencia: receipt.referencia,
      tipoDocumento: receipt.tipo_documento,
      atcud: receipt.atcud,
      situacao: receipt.situacao,
      dataTransacao: new Date(receipt.data_transacao),
      motivoEmissao: receipt.motivo_emissao,
      dataEmissao: new Date(receipt.data_emissao),
      paisAdquirente: receipt.pais_adquirente,
      nifAdquirente: receipt.nif_adquirente,
      nomeAdquirente: receipt.nome_adquirente,
      valorTributavel: parseFloat(receipt.valor_tributavel),
      valorIva: parseFloat(receipt.valor_iva),
      impostoSeloRetencao: receipt.imposto_selo_retencao
        ? parseFloat(receipt.imposto_selo_retencao)
        : null,
      valorImpostoSelo: parseFloat(receipt.valor_imposto_selo),
      valorIrs: parseFloat(receipt.valor_irs),
      totalImpostos: receipt.total_impostos ? parseFloat(receipt.total_impostos) : null,
      totalComImpostos: parseFloat(receipt.total_com_impostos),
      totalRetencoes: parseFloat(receipt.total_retencoes),
      contribuicaoCultura: parseFloat(receipt.contribuicao_cultura),
      totalDocumento: parseFloat(receipt.total_documento),
      createdAt: new Date(receipt.created_at),
      updatedAt: new Date(receipt.updated_at),
    }))

    return NextResponse.json({
      success: true,
      count: transformedReceipts.length,
      receipts: transformedReceipts,
    })
  } catch (error) {
    console.error('Get receipts error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()
    // Type cast to work around generic type inference issues
    const receiptsTable = supabase.from('receipts') as any

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Delete all receipts for the user
    const { error } = await receiptsTable
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Erro ao eliminar recibos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Todos os recibos foram eliminados',
    })
  } catch (error) {
    console.error('Delete receipts error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
}
