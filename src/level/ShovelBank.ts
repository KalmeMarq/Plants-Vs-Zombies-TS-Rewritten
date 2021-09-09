import Level from '@/level/Level'
import Sounds from '@/sound/Sounds'
import { Container, Sprite } from 'pixi.js'

export default class ShovelBank extends Container {
  private level: Level
  private shovel: Sprite
  private ss = (e: MouseEvent) => {
    this.shovel.position.set(e.clientX - this.x + 4, e.clientY - this.y - this.shovel.height + 4)
  }

  public constructor(level: Level, x: number, y: number) {
    super()

    this.level = level
    this.x = x
    this.y = y

    const shovelG = Sprite.from('ShovelBank')
    shovelG.position.set(0, 0)
    this.addChild(shovelG)

    shovelG.interactive = true
    shovelG.buttonMode = true

    shovelG.on('click', () => {
      this.setVisible(!this.level.shovelSelected)
    })

    this.shovel = Sprite.from('Shovel')
    this.shovel.position.set(-6, -6)
    this.addChild(this.shovel)
  }

  public setVisible(v: boolean): void {
    this.level.shovelSelected = v
    // this.shovel.visible = !v
    if (v) {
      this.level.core.soundManager.playSound(Sounds.SHOVEL_TAP)
      window.addEventListener('pointermove', this.ss)
    } else {
      window.removeEventListener('pointermove', this.ss)
      this.shovel.position.set(-6, -6)
    }
  }
}
