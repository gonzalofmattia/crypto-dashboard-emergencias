import { describe, it, expect } from 'vitest'
import { formatPrice } from '../utils/formatPrice'

describe('formatPrice', () => {
  it('formats 77987 as $77,987.00', () => {
    expect(formatPrice(77987)).toBe('$77,987.00')
  })

  it('formats 0.098049 as $0.098049', () => {
    expect(formatPrice(0.098049)).toBe('$0.098049')
  })

  it('formats 1 as $1.00', () => {
    expect(formatPrice(1)).toBe('$1.00')
  })
})
