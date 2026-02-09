/**
 * API Route: Import Receipts
 *
 * POST /api/receipts/import
 * Saves parsed receipts to the database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { ParsedReceipt } from '@/types/receipt'
import type { ReceiptInsert } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    // Use regular client for auth check
    const supabase = await createClient()

    // Use service role client for database operations (bypasses RLS)
    const serviceSupabase = createServiceClient()
    const receiptsTable = serviceSupabase.from('receipts') as any

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log('[Import] Auth check:', { userId: user?.id, authError })

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { receipts } = body as { receipts: ParsedReceipt[] }

    if (!receipts || !Array.isArray(receipts) || receipts.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum recibo para importar' },
        { status: 400 }
      )
    }

    // Transform receipts for database insertion
    // Convert camelCase to snake_case for database columns
    const dbReceipts: ReceiptInsert[] = receipts.map(receipt => {
      // Parse dates if they're strings (from JSON serialization)
      const dataTransacao = typeof receipt.dataTransacao === 'string'
        ? new Date(receipt.dataTransacao)
        : receipt.dataTransacao
      const dataEmissao = typeof receipt.dataEmissao === 'string'
        ? new Date(receipt.dataEmissao)
        : receipt.dataEmissao

      return {
        user_id: user.id,
        referencia: receipt.referencia,
        tipo_documento: receipt.tipoDocumento,
        atcud: receipt.atcud,
        situacao: receipt.situacao,
        data_transacao: dataTransacao.toISOString().split('T')[0],
        motivo_emissao: receipt.motivoEmissao,
        data_emissao: dataEmissao.toISOString().split('T')[0],
        pais_adquirente: receipt.paisAdquirente,
        nif_adquirente: receipt.nifAdquirente,
        nome_adquirente: receipt.nomeAdquirente,
        valor_tributavel: receipt.valorTributavel,
        valor_iva: receipt.valorIva,
        imposto_selo_retencao: receipt.impostoSeloRetencao,
        valor_imposto_selo: receipt.valorImpostoSelo,
        valor_irs: receipt.valorIrs,
        total_impostos: receipt.totalImpostos,
        total_com_impostos: receipt.totalComImpostos,
        total_retencoes: receipt.totalRetencoes,
        contribuicao_cultura: receipt.contribuicaoCultura,
        total_documento: receipt.totalDocumento,
      }
    })

    // Insert receipts
    let insertedCount = 0
    let updatedCount = 0
    let errorCount = 0

    console.log(`[Import] Attempting to insert ${dbReceipts.length} receipts for user ${user.id}`)

    for (const receipt of dbReceipts) {
      console.log(`[Import] Inserting receipt:`, { atcud: receipt.atcud, ref: receipt.referencia })
      const { error } = await receiptsTable.insert(receipt).select()

      if (error) {
        console.error('[Import] Insert failed:', { code: error.code, message: error.message, details: error.details })
        // Check if it's a duplicate error
        if (error.code === '23505') {
          // Duplicate, try to update instead
          console.log('[Import] Attempting update for duplicate:', receipt.atcud)
          const { error: updateError } = await receiptsTable
            .update(receipt)
            .eq('user_id', receipt.user_id)
            .eq('atcud', receipt.atcud)

          if (!updateError) {
            console.log('[Import] Update successful')
            updatedCount++
          } else {
            console.error('[Import] Update error:', updateError)
            errorCount++
          }
        } else {
          console.error('[Import] Insert error:', error)
          errorCount++
        }
      } else {
        console.log('[Import] Insert successful')
        insertedCount++
      }
    }

    console.log(`[Import] Results: inserted=${insertedCount}, updated=${updatedCount}, errors=${errorCount}`)

    const totalProcessed = insertedCount + updatedCount

    if (totalProcessed === 0) {
      return NextResponse.json(
        { error: 'Nenhum recibo foi importado. Verifique se os dados são válidos.' },
        { status: 400 }
      )
    }

    // Build success message
    let message = ''
    if (insertedCount > 0 && updatedCount > 0) {
      message = `${insertedCount} novo${insertedCount !== 1 ? 's' : ''} recibo${insertedCount !== 1 ? 's' : ''} importado${insertedCount !== 1 ? 's' : ''}, ${updatedCount} atualizado${updatedCount !== 1 ? 's' : ''}`
    } else if (insertedCount > 0) {
      message = `${insertedCount} recibo${insertedCount !== 1 ? 's' : ''} importado${insertedCount !== 1 ? 's' : ''} com sucesso`
    } else {
      message = `${updatedCount} recibo${updatedCount !== 1 ? 's' : ''} atualizado${updatedCount !== 1 ? 's' : ''} com sucesso`
    }

    return NextResponse.json({
      success: true,
      count: totalProcessed,
      inserted: insertedCount,
      updated: updatedCount,
      message,
    })
  } catch (error) {
    console.error('Import error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: `Erro ao processar pedido: ${errorMessage}` },
      { status: 500 }
    )
  }
}
