import { BaseTexture, Texture } from "@pixi/core"
import { Container } from "@pixi/display"
import { Graphics } from "@pixi/graphics"
import { Rectangle } from "@pixi/math"
import { Sprite } from "@pixi/sprite"
import { Text } from "@pixi/text"
import Core, { Sounds } from "."
import BinaryReader from "./binary/BinaryReader"
import BinaryWriter from "./binary/BinaryWriter"
import { isDev, MAX_SUN_COUNT } from "./Constants"
import Lawnmowers from "./Lawnmowers"
import Projectile from "./Projectile"
import Slot from "./Slot"
import Sun from "./Sun"
import Zombie from "./Zombies"

class ShovelBank extends Container {
  private level: Level
  private shovel: Sprite
  private ss = (e: MouseEvent) => {
    this.shovel.position.set(e.clientX - this.x + 4, e.clientY - this.y - this.shovel.height + 4)
  }

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
    // this.shovel.visible = !v
    if(v) {
      this.level.core.soundManager.playSound(Sounds.SHOVEL_TAP)
      window.addEventListener('pointermove', this.ss)
    } else {
      window.removeEventListener('pointermove', this.ss)
      this.shovel.position.set(-6, -6)
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
    bg.alpha = 0.0001
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

class SeedPacket extends Sprite {
  public index: number
  public seedBank: SeedBank
  public selected: boolean = false

  public constructor(index: number, seedBank: SeedBank, sprite: Sprite, cost: number) {
    super()
    this.seedBank = seedBank
    this.index = index
    this.texture = new Texture(BaseTexture.from('SeedsAtlas'), new Rectangle(100, 0, 50, 70))
    const p = this.addChild(sprite)
  
    p.scale.set(0.35, 0.35)
    p.anchor.set(0.5, 0)
    p.x = this.width / 2
    p.y = 10

    this.interactive = true
    
    this.on('click', (e) => {
      if(this.selected) {
        this.deselect()
      } else {
        this.select()
      }
    })
  }

  public select(): void {
    this.selected = true
    this.tint = 0x444444

    this.seedBank.emit('selected', this.index)
  }

  public deselect(): void {
    this.selected = false
    this.tint = 0xffffff
    this.seedBank.emit('deselected')
  }
}

class SeedBank extends Sprite {
  public selected: number = -1
  public sunBank: SunBank
  public packets: SeedPacket[] = []

  public constructor(level: Level) {
    super()

    this.texture = Texture.from('SeedBank')

    this.sunBank = new SunBank(level, 0, 0)
    this.sunBank.text.text = level.sunCount.toString()
    this.addChild(this.sunBank)

    const s = this.addChild(new SeedPacket(0, this, Sprite.from('PeaShooter'), 100))
    s.position.set(80, 8)

    const s1 = this.addChild(new SeedPacket(1, this, Sprite.from('SnowPea'), 175))
    s1.position.set(80 + 60, 8)

    const s3 = this.addChild(new SeedPacket(3, this, Sprite.from('Sunflower'), 50))
    s3.position.set(80 + 60 + 60 + 60, 8)

    const s2 = this.addChild(new SeedPacket(2, this, Sprite.from('WallnutBody'), 50))
    s2.position.set(80 + 60 + 60, 8)

    this.packets = [s, s1, s2, s3]

    this.on('selected', (idx) => {
      if(this.selected !== -1) {
        this.packets[this.selected].deselect()
      }
      this.selected = idx
    })

    this.on('deselected', () => {
      this.packets.forEach(s => {
        s.selected = false
        s.tint = 0xffffff
      })
      this.selected = -1
    })
  }
}

enum ICoinState {
  Default,
  Collecting,
  Dead
}

class Coin extends Sprite {
  private level: Level
  public count: number
  private cstate: ICoinState
  public speed: number = 0
  public timer: number = 0

  protected constructor(level: Level, x: number, y: number) {
    super()
    this.texture = Texture.from('SilverCoin')

    this.level = level
    this.count = 10
    this.cstate = ICoinState.Default

    this.x = x 
    this.y = y

    this.interactive = true
    this.on('click', this.onClick)
  }

  private onClick(): void {
    this.level.core.emit('addMoney', this.count)

    this.cstate = ICoinState.Collecting
    
    this.interactive = false 
    
    const p0 = {
      x: 50,
      y: 540
    }

    const a = p0.x - this.x
    const b = p0.y - this.y

    const c = Math.sqrt( a*a + b*b )

    this.speed = c / 140

    this.level.core.soundManager.playSound(Sounds.COIN)
  }

  public update(dt: number): void {
    this.timer += dt

    if(this.cstate === ICoinState.Collecting) {
      const p0 = {
        x: 50,
        y: 540
      }

      const angleDeg = Math.atan2(this.y - p0.y, this.x - p0.x)  
      
      if(angleDeg > 0) {
        this.cstate = ICoinState.Dead
      } else {
        this.x = this.x + dt * -Math.cos(angleDeg) * 5.5 * this.speed
        this.y = this.y + dt * -Math.sin(angleDeg) * 5.5 * this.speed
      }  
    }

    if((this.timer > 700 && this.cstate === ICoinState.Default) || this.cstate === ICoinState.Dead) {
      this.parent.removeChild(this)
      this.destroy()
      this.level.coins.splice(this.level.coins.findIndex(p => p === this), 1)
      return
    }
  }
}

class SilverCoin extends Coin {
  public constructor(level: Level, x: number, y: number) {
    super(level, x, y)

    this.texture = Texture.from('SilverCoin')
    this.count = 10
  }
}

class GoldCoin extends Coin {
  public constructor(level: Level, x: number, y: number) {
    super(level, x, y)

    this.texture = Texture.from('GoldCoin')
    this.count = 50
  }
}

export default class Level extends Container {
  public core: Core
  public sunCount = isDev ? 500 : 50
  public slots: Slot[] = []
  public zombies: Zombie[] = []
  public projectiles: Projectile[] = []
  public suns: Sun[] = []
  public lawnmowers: Lawnmowers[] = []
  public coins: Coin[] = []
  public shovelSelected: boolean = false
  public SeedBank: SeedBank | null = null
  public shovelBank: ShovelBank | null = null
  private lastSunTime: number = 0
  private lastZombieTime: number = 0

  public constructor(core: Core) {
    super()
    this.core = core

    this.on('addSun', (count) => {
      this.sunCount = Math.min(this.sunCount + count, MAX_SUN_COUNT)
      if(this.SeedBank) this.SeedBank.sunBank.text.text = this.sunCount.toString()

      if(this.sunCount >= 8000 && this.core.achievements.sunny_day === 0) {
        this.core.achievements.sunny_day = 1

        this.core.soundManager.playSound(Sounds.ACHIEVEMENT)
        const p = this.core.root.addChild(new Text('Achievement: Sunny day'))
        setTimeout(() => {
          p.parent.removeChild(this)
          p.destroy()
        }, 3000)
      }
    })

    this.on('subSun', (count) => {
      this.sunCount -= count
      if(this.SeedBank) this.SeedBank.sunBank.text.text = this.sunCount.toString()
    })

    const bg = this.addChild(Sprite.from('Background1'))
    bg.zIndex = -2
    bg.position.x = -220

    for(let i = 0; i < 45; i++) {
      const c = (i % 9)
      const r = Math.floor(i / 9)
      const x = c * 79 + 40
      const y = r * 94 + 100
    
      const slot = new Slot(this, x, y, r, c, null)
      this.slots.push(slot)
    
      this.addChild(slot)
    
      if(i % 9 === 0) {
        const l0 = new Lawnmowers(this, x - 30, y, r)
        this.lawnmowers.push(l0)
        this.addChild(l0)
      }
    }

    this.shovelBank = new ShovelBank(this, 600, 10)
    this.addChild(this.shovelBank)
    // this.core.soundManager.playSound(Sounds.GRASS_WALK, 0.1)

    this.SeedBank = this.addChild(new SeedBank(this))
    this.SeedBank.position.set(100, 10)
    // seedBankG.texture = Texture.from('SeedBank')
  }

  public spawnCoin(x: number, y: number): void {
    const r = Math.random()
    if(r < 0.5) this.coins.push(this.addChild(new SilverCoin(this, x, y)))
    else this.coins.push(this.addChild(new GoldCoin(this, x, y)))
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

    for(let i = 0; i < this.coins.length; i++){
      this.coins[i].update(dt)
    }
  
    for(let i = 0; i < this.slots.length; i++){
      this.slots[i].plant?.update(dt)
    }

    if(this.lastSunTime === 0) {
      this.lastSunTime = Date.now()
    }

    if(Date.now() - this.lastSunTime > 10000) {
      let sun0G = new Sun(this)
      this.suns.push(sun0G)
      this.addChild(sun0G)
      this.lastSunTime = Date.now()
    }

    if(this.lastZombieTime === 0) {
      this.lastZombieTime = Date.now()
    }

    if(Date.now() - this.lastZombieTime > 12500) {
      this.createZombie()
      this.lastZombieTime = Date.now()
    }
  }

  public createZombie(): void {
    const zombieG = new Zombie(this)
    this.zombies.push(zombieG)
    this.addChild(zombieG)
  }

  /** @ignore */
  public saveLevelData(): void {
    let writer = new BinaryWriter()
    writer.writeUint32(14)

    writer.writeInt16(this.sunCount)
    writer.writeByte(this.SeedBank?.selected ?? -1)

    writer.writeInt16(this.suns.length)
    this.suns.forEach(sun => {
      writer.writeInt32(sun.timer)
      writer.writeInt16(sun.count)
      writer.writeInt16(sun.x)
      writer.writeInt16(sun.y)
      writer.writeInt16(sun.minY)
    })

    writer.writeInt16(this.projectiles.length)
    this.projectiles.forEach(proj => {
      writer.writeInt16(proj.x)
      writer.writeInt16(proj.y)
    })

    writer.writeInt16(this.lawnmowers.length)
    this.lawnmowers.forEach(lm => {
      writer.writeInt16(lm.x)
      writer.writeInt16(lm.y)
      writer.writeByte(lm.r)
    })

    writer.writeInt16(this.zombies.length)
    this.zombies.map(zombie => {
      writer.writeInt16(zombie.x)
      writer.writeInt16(zombie.y)
      writer.writeByte(zombie.r)
      writer.writeInt16(zombie.health)
      writer.writeByte(zombie.zstate)
    })

    writer.writeInt16(this.slots.length)
    this.slots.map(slot => {
      writer.writeByte(slot.r)
      writer.writeByte(slot.c)

      if(slot.plant) {
        writer.writeByte(1)

        writer.writeInt32(slot.plant.timer)
        writer.writeByte(slot.plant.pstate)
        writer.writeByte(slot.plant.c)
        writer.writeByte(slot.plant.r)
        writer.writeInt16(slot.plant.health)
      } else {
        writer.writeByte(0)
      }
    })

    this.core.download('pvztslevel.dat', writer.finish())
    // this.loadLevelData(new BinaryReader(writer.finish()))
  }

  public loadLevelData(reader: BinaryReader): void {
    reader.readInt32()

    console.log(
      'sunCount: ' + reader.readInt16(),
      'packetSelected: ' + reader.readByte(),
      'suns: ' + Array(reader.readInt16()).fill(0).map(() => {
        return `
        timer: ${reader.readInt32()}
        count: ${reader.readInt16()}
        x: ${reader.readInt16()}
        y: ${reader.readInt16()}
        minY: ${reader.readInt16()}\n`
      }),
      'projectiles: ' + Array(reader.readInt16()).fill(0).map(() => {
        return `
        x: ${reader.readInt16()}
        y: ${reader.readInt16()}
        `
      }),
      'lawnmowers: ' + Array(reader.readInt16()).fill(0).map(() => {
        return `
        x: ${reader.readInt16()}
        y: ${reader.readInt16()}
        r: ${reader.readByte()}
        `
      }),
      'zombies: ' + Array(reader.readInt16()).fill(0).map(() => {
        return `
        x: ${reader.readInt16()}
        y: ${reader.readInt16()}
        r: ${reader.readByte()}
        health: ${reader.readInt16()}
        zstate: ${reader.readByte()}
        `
      }),
    )
  }
}