import { Graphics } from "@pixi/graphics";
import Level from "./Level";

enum ILawnState {
  StandBy,
  Moving
}

export default class Lawnmowers extends Graphics {
  private level: Level
  public r: number
  public lstate: ILawnState

  public constructor(level: Level, x: number, y: number, r: number) {
    super()

    this.level = level
    this.x = x
    this.y = y
    this.r = r

    this.beginFill(0x00ff88)
    this.drawRect(2, 30, 60, 52)
    this.endFill()

    this.lstate = ILawnState.StandBy
  }

  public update(dt: number): void {
    if(this.lstate === ILawnState.Moving) {
      this.position.x += dt * 2.3

      if(this.x > 750) {
        const i = this.level.lawnmowers.findIndex(l => l === this)
        if(i !== -1) {
          this.level.lawnmowers.splice(i, 1)
          this.parent.removeChild(this)
          this.destroy()
          return
        }
      }
    }
    
    const z = this.level.zombies.find(f => {
      return f.r === this.r && f.x < this.x + this.width
    })

    if(!z) return
    this.lstate = ILawnState.Moving
    z.parent.removeChild(z)
    const i = this.level.zombies.findIndex(l => l === z)
    this.level.zombies.splice(i, 1)
    z.destroy()
  }
} 