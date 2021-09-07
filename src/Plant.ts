import { Graphics } from "@pixi/graphics"
import { Sprite } from "pixi.js"
import Level from "./Level"
import Projectile from "./Projectile"

enum IPlantState {
  StandBy,
  Shoot
}

export default class Plant extends Graphics {
  public static cost: number = 100
  protected level: Level
  public timer: number
  public pstate: IPlantState
  public c: number
  public r: number
  public health: number
  protected plantSprite: Sprite

  public constructor(level: Level, x: number, y: number, r: number, c: number) {
    super()

    this.level = level

    // this.beginFill(0xf40000)
    this.position.set(x + 3, y + 3)
    // this.drawRect(0, 0, 64, 80)
    // this.endFill()

    this.plantSprite = this.addChild(Sprite.from('PeaShooter'))
    this.plantSprite.scale.set(0.6, 0.6)
    this.plantSprite.position.x -= 2
    this.plantSprite.position.y += 4

    this.r = r
    this.c = c

    this.timer = 0
    this.pstate = IPlantState.StandBy

    this.health = 100
  
    this.init()
  }

  protected init(): void {
  }

  public update(dt: number): void {    
    if(this.pstate === IPlantState.Shoot) {
      this.timer += dt

      if(this.timer > 200) {
        const t = this.level.zombies.find(z => z.r === this.r && z.x > this.x)

        if(t) {
          this.pstate = IPlantState.Shoot
          this.timer = 0

          this.shoot()
        } else {
          this.pstate = IPlantState.StandBy
        }
      }
    } else if(this.pstate === IPlantState.StandBy) {
      const t = this.level.zombies.find(z => z.r === this.r && z.x > this.x)

      if(t) {
        this.pstate = IPlantState.Shoot
      } else {
        this.pstate = IPlantState.StandBy
      }
    }

    if(this.health <= 0) {
      this.parent.removeChild(this)
      this.level.slots.find(s => s.r === this.r && this.c === s.c)!.plant = null
      this.destroy()
    }
  }

  public shoot(): void {
    const proj0G = new Projectile(this.level, this.position.x, this.position.y)
    this.level.projectiles.push(proj0G)
    this.level.core.root.addChild(proj0G)
  }
}