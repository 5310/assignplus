# assignPlus

[![ecmascript-2015](https://img.shields.io/badge/es-2015-green.svg?style=flat)](http://www.ecma-international.org/publications/standards/Ecma-262.htm)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat)](https://github.com/feross/standard)
[![License](http://img.shields.io/badge/license-mit-green.svg?style=flat)](https://github.com/lahuan/lahuanjs-com-events/blob/master/LICENSE)
[![Dependency Status](https://david-dm.org/5310/assignplus.svg)](https://david-dm.org/5310/assignplus)
[![Build](http://img.shields.io/travis/5310/assignplus.svg?style=flat)](https://travis-ci.org/5310/assignplus)
[![Release](http://img.shields.io/badge/release-v0.1.0-orange.svg?style=flat)](https://github.com/5310/assignplus/releases)
[![jspm](https://img.shields.io/badge/jspm-github:5310/assignplus-blue.svg?style=flat)](http://jspm.io)
[![jspm](https://img.shields.io/badge/npm-5310/assignplus-blue.svg?style=flat)](https://docs.npmjs.com/cli/install)

`assignPlus` is a custom `Object.assign`-like function that can be overridden with symbolic annotations for advanced functionality.

With it you can not only do what `Object.assign` can, copy first-level enumerable own-properties of a object to another, but also merge property objects, whether by an object-by-object basis or recursively, and fully define properties on the target, or remove a property entirely. All with symbolic annotations defining the assignment behaviors.

This is an ES2015 module.

## Usage

- `assignPlus(target, source)`
  - The source objects properties will be assigned to the target object.
  - Without annotation, behaves just like `Object.assign`.

- Behaviors:
  - `merge`
    - Copies all enumerable own properties over to the target object.
    - If a nested object has this annotation, it does not overwrite the equivalent property on the target.
      - But does throw an exception if the equivalent target property is not an object itself.
    - Overwrites properties if they collide.
  - `deep`
    - Recursively, or "deeply" merges all objects from this annotated level and lower.
    - Can be an annotation in the root, unlike the other annotations.
  - `overwrite`
    - Used to break out of a deep merge.
    - The nested object with this property will overwrite the equivalent property on the target.
  - `define`
    - The nested object with this annotation will invoke `Object.defineProperty`!
      - The property will be defined on the equivalent level on the target.
      - The name of the object will become the name of the property being defined.
      - The annotated object itself will be passed to `Object.defineProperty` as configuration.
  - `remove`
    - A nested object with this annotation will delete the equivalent property on the target.

## Example
```
import assignPlus, {symbols} from './assignplus'
import assert from 'assert'

let x = {
  name: '',
  health: {
    max: 10,
    current: 10
  },
  twod: {
    position: {
      x: 0,
      y: 0,
      velocity: {
        dx: 0,
        dy: 0
      }
    },
    rotation: 0
  },
  enemy: {
    type: 'melee',
    rank: 2
  }
}

assignPlus(x, {
  name: 'random injured guy',
  health: {
    [symbols.behavior]: symbols.behaviors.merge,
    current: 5
  },
  twod: {
    [symbols.behavior]: symbols.behaviors.deep,
    position: {
      x: 100,
      y: 100,
      velocity: {
        [symbols.behavior]: symbols.behaviors.overwrite,
        x: 0,
        y: 0
      }
    }
  },
  enemy: { [symbols.behavior]: symbols.behaviors.remove },
  id: {
    [symbols.behavior]: symbols.behaviors.define,
    get: () => 123,
    enumerable: true
  }
})

assert.deepEqual(x, {
  name: 'random injured guy',
  health: {
    max: 10,
    current: 5
  },
  twod: {
    position: {
      x: 100,
      y: 100,
      velocity: {
        x: 0,
        y: 0
      }
    },
    rotation: 0
  },
  id: 123
})
```
Look at the `test.js` file for even more examples of the behaviors.
