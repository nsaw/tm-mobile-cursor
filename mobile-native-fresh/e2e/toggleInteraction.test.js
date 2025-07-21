import { device, expect, element, by } from 'detox'

describe('Toggle Button Interaction', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  it('should toggle environments on tap', async () => {
    await expect(element(by.id('env-toggle'))).toBeVisible()
    await element(by.id('env-toggle')).tap()
    await expect(element(by.text('Environment Switched'))).toBeVisible()
  })
})
