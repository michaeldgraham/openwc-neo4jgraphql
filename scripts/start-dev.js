const path = require('path')
const concurrently = require('concurrently')
const execa = require('execa')

const API_DIR = path.join(__dirname, '../api')
const WEB_DIR = path.join(__dirname, '../web-openwc')

const shouldUseYarn = () => {
  try {
    execa.sync('yarnpkg', ['--version'])
    return true
  } catch (e) {
    return false
  }
}

const runner = shouldUseYarn() ? 'yarn' : 'npm'

const initialBuild = [
  {
    name: '[web] build',
    command: `cd ${WEB_DIR} && ${runner} run build`,
    prefixColor: 'grey',
  },
]

concurrently(initialBuild, {
  restartTries: 3,
  prefix: '{time} {name} |',
  timestampFormat: 'HH:mm:ss',
})
  .then((success, failure) => {
    if (success) {
      const jobs = [
        {
          name: '[api]',
          command: `cd ${API_DIR} && ${runner} run start:dev`,
          prefixColor: 'green',
        },
        {
          name: '[web] rollup',
          command: `cd ${WEB_DIR} && ${runner} run build:watch`,
          prefixColor: 'blue',
        },
        {
          name: '[web] typescript',
          command: `cd ${WEB_DIR} && ${runner} run tsc:watch`,
          prefixColor: 'blue',
        },
        {
          name: '[web] es-dev-server',
          command: `cd ${WEB_DIR} && ${runner} run start`,
          prefixColor: 'red',
        },
      ]
      concurrently(jobs, {
        restartTries: 3,
        prefix: '{time} {name} |',
        timestampFormat: 'HH:mm:ss',
      }).catch((e) => {
        console.error(e.message)
      })
    }
  })
  .catch((e) => {
    console.error(e.message)
  })
