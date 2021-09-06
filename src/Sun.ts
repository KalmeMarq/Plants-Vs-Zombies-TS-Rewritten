import { Graphics } from "pixi.js"
import { Sounds } from "."
import { MAX_SUN_COUNT } from "./Constants"
import Level from "./Level"

export default class Sun extends Graphics {
  private level: Level
  public count: number
  public timer: number
  public minY: number

  public constructor(level: Level, count?: number) {
    super()

    this.level = level

    this.count = count ?? 25
    this.timer = 0
    this.position.x = Math.round(Math.random() * 300) + 75
    this.minY = 400 - Math.round(Math.random() * 20)
    this.zIndex = 10

    this.interactive = true
    this.beginFill(0xffff33)
    this.drawCircle(120, 20, 25)
    this.endFill()

    this.on('click', this.onClick)
  }

  private onClick(): void {
    this.level.sunCount += this.count
    this.level.core.debugOverlay.sunsCT.text = `SunCount: ${Math.min(this.level.sunCount, MAX_SUN_COUNT)}`

    this.parent.removeChild(this)
    this.level.suns.splice(this.level.suns.findIndex(p => p.minY === this.minY), 1)
    this.destroy()
    
    this.level.core.soundManager.playSound(Sounds.SUN_POINTS)
  }

  public update(dt: number): void {
    this.timer += dt

    if(this.timer > 700) {
      this.parent.removeChild(this)
      this.destroy()
      this.level.suns.splice(this.level.suns.findIndex(p => p === this), 1)
      return
    }

    if(this.position.y < this.minY)
      this.position.y += dt * 2
  }
}