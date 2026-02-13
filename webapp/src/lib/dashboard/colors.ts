/**
 * Deterministic color palette for client segments in stacked charts.
 * Colors are visually distinct and cycle if there are more clients than colors.
 */

const PALETTE = [
  'rgba(99, 102, 241, 0.85)',   // indigo
  'rgba(168, 85, 247, 0.85)',   // purple
  'rgba(236, 72, 153, 0.85)',   // pink
  'rgba(239, 68, 68, 0.85)',    // red
  'rgba(249, 115, 22, 0.85)',   // orange
  'rgba(234, 179, 8, 0.85)',    // yellow
  'rgba(34, 197, 94, 0.85)',    // green
  'rgba(20, 184, 166, 0.85)',   // teal
  'rgba(6, 182, 212, 0.85)',    // cyan
  'rgba(59, 130, 246, 0.85)',   // blue
  'rgba(139, 92, 246, 0.85)',   // violet
  'rgba(244, 63, 94, 0.85)',    // rose
]

/**
 * Returns a deterministic color map for the given client NIFs.
 * The same NIF always gets the same color index (based on array position).
 */
export function getClientColors(nifs: string[]): Record<string, string> {
  const colors: Record<string, string> = {}
  nifs.forEach((nif, index) => {
    colors[nif] = PALETTE[index % PALETTE.length]
  })
  return colors
}

export function getClientColor(index: number): string {
  return PALETTE[index % PALETTE.length]
}
