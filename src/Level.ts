import { Graphics } from "@pixi/graphics"
import Core from "."
import { isDev } from "./Constants"
import Lawnmowers from "./Lawnmowers"
import Projectile from "./Projectile"
import Slot from "./Slot"
import Sun from "./Sun"
import Zombie from "./Zombies"

export default class Level {
  public core: Core
  public sunCount = isDev ? 2000 : 0
  public slots: Slot[] = []
  public zombies: Zombie[] = []
  public projectiles: Projectile[] = []
  public suns: Sun[] = []
  public lawnmowers: Lawnmowers[] = []
  public shovelSelected: boolean = false

  public constructor(core: Core) {
    this.core = core

    this.core.debugOverlay.sunsCT.text = `SunCount: ${this.sunCount}`

    setInterval(() => {
      if(this.core.running) {
        let sun0G = new Sun(this)
        this.suns.push(sun0G)
        this.core.root.addChild(sun0G)
      }
    }, 7000)
    
    setInterval(() => {
      if(this.core.running) {
        this.createZombie()
      }
    }, 12500)

    for(let i = 0; i < 45; i++) {
      const c = (i % 9)
      const r = Math.floor(i / 9)
      const x = c * 70 + 100
      const y = r * 85 + 120
    
      const slot = new Slot(this, x, y, r, c, null)
      this.slots.push(slot)
    
      this.core.root.addChild(slot)
    
      if(i % 9 === 0) {
        const l0 = new Lawnmowers(this, x - 85, y, r)
        this.lawnmowers.push(l0)
        this.core.root.addChild(l0)
      }
    }

    // this.createZombie()

    const shovelG = new Graphics()
    shovelG.position.set(600, 10)
    shovelG.beginFill(0x0f9f90)
    shovelG.drawRect(0, 0, 50, 70)
    this.core.root.addChild(shovelG)

    shovelG.interactive = true
    shovelG.buttonMode = true

    shovelG.on('click', () => {
      this.shovelSelected = !this.shovelSelected
    })
  }

  public update(dt: number): void {
    for(let i = 0; i < this.lawnmowers.length; i++){
      this.lawnmowers[i].update(dt)
    }

    for(let i = this.projectiles.length - 1; i >= 0; --i) {
      this.projectiles[i].update(dt)
    }
  
    for(let i = this.zombies.length - 1; i >= 0; --i) {
      this.zombies[i].update(dt)
    }
  
    for(let i = 0; i < this.suns.length; i++){
      this.suns[i].update(dt)
    }
  
    for(let i = 0; i < this.slots.length; i++){
      this.slots[i].plant?.update(dt)
    }
  }

  public createZombie(): void {
    const zombieG = new Zombie(this)
    this.zombies.push(zombieG)
    this.core.root.addChild(zombieG)
  }

  /** @ignore */
  public saveLevelData(): void {
    const data = {
      bank: {
        sunCount: this.sunCount
      },
      suns: this.suns.map(sun => {
        return {
          timer: sun.timer,
          count: sun.count,
          x: sun.x,
          y: sun.y,
          min_y: sun.minY
      }}),
      projectiles: this.projectiles.map(proj => {
        return { x: proj.x, y: proj.y }
      }),
      lawnmowers: this.lawnmowers.map(lm => {
        return {
          x: lm.x,
          y: lm.y,
          r: lm.r
        }
      }),
      zombies: this.zombies.map(zombie => {
        return {
          x: zombie.x,
          y: zombie.y,
          r: zombie.r,
          health: zombie.health,
          state: zombie.zstate
        }
      }),
      slots: this.slots.map(slot => {
        let plant: any = {}

        if(slot.plant) {
          plant.timer = slot.plant.timer
          plant.pstate = slot.plant.pstate
          plant.c = slot.plant.c
          plant.r = slot.plant.r
          plant.health = slot.plant.health
        }

        return {
          r: slot.r,
          c: slot.c,
          plant
        }
      })
    }

    console.log(data)
  }
}