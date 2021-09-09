import Core from '@/.'
import Sounds from '@/sound/Sounds'
import { Texture } from '@pixi/core'
import { Sprite } from '@pixi/sprite'

export default class Checkbox extends Sprite {
  public checked: boolean

  public constructor(checked = false) {
    super()

    this.checked = checked
    this.setTexture()

    this.interactive = true
    this.buttonMode = true

    const core = Core.getInstance()

    this.on('click', (e) => {
      e.stopPropagation()
      this.checked = !this.checked
      this.setTexture()
      core.soundManager.playSound(Sounds.BUTTONCLICK)
      this.emit('checked', this.checked)
    })

    this.on('pointerdown', (e) => {
      e.stopPropagation()
    })
  }

  private setTexture(): void {
    if (this.checked) {
      this.texture = Texture.from('CheckboxChecked')
    } else {
      this.texture = Texture.from('CheckboxUnchecked')
    }
  }
}
