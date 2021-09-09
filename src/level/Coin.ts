import Level from '@/level/Level'
import Sounds from '@/sound/Sounds'
import { Sprite, Texture } from 'pixi.js'

export enum ICoinState {
  Default,
  Collecting,
  Dead
}

export class Coin extends Sprite {
  private level: Level
  public count: number
  private cstate: ICoinState
  public speed = 0
  public timer = 0

  protected constructor(level: Level, x: number, y: number) {
    super()
    this.texture = Texture.from('SilverCoin')

    this.level = level
    this.count = 10
    this.cstate = ICoinState.Default

    this.x = x
    this.y = y

    this.interactive = true
    this.on('click', this.onClick)
  }

  private onClick(): void {
    this.level.core.emit('addMoney', this.count)

    this.cstate = ICoinState.Collecting

    this.interactive = false

    const p0 = {
      x: 50,
      y: 540
    }

    const a = p0.x - this.x
    const b = p0.y - this.y

    const c = Math.sqrt(a * a + b * b)

    this.speed = c / 140

    this.level.core.soundManager.playSound(Sounds.COIN)
  }

  public update(dt: number): void {
    this.timer += dt

    if (this.cstate === ICoinState.Collecting) {
      const p0 = {
        x: 50,
        y: 540
      }

      const angleDeg = Math.atan2(this.y - p0.y, this.x - p0.x)

      if (angleDeg > 0) {
        this.cstate = ICoinState.Dead
      } else {
        this.x = this.x + dt * -Math.cos(angleDeg) * 5.5 * this.speed
        this.y = this.y + dt * -Math.sin(angleDeg) * 5.5 * this.speed
      }
    }

    if ((this.timer > 700 && this.cstate === ICoinState.Default) || this.cstate === ICoinState.Dead) {
      this.parent.removeChild(this)
      this.destroy()
      this.level.coins.splice(this.level.coins.findIndex(p => p === this), 1)
    }
  }
}

export class SilverCoin extends Coin {
  public constructor(level: Level, x: number, y: number) {
    super(level, x, y)

    this.texture = Texture.from('SilverCoin')
    this.count = 10
  }
}

export class GoldCoin extends Coin {
  public constructor(level: Level, x: number, y: number) {
    super(level, x, y)

    this.texture = Texture.from('GoldCoin')
    this.count = 50
  }
}
