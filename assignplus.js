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
        case symbols.behaviors.clone:
          // TODO: Implement cloning.
          console.warn(`Clone behavior not yet implemented. Source merely copied.`)
          target[name] = source[name]
          break
        case symbols.behaviors.define:
          Object.defineProperty(target, name, source[name])
          break
        case symbols.behaviors.remove:
          delete target[name]
          break
        default:
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
    let deep = false
    if (source[symbols.behavior] !== undefined) {
      deep = source[symbols.behavior] === symbols.behaviors.deep
      if (source[symbols.behavior] !== symbols.behaviors.deep && source[symbols.behavior] !== symbols.behaviors.merge) {
        console.warn(`Invalid behavior ${source[symbols.behavior].toString()} for root object ignored.`)
      }
    }
    recurse(target, source, deep)
  }

  return target

}

export const symbols = {
  behavior: Symbol('behavior'),
  behaviors: {
    overwrite: Symbol('overwrite'),
    merge: Symbol('merge'),
    deep: Symbol('deep merge'),
    clone: Symbol('deep clone'),
    define: Symbol('define'),
    remove: Symbol('delete')
  }
}
