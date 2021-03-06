import Level from '@/level/Level'
import Slot from '@/level/Slot'
import { Graphics, Text } from 'pixi.js'

enum IZombieState {
  Walk,
  Eat
}

export default class Zombie extends Graphics {
  private level: Level
  private speed = 0.4
  public velX: number
  public r: number
  public zstate: IZombieState
  private target: null | Slot
  public health: number
  public cold = false
  public coldTimer = 0

  private hT: Text

  public constructor(level: Level) {
    super()

    this.level = level
    this.target = null

    this.beginFill(0x00ffff)
    this.drawRect(0, 0, 64, 79)
    this.endFill()

    this.position.x = 750
    this.position.y = 103 + Math.round(Math.random() * 4) * 94

    this.r = (this.position.y - 103) / 94

    this.health = 150

    this.zstate = IZombieState.Walk
    this.velX = -this.speed

    this.hT = this.addChild(new Text(this.health.toString(), {
      fill: 0x000000,
      fontSize: 16
    }))
  }

  public setCold(): void {
    this.cold = true
    this.coldTimer = 0
  }

  public update(dt: number): void {
    if (this.cold) {
      this.coldTimer += dt

      if (this.coldTimer > 500) {
        this.cold = false
        this.coldTimer = 0
      }
    }

    if (this.health <= 0) {
      const i = this.level.zombies.findIndex(p => p === this)

      try {
        this.level.spawnCoin(this.x, this.y)

        this.parent.removeChild(this)
        this.level.zombies[i].destroy()
        this.level.zombies.splice(i, 1)
      } catch (e) {}
      return
    }

    if (this.zstate === IZombieState.Walk) {
      const p = this.level.slots.findIndex(l => {
        if (l.plant) {
          const p = l.plant

          if (p.x + p.width > this.x && this.r === l.r && p.x < this.x + this.width) {
            return true
          }
        } else return false

        return false
      })
      if (p >= 0) {
        this.velX = 0
        this.zstate = IZombieState.Eat
        this.target = this.level.slots[p]
      }
      this.position.x += dt * this.velX * (this.cold ? 0.5 : 1)
    } else if (this.zstate === IZombieState.Eat) {
      if (this.target?.plant) {
        this.target.plant.health -= 1 * (this.cold ? 0.5 : 1)

        if (this.target.plant.health <= 0) {
          this.target = null
          this.zstate = IZombieState.Walk
          this.velX = -this.speed
        }
      }
    }

    if (this.x < 5) {
      const i = this.level.zombies.findIndex(p => p === this)

      try {
        this.parent.removeChild(this)
        this.level.zombies[i].destroy()
        this.level.zombies.splice(i, 1)
      } catch (e) {}
    }

    this.hT.text = this.health.toString()
  }
}
