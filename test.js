import assignPlus, {symbols} from './assignplus'
import assert from 'assert'

// Default behavior.
assert.deepEqual(
  assignPlus(

    {
      a: 1,
      b: {
        bb: 22
      }
    },

    Object.defineProperty({
      a: 11,
      b: {
        bbb: 222
      },
      c: 33
    }, 'd', {value: 4})

  ),

  Object.assign(

    {
      a: 1,
      b: {
        bb: 22
      }
    },

    Object.defineProperty({
      a: 11,
      b: {
        bbb: 222
      },
      c: 33
    }, 'd', {value: 4})

  ),

  'Default behavior failed.'
)

// Symbolic property handling.
;(() => {

  let symbol = Symbol()

  assert.ok(
    assignPlus(
      {},
      {[symbol]: true}
    )[symbol],
    'Enumerable symbolic property not copied.'
  )

  assert.ok(
    assignPlus(
      {a: {}},
      {a: Object.defineProperty({}, [symbol], {value: true})}
    ).a[symbol] === undefined,
    'Non-numerable symbolic property copied.'
  )

  assert.ok(
    assignPlus(
      {a: {}},
      {a: {[symbols.behavior]: true}}
    ).a[symbol] === undefined,
    'Behavior symbolic property copied.'
  )

})()

// Merge behavior.
;(() => {

  assert.deepEqual(
    assignPlus(
      {
        a: {
          aa: 11,
          bb: {
            bbb: 222
          }
        }
      },
      {
        a: {
          [symbols.behavior]: symbols.behaviors.merge,
          aa: 111,
          bb: {
            ccc: 333
          },
          cc: 33
        }
      }
    ),
    {
      a: { // This nested object has been merged with instead of being overwritten.
        aa: 111,
        bb: {
          ccc: 333
        },
        cc: 33
      }
    },
    'Merge failed.'
  )

  assert.throws(
    () => {
      assignPlus(
        {
          a: 1
        },
        {
          a: {
            [symbols.behavior]: symbols.behaviors.merge,
            aa: 22
          }
        }
      )
    },
    'Target is not an object and cannot be merged with',
    'Merge exception didn\'t raise.'
  )

})()

// Deep merge behavior.
;(() => {

  assert.deepEqual(
    assignPlus(
      {
        a: {
          aa: 11,
          bb: {
            bbb: 222
          }
        }
      },
      {
        [symbols.behavior]: symbols.behaviors.deep,
        a: {
          aa: 111,
          bb: {
            ccc: 333
          },
          cc: 33
        }
      }
    ),
    { // All the nested objects have been merged instead of being overwritten.
      a: {
        aa: 111,
        bb: {
          bbb: 222,
          ccc: 333
        },
        cc: 33
      }
    },
    'Deep merge failed.'
  )

  assert.deepEqual(
    assignPlus(
      {
        a: {
          aa: 11,
          bb: {
            bbb: 222
          }
        }
      },
      {
        [symbols.behavior]: symbols.behaviors.deep,
        a: {
          aa: 111,
          bb: {
            [symbols.behavior]: symbols.behaviors.overwrite,
            ccc: 333
          },
          cc: 33
        }
      }
    ),
    {
      a: {
        aa: 111,
        bb: { // This nested object has been overwritten.
          ccc: 333
        },
        cc: 33
      }
    },
    'Deep merge overwrite failed.'
  )

})()

// Define property behavior.
assert.deepEqual(
  assignPlus(
    {},
    {
      a: {
        [symbols.behavior]: symbols.behaviors.define,
        get: () => 1,
        enumerable: true
      }
    }
  ),
  {
    a: 1
  },
  'Define failed.'
)

// Remove Behavior.
assert.deepEqual(
  assignPlus(
    {
      a: 1
    },
    {
      a: {
        [symbols.behavior]: symbols.behaviors.remove
      }
    }
  ),
  {},
  'Remove failed.'
)

// Arbitrary handler Behavior.
assert.deepEqual(
  assignPlus(
    {},
    {
      [symbols.behavior]: (target, source) => (
        {
          a: {
            aa: 22
          },
          b: {[symbols.behavior]: (target, source) => 2}
        }
      )
    }
  ),
  {
    a: {
      aa: 22
    },
    b: 2
  },
  'Arbitrary handler behavior failed.'
)
