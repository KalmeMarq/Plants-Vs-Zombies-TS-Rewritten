import Core from "."
import Projectile from "./Projectile"
import Slot from "./Slot"
import Sun from "./Sun"
import Zombie from "./Zombies"

export default class Level {
  public core: Core
  public sunCount = 2000
  public slots: Slot[] = []
  public zombies: Zombie[] = []
  public projectiles: Projectile[] = []
  public suns: Sun[] = []

  public constructor(core: Core) {
    this.core = core

    setInterval(() => {
      if(this.core.running) {
        let sun0G = new Sun(this)
        this.suns.push(sun0G)
        this.core.root.addChild(sun0G)
      }
    }, 3000)
    
    setInterval(() => {
      if(this.core.running) {
        this.createZombie()
      }
    }, 12500)

    for(let i = 0; i < 45; i++) {
      const x = (i % 9) * 70 + 80
      const y = (i % 5) * 85 + 120
    
      const slot = new Slot(this, x, y, i % 5, i % 9, null)
      this.slots.push(slot)
    
      this.core.root.addChild(slot)
    }

    this.createZombie()
  }

  public update(dt: number): void {
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
}