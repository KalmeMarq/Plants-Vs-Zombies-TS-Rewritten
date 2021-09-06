import { Graphics, Text } from "pixi.js"
import Level from "./Level"
import Slot from "./Slot"

enum IZombieState {
  Walk,
  Eat
}

export default class Zombie extends Graphics {
  private level: Level
  private speed: number = 0.4
  public velX: number
  public r: number
  public zstate: IZombieState
  private target: null | Slot
  public health: number

  private hT: Text

  public constructor(level: Level) {
    super()

    this.level = level
    this.target = null

    this.beginFill(0x00ffff)
    this.drawRect(0, 0, 64, 79)
    this.endFill()

    this.position.x = 750
    this.position.y = 123 + Math.round(Math.random() * 4) * 85
  
    this.r = (this.position.y - 123) / 85

    this.health = 150

    this.zstate = IZombieState.Walk
    this.velX = -this.speed
  
    this.hT = this.addChild(new Text(this.health.toString(), {
      fill: 0x000000,
      fontSize: 16
    }))
  }

  public update(dt: number): void {
    if(this.health <= 0) {
      const i = this.level.zombies.findIndex(p => p === this)

      try {
        this.parent.removeChild(this)
        this.level.zombies[i].destroy()
        this.level.zombies.splice(i, 1)
      } catch(e) {}
      return
    }

    if(this.zstate === IZombieState.Walk) {
      let p = this.level.slots.findIndex(l => {
        if(l.plant) {
          const p = l.plant
  
          if(p.x + p.width > this.x && this.r === l.r && p.x < this.x + this.width) {
            return true
          }
        } else return false
      })
      if(p >= 0) {
        this.velX = 0
        this.zstate = IZombieState.Eat
        this.target = this.level.slots[p]
      }
      this.position.x += dt * this.velX
    } else if(this.zstate === IZombieState.Eat) {
      if(this.target?.plant) {

        this.target.plant.health -= 1

        if(this.target.plant.health <= 0) {
          this.target = null
          this.zstate = IZombieState.Walk
          this.velX = -this.speed
        }
      }
    }

    if(this.x < 5) {
      const i = this.level.zombies.findIndex(p => p === this)

      try {
        this.parent.removeChild(this)
        this.level.zombies[i].destroy()
        this.level.zombies.splice(i, 1)
      } catch(e) {}
    }

    this.hT.text = this.health.toString()
  }
}