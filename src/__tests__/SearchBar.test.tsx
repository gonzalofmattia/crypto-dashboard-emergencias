import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../components/SearchBar'

describe('SearchBar', () => {
  it('renders input and calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('Buscar por nombre o símbolo...')
    expect(input).toBeInTheDocument()

    await user.type(input, 'bitcoin')
    expect(onChange).toHaveBeenCalled()
  })
})
