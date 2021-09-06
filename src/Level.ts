import { Container } from "@pixi/display"
import { Sprite } from "@pixi/sprite"
import { Text } from "@pixi/text"
import Core, { Sounds } from "."
import { isDev } from "./Constants"
import Lawnmowers from "./Lawnmowers"
import Projectile from "./Projectile"
import Slot from "./Slot"
import Sun from "./Sun"
import Zombie from "./Zombies"

class ShovelBank extends Container {
  private level: Level
  private shovel: Sprite

  public constructor(level: Level, x: number, y: number) {
    super()

    this.level = level
    this.x = x
    this.y = y

    const shovelG = Sprite.from('ShovelBank')
    shovelG.position.set(0, 0)
    this.addChild(shovelG)

    shovelG.interactive = true
    shovelG.buttonMode = true

    shovelG.on('click', () => {
      this.setVisible(!this.level.shovelSelected)
    })

    this.shovel = Sprite.from('Shovel')
    this.shovel.position.set(-6, -6)
    this.addChild(this.shovel)
  }

  public setVisible(v: boolean): void {
    this.level.shovelSelected = v
    this.shovel.visible = !v

    if(v) {
      this.level.core.soundManager.playSound(Sounds.SHOVEL_TAP)
    }
  }
}

class SunBank extends Container {
  private level: Level
  public text: Text

  public constructor(level: Level, x: number, y: number) {
    super()

    this.level = level
    this.x = x
    this.y = y

    const bg = Sprite.from('SunBank')
    bg.position.set(0, 0)
    this.addChild(bg)

    this.text = new Text('0', {
      fill: 0x000000,
      fontSize: 18
    })

    this.text.anchor.set(0.5, 0)
    this.text.position.set(this.width / 2, 60)
    this.addChild(this.text)
  }
}

export default class Level extends Container {
  public core: Core
  public sunCount = isDev ? 2000 : 0
  public slots: Slot[] = []
  public zombies: Zombie[] = []
  public projectiles: Projectile[] = []
  public suns: Sun[] = []
  public lawnmowers: Lawnmowers[] = []
  public shovelSelected: boolean = false
  public sunBank: SunBank | null = null
  public shovelBank: ShovelBank | null = null

  public constructor(core: Core) {
    super()
    this.core = core

    this.on('addSun', (count) => {
      this.sunCount += count
      if(this.sunBank) this.sunBank.text.text = this.sunCount.toString()
    })

    this.on('subSun', (count) => {
      this.sunCount -= count
      if(this.sunBank) this.sunBank.text.text = this.sunCount.toString()
    })

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

    const bg = this.core.root.addChild(Sprite.from('Background1'))
    bg.zIndex = -2
    bg.position.x = -220

    for(let i = 0; i < 45; i++) {
      const c = (i % 9)
      const r = Math.floor(i / 9)
      const x = c * 79 + 40
      const y = r * 94 + 100
    
      const slot = new Slot(this, x, y, r, c, null)
      this.slots.push(slot)
    
      this.core.root.addChild(slot)
    
      if(i % 9 === 0) {
        const l0 = new Lawnmowers(this, x - 30, y, r)
        this.lawnmowers.push(l0)
        this.core.root.addChild(l0)
      }
    }

    this.shovelBank = new ShovelBank(this, 600, 10)
    this.core.root.addChild(this.shovelBank)
    this.sunBank = new SunBank(this, 100, 10)
    this.sunBank.text.text = this.sunCount.toString()
    this.core.root.addChild(this.sunBank)

    this.core.soundManager.playSound(Sounds.GRASS_WALK, 0.5)
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