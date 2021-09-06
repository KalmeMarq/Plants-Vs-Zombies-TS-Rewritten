import { Graphics } from "pixi.js"
import Plant from './Plant'
import { plantsel, Sounds } from "."
import Level from "./Level"
import { isDev, MAX_SUN_COUNT } from "./Constants"
import Wallnut from "./Wallnut"
import SnowPea from "./SnowPea"

export default class Slot extends Graphics {
  private level: Level
  public r: number
  public c: number
  public plant: null | Plant

  public constructor(level: Level, x: number, y: number, r: number, c: number, plant: null | Plant) {
    super()
    // this.x = x
    this.level = level
    this.r = r
    this.c = c
    this.plant = plant

    isDev && this.lineStyle(1, 0x0000ff, 1)
    this.beginFill(0x000000, 0.0001)
    this.drawRect(x, y, 75, 90)
    this.endFill()
    this.zIndex = -1

    this.interactive = true
    this.on('click', (e) => {
      if(this.children.length > 0) {
        if(this.level.shovelSelected) {
          this.level.core.soundManager.playSound(Sounds.PLANT)
          this.removeChildren()
          this.plant = null
          this.level.shovelBank?.setVisible(false)
        }
        return
      }
  
      if(this.level.sunCount < 50) {
        return
      }
  
      this.level.emit('subSun', 50)

      const plantG = plantsel === 0 ? new Plant(this.level, x, y, r, c) : plantsel === 2 ? new SnowPea(this.level, x, y, r, c) : new Wallnut(this.level, x, y, r, c)

      this.plant = plantG
      this.addChild(plantG)

      this.level.core.soundManager.playSound(Sounds.PLANT)
    })
  }
}