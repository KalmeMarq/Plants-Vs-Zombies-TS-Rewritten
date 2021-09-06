import { Graphics } from "pixi.js"
import Plant from './Plant'
import { Sounds } from "."
import Level from "./Level"
import { MAX_SUN_COUNT } from "./Constants"

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

    this.lineStyle(1, 0x00ff00, 1)
    this.beginFill(0x000000)
    this.drawRect(x, y, 70, 85)
    this.endFill()
    this.zIndex = -1

    this.interactive = true
    this.on('click', (e) => {
      if(this.children.length > 0) {
        if(this.level.shovelSelected) {
          this.level.core.soundManager.playSound(Sounds.PLANT)
          this.removeChildren()
          this.plant = null
          this.level.shovelSelected = false
        }
        return
      }
  
      if(this.level.sunCount < 50) {
        return
      }
  
      this.level.sunCount -= 50
      this.level.core.debugOverlay.sunsCT.text = `SunCount: ${Math.min(this.level.sunCount, MAX_SUN_COUNT)}`

      const plantG = new Plant(this.level, x, y, r, c)

      this.plant = plantG
      this.addChild(plantG)

      this.level.core.soundManager.playSound(Sounds.PLANT)
    })
  }
}