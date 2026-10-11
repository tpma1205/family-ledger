import { describe, it, expect } from 'vitest'
import { pressKey, isValidAmount, MAX_DIGITS } from './amountInput.js'

const press = (keys, start = '') => keys.reduce(pressKey, start)

describe('數字鍵盤輸入', () => {
  it('依序按數字會接在後面', () => {
    expect(press(['1', '2', '0'])).toBe('120')
  })

  it('空白時按 0 直接忽略，開頭不會出現 0', () => {
    expect(press(['0', '0', '7'])).toBe('7')
  })

  it('已有數字時可以按 0', () => {
    expect(press(['5', '0', '0'])).toBe('500')
  })

  it('退格刪掉最後一位，空白時退格維持空白', () => {
    expect(press(['back'], '128')).toBe('12')
    expect(press(['back', 'back'], '1')).toBe('')
  })

  it('修改時接在既有金額後面', () => {
    expect(press(['5'], '128')).toBe('1285')
  })

  it(`達 ${MAX_DIGITS} 位數後忽略新的數字，退格仍可用`, () => {
    const full = '9'.repeat(MAX_DIGITS)
    expect(press(['1'], full)).toBe(full)
    expect(press(['back'], full)).toBe('9'.repeat(MAX_DIGITS - 1))
  })

  it('不認得的鍵直接忽略', () => {
    expect(press(['.', '-', '+'], '12')).toBe('12')
  })
})

describe('金額是否有效', () => {
  it('空白或 0 無效', () => {
    expect(isValidAmount('')).toBe(false)
    expect(isValidAmount('0')).toBe(false)
  })

  it('正整數有效', () => {
    expect(isValidAmount('1')).toBe(true)
    expect(isValidAmount('9999999')).toBe(true)
  })
})
