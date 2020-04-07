import * as core from '@actions/core'
import * as installer from './installer'

async function run(): Promise<void> {
  try {
    const version = core.getInput('form-version')
    if (version) {
      await installer.installForm(version)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
