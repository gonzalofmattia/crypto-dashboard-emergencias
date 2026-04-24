import '@testing-library/jest-dom'
import { vi } from 'vitest'

const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  scrollMargin: '',
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(),
}))

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})
