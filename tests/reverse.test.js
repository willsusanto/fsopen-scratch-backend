const { test, describe } = require('node:test')
const assert = require('node:assert')

const { reverse } = require('../utils/for_testing')

describe('reverse of ', () => {
  test('a', () => {
    const result = reverse('a')

    assert.strictEqual(result, 'a')
  })

  test('ambivalent', () => {
    const result = reverse('ambivalent')

    assert.strictEqual(result, 'tnelavibma')
  })

  test('saippuakauppias', () => {
    const result = reverse('saippuakauppias')

    assert.strictEqual(result, 'saippuakauppias')
  })
})


