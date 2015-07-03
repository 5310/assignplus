import assignPlus, {symbols} from './assignplus'
import assert from 'assert'

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
    a: {
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
  {
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

// TODO: Uncomment when cloning is actually implemented.
// ;(() => {
//   let x = {}
//   let y = {
//     a: {
//       [symbols.behavior]: symbols.behaviors.clone,
//       __proto__: {
//         aa: 11
//       },
//       bb: {
//         bbb: 222
//       }
//     }
//   }
//   assignPlus(x, y)
//   assert.deepEqual(x, y, 'Cloning failed.')
//   assert.ok(!Object.is(x.a, y.a), 'Cloned property is merely copied.')
//   assert.ok(Object.is(x.a.prototype, y.a.prototype), 'Prototype is not shared upon cloning.')
//   assert.ok(!Object.is(x.a.bb, y.a.bb), 'Object properties are merely copied upon cloning.')
// })()

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
