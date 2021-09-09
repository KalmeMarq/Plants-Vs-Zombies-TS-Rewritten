import Core from '@/.'
import Sounds from '@/sound/Sounds'
import { Container } from 'pixi.js'

export default abstract class AbstractButton extends Container {
  protected core: Core
  protected enabled = true

  public constructor(core: Core, x: number, y: number, onPress: () => void) {
    super()

    this.core = core
    this.x = x
    this.y = y

    this.interactive = true
    this.buttonMode = true

    this.on('click', () => {
      onPress()
    })

    this.on('pointerover', (e) => {
      e.stopPropagation()
      this.onMouseOver()
    })
    this.on('pointerout', (e) => {
      e.stopPropagation()
      this.onMouseLeave()
    })
    this.on('pointerdown', (e) => {
      e.stopPropagation()
      this.onMouseDown()
    })
    this.on('pointerup', (e) => {
      e.stopPropagation()
      this.onMouseRelease()
    })
    this.on('pointerupoutside', (e) => {
      e.stopPropagation()
      this.onMouseRelease()
    })
  }

  protected onMouseOver(): void {
    if (this.enabled) {
      this.core.soundManager.playSound(Sounds.BLEEP)
    }
  }

  protected abstract onMouseLeave(): void

  protected onMouseDown(): void {
    this.core.soundManager.playSound(Sounds.TAP)
  }

  protected abstract onMouseRelease(): void
}
