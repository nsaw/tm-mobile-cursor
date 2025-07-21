import { device, expect, element, by } from 'detox'

describe('Phase 0 Enforcement - Dual Mount Toggle', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  it('is interactable and fires a state switch', async () => {
    await expect(element(by.id('env-toggle'))).toBeVisible()
    await element(by.id('env-toggle')).tap()
    await expect(element(by.text('Switched'))).toBeVisible()
  })
}) 