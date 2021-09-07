import { Graphics } from "pixi.js"
import Plant from './Plant'
import { Sounds } from "."
import Level from "./Level"
import { isDev, MAX_SUN_COUNT } from "./Constants"
import Wallnut from "./Wallnut"
import SnowPea from "./SnowPea"
import Sunflower from "./Sunflower"

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

      if(this.level.SeedBank) {
        if(this.level.SeedBank.selected !== -1) {
          let cost = 0

          switch(this.level.SeedBank.selected) {
            case 3:
              cost = Sunflower.cost
              break;
            case 2:
              cost = Wallnut.cost
              break;
            case 1:
              cost = SnowPea.cost
              break;
            case 0:
              cost = Plant.cost
              break;
          
            default:
              cost = 10000
              break;
          }

          if(this.level.sunCount < cost) {
            this.level.SeedBank.emit('deselected')
            return
          }
      
          this.level.emit('subSun', cost)

          let plantG: Plant | undefined

          switch(this.level.SeedBank.selected) {
            case 3:
              plantG = new Sunflower(this.level, x, y, r, c)
              break;
            case 2:
              plantG = new Wallnut(this.level, x, y, r, c)
              break;
            case 1:
              plantG = new SnowPea(this.level, x, y, r, c)
              break;
            case 0:
              plantG = new Plant(this.level, x, y, r, c)
              break;
          
            default:
              break;
          }


          if(plantG) {
            this.plant = plantG
            this.addChild(plantG)

            this.level.core.soundManager.playSound(Sounds.PLANT)

            this.level.SeedBank.emit('deselected')
          } else {
            this.level.SeedBank.emit('deselected')
          }
        }
      }
    })
  }
}