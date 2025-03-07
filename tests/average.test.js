const { test, describe } = require('node:test')
const assert = require('node:assert')
const { average } = require('../utils/for_testing')

describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of 4 is 2', () => {
    assert.strictEqual(average([2, 2]), 2)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})