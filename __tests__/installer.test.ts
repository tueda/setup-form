import io = require('@actions/io')
import fs = require('fs')
import os = require('os')
import path = require('path')

const toolDir = path.join(__dirname, 'runner', 'tools')
const tempDir = path.join(__dirname, 'runner', 'temp')

process.env['RUNNER_TOOL_CACHE'] = toolDir
process.env['RUNNER_TEMP'] = tempDir

jest.setTimeout(30000)

import * as installer from '../src/installer'

describe('installer tests', () => {
  beforeAll(async () => {
    await io.rmRF(toolDir)
    await io.rmRF(tempDir)
  }, 100000)

  afterAll(async () => {
    try {
      await io.rmRF(toolDir)
      await io.rmRF(tempDir)
    } catch {
      console.log('Failed to remove test directories')
    }
  }, 100000)

  it('Install FORM 4.3.0', async () => {
    await installer.installForm('4.3.0')
    const formDir = path.join(toolDir, 'form', '4.3.0', os.arch())
    expect(fs.existsSync(`${formDir}.complete`)).toBe(true)
    if (process.platform === 'win32') {
      expect(fs.existsSync(path.join(formDir, 'form.exe'))).toBe(true)
    } else {
      expect(fs.existsSync(path.join(formDir, 'form'))).toBe(true)
    }
  })

  it('Install FORM 4.2.1', async () => {
    await installer.installForm('4.2.1')
    const formDir = path.join(toolDir, 'form', '4.2.1', os.arch())
    expect(fs.existsSync(`${formDir}.complete`)).toBe(true)
    if (process.platform === 'win32') {
      expect(fs.existsSync(path.join(formDir, 'form.exe'))).toBe(true)
    } else {
      expect(fs.existsSync(path.join(formDir, 'form'))).toBe(true)
    }
  })

  it('Install FORM 4.2.0', async () => {
    await installer.installForm('4.2.0')
    const formDir = path.join(toolDir, 'form', '4.2.0', os.arch())
    expect(fs.existsSync(`${formDir}.complete`)).toBe(true)
    if (process.platform === 'win32') {
      expect(fs.existsSync(path.join(formDir, 'form.exe'))).toBe(true)
    } else {
      expect(fs.existsSync(path.join(formDir, 'form'))).toBe(true)
    }
  })

  it('Install FORM 4.1', async () => {
    await installer.installForm('4.1')
    const formDir = path.join(toolDir, 'form', '4.1.0', os.arch())
    expect(fs.existsSync(`${formDir}.complete`)).toBe(true)
    if (process.platform === 'win32') {
      expect(fs.existsSync(path.join(formDir, 'form.exe'))).toBe(true)
    } else {
      expect(fs.existsSync(path.join(formDir, 'form'))).toBe(true)
    }
  })

  it('Install FORM 4.0', async () => {
    await installer.installForm('4.0')
    const formDir = path.join(toolDir, 'form', '4.0.0', os.arch())
    expect(fs.existsSync(`${formDir}.complete`)).toBe(true)
    if (process.platform === 'win32') {
      expect(fs.existsSync(path.join(formDir, 'form.exe'))).toBe(true)
    } else {
      expect(fs.existsSync(path.join(formDir, 'form'))).toBe(true)
    }
  })
})
