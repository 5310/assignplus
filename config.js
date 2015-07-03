System.config({
  'baseURL': '/',
  'transpiler': 'babel',
  'babelOptions': {
    'optional': [
      'runtime'
    ]
  },
  'paths': {
    '*': '*.js',
    'github:*': 'jspm_packages/github/*.js',
    'npm:*': 'jspm_packages/npm/*.js'
  }
})

System.config({
  'map': {
    'assert': 'github:jspm/nodelibs-assert@0.1.0',
    'babel': 'npm:babel-core@5.6.15',
    'babel-runtime': 'npm:babel-runtime@5.6.15',
    'core-js': 'npm:core-js@0.9.18',
    'github:jspm/nodelibs-assert@0.1.0': {
      'assert': 'npm:assert@1.3.0'
    },
    'github:jspm/nodelibs-process@0.1.1': {
      'process': 'npm:process@0.10.1'
    },
    'github:jspm/nodelibs-util@0.1.0': {
      'util': 'npm:util@0.10.3'
    },
    'npm:assert@1.3.0': {
      'util': 'npm:util@0.10.3'
    },
    'npm:babel-runtime@5.6.15': {
      'process': 'github:jspm/nodelibs-process@0.1.1'
    },
    'npm:core-js@0.9.18': {
      'fs': 'github:jspm/nodelibs-fs@0.1.2',
      'process': 'github:jspm/nodelibs-process@0.1.1',
      'systemjs-json': 'github:systemjs/plugin-json@0.1.0'
    },
    'npm:inherits@2.0.1': {
      'util': 'github:jspm/nodelibs-util@0.1.0'
    },
    'npm:util@0.10.3': {
      'inherits': 'npm:inherits@2.0.1',
      'process': 'github:jspm/nodelibs-process@0.1.1'
    }
  }
})
