export default function assignPlus (target, ...sources) {

  function implement (name, target, source, deep) {

    if (typeof source[name] === 'object') {
      switch (source[name][symbols.behavior]) {
        case symbols.behaviors.overwrite:
          target[name] = source[name]
          break
        case symbols.behaviors.merge:
          recurse(target[name], source[name], deep)
          break
        case symbols.behaviors.deep:
          recurse(target[name], source[name], true)
          break
        case symbols.behaviors.define:
          Object.defineProperty(target, name, source[name])
          break
        case symbols.behaviors.remove:
          delete target[name]
          break
        default:
          // Invalid behavior warning.
          if (deep) {
            recurse(target[name], source[name], deep)
          } else {
            target[name] = source[name]
          }
          break
      }
    } else {
      target[name] = source[name]
    }

  }

  function recurse (target, source, deep) {
    if (typeof source[symbols.behavior] === 'function') {
      source = source[symbols.behavior](target, source)
    } else {
      deep = deep || (source[symbols.behavior] === symbols.behaviors.deep)
    }
    if (typeof target === 'object') {
      for (let name of Object.keys(source)) {
        implement(name, target, source, deep)
      }
      for (let symbol of Object.getOwnPropertySymbols(source)) {
        if (
          source[symbol] !== symbols.behavior &&
          source.propertyIsEnumerable(symbol)
        ) {
          implement(symbol, target, source, deep)
        }
      }
    } else {
      // This may look like it won't copy literals, but by design,
      // it won't ever be invoked for the root object (and its literal properties)
      // or deeper, when a source property is a literal itself.
      throw new TypeError(`Target is not an object and cannot be merged with`)
    }
  }

  for (let source of sources) {
    // if (
    //   source[symbols.behavior] !== symbols.deep &&
    //   typeof source[symbols.behavior] !== 'function'
    // ) {
    //   console.warn(`Invalid behavior on root object, not deep merge or a handler, ignored.`)
    // }
    recurse(target, source)
  }

  return target

}

export const symbols = {
  behavior: Symbol('behavior'),
  behaviors: {
    merge: Symbol('merge'),
    deep: Symbol('deep merge'),
    overwrite: Symbol('overwrite'),
    define: Symbol('define'),
    remove: Symbol('delete')
  }
}
