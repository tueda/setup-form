import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'

export async function installForm(version: string): Promise<string> {
  // In the GitHub releases, we have
  //   - 4.2.1
  //   - 4.2.0
  //   - 4.1.0 (= 4.1)
  //   - 4.0.0 (= 4.0-20120410)
  // at least for x86_64-linux. Note that each of these "stable" versions is
  // known to have specific critical bugs. Be careful!

  let semanticVersion: string
  let downloadVersion: string
  let tagVersion: string
  if (version === '4.0' || version === '4.0.0') {
    semanticVersion = '4.0.0'
    downloadVersion = '4.0-20120410'
    tagVersion = 'v4.0-20120410'
  } else if (version === '4.1' || version === '4.1.0') {
    semanticVersion = '4.1.0'
    downloadVersion = '4.1'
    tagVersion = 'v4.1-20131025'
  } else {
    semanticVersion = normalizeVersion(version)
    downloadVersion = semanticVersion
    tagVersion = `v${semanticVersion}`
  }

  core.debug(`FORM version = ${version}`)
  core.debug(`FORM semanticVersion = ${semanticVersion}`)
  core.debug(`FORM downloadVersion = ${downloadVersion}`)
  core.debug(`FORM tagVersion = ${tagVersion}`)

  // First, check cache. Note that the caching utility accept only semantic
  // versions.
  let toolPath = tc.find('form', semanticVersion)

  if (!toolPath) {
    // Download from the GitHub releases.
    let arch = 'unknown'
    if (process.platform === 'linux') {
      arch = 'x86_64-linux'
    } else if (process.platform === 'darwin') {
      arch = 'x86_64-osx'
    } else if (process.platform === 'win32') {
      arch = 'x86_64-win32'
    }

    const downloadUrl = `https://github.com/vermaseren/form/releases/download/${tagVersion}/form-${downloadVersion}-${arch}.tar.gz`
    let downloadPath: string
    try {
      downloadPath = await tc.downloadTool(downloadUrl)
    } catch (error) {
      core.debug(error)
      throw new Error(`Failed to download version ${version}: ${error}`)
    }

    // Extract and install into the tool cache.
    const extPath = await tc.extractTar(downloadPath)
    const toolRoot = path.join(extPath, `form-${downloadVersion}-${arch}`)
    toolPath = await tc.cacheDir(toolRoot, 'form', semanticVersion)
  }

  // Add it to the PATH.
  core.addPath(toolPath)

  return toolPath
}

function normalizeVersion(version: string): string {
  const versionPart = version.split('.')
  if (versionPart[1] == null) {
    return `${version}.0.0`
  } else if (versionPart[2] == null) {
    return `${version}.0`
  } else {
    return version
  }
}
