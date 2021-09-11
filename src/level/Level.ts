import Core from '@/.'
import { isDev, MAX_SUN_COUNT } from '@/Constants'
import BinaryReader from '@/data/binary/BinaryReader'
import BinaryWriter from '@/data/binary/BinaryWriter'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import { Coin, GoldCoin, SilverCoin } from '@/level/Coin'
import Lawnmowers from '@/level/Lawnmowers'
import Projectile from '@/level/Projectile'
import SeedBank from '@/level/SeedBank'
import ShovelBank from '@/level/ShovelBank'
import Slot from '@/level/Slot'
import Sun from '@/level/Sun'
import Tombstone from '@/level/Tombstone'
import Zombie from '@/level/Zombies'
import Logger from '@/Logger'
import Sounds from '@/sound/Sounds'
import { BaseTexture, Texture } from '@pixi/core'
import { Container } from '@pixi/display'
import { Rectangle } from '@pixi/math'
import { Sprite } from '@pixi/sprite'
import { Text } from '@pixi/text'

export class SeedPacket extends Sprite {
  public index: number
  public seedBank: SeedBank
  public selected = false

  public constructor(index: number, seedBank: SeedBank, core: Core, sprite: Sprite, cost: number) {
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

    this.on('click', () => {
      if (this.selected) {
        this.deselect()
      } else {
        this.select()
      }
    })

    const t0 = this.addChild(new FontText(core.fontManager, Font.Pico129, cost.toString(), 0x000000))
    t0.setAnchor(1, 0)
    t0.setPos(this.width - 19, this.height - t0.height - 3)
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

export default class Level extends Container {
  public core: Core
  public sunCount = isDev ? 500 : 50
  public slots: Slot[] = []
  public zombies: Zombie[] = []
  public projectiles: Projectile[] = []
  public suns: Sun[] = []
  public lawnmowers: Lawnmowers[] = []
  public tombs: Tombstone[] = []
  public coins: Coin[] = []
  public shovelSelected = false
  public SeedBank: SeedBank | null = null
  public shovelBank: ShovelBank | null = null
  private lastSunTime = 0
  private lastZombieTime = 0

  public constructor(core: Core) {
    super()
    this.core = core

    this.on('addSun', (count) => {
      this.sunCount = Math.min(this.sunCount + count, MAX_SUN_COUNT)
      if (this.SeedBank) this.SeedBank.sunBank.text.setText(this.sunCount.toString())

      if (this.core.users.currentUser) {
        if (this.sunCount >= 8000 && this.core.users.currentUser.achievements.sunny_day === 0) {
          this.core.users.currentUser.achievements.sunny_day = 1
          this.emit('saveUser', this.core.users.currentUser)

          this.core.soundManager.playSound(Sounds.ACHIEVEMENT)
          const p = this.core.root.addChild(new Text('Achievement: Sunny day'))
          setTimeout(() => {
            p.parent.removeChild(this)
            p.destroy()
          }, 3000)
        }
      }
    })

    this.on('subSun', (count) => {
      this.sunCount -= count
      if (this.SeedBank) this.SeedBank.sunBank.text.setText(this.sunCount.toString())
    })

    const bg = this.addChild(Sprite.from('Background2'))
    bg.zIndex = -12
    bg.position.x = -220
    this.sortableChildren = true

    for (let i = 0; i < 45; i++) {
      const c = (i % 9)
      const r = Math.floor(i / 9)
      const x = c * 79 + 40
      const y = r * 94 + 100

      const slot = new Slot(this, x, y, r, c, null)
      this.slots.push(slot)

      this.addChild(slot)

      if (i % 9 === 0) {
        const l0 = new Lawnmowers(this, x - 30, y, r)
        this.lawnmowers.push(l0)
        this.addChild(l0)
      }

      // const graveG = new Graphics()
      // graveG.beginFill(0xff0000)
      // graveG.drawRect(0, 0, 40, 40)
      // graveG.endFill()
      // graveG.position.set(x, y)

      const a = Math.round(Math.random() * 10)
      if (a > 8 && c >= 7) {
        const t = this.addChild(new Tombstone(core, x, y, r, c))
        this.tombs.push(t)
        t.zIndex -= 10
      }
    }

    // this.core.soundManager.playSound(Sounds.GRASS_WALK, 0.1)

    this.SeedBank = this.addChild(new SeedBank(this))
    this.SeedBank.position.set(10, 0)
    // seedBankG.texture = Texture.from('SeedBank')
    this.shovelBank = new ShovelBank(this, this.SeedBank.x + this.SeedBank.width, 0)
    this.addChild(this.shovelBank)
  }

  public spawnCoin(x: number, y: number): void {
    const r = Math.random()
    if (r < 0.5) this.coins.push(this.addChild(new SilverCoin(this, x, y)))
    else this.coins.push(this.addChild(new GoldCoin(this, x, y)))
  }

  public update(dt: number): void {
    if (this.lastSunTime === 0) {
      this.lastSunTime = Date.now()
    }

    if (Date.now() - this.lastSunTime > 10000) {
      const sun0G = new Sun(this)
      this.suns.push(sun0G)
      this.addChild(sun0G)
      this.lastSunTime = Date.now()
    }

    for (let i = 0; i < this.lawnmowers.length; i++) {
      this.lawnmowers[i].update(dt)
    }

    for (let i = this.projectiles.length - 1; i >= 0; --i) {
      this.projectiles[i].update(dt)
    }

    for (let i = this.zombies.length - 1; i >= 0; --i) {
      this.zombies[i].update(dt)
    }

    for (let i = 0; i < this.tombs.length; i++) {
      this.tombs[i].tick(dt)
    }

    for (let i = 0; i < this.suns.length; i++) {
      this.suns[i].update(dt)
    }

    for (let i = 0; i < this.coins.length; i++) {
      this.coins[i].update(dt)
    }

    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].plant?.update(dt)
    }

    if (this.lastZombieTime === 0) {
      this.lastZombieTime = Date.now()
    }

    if (Date.now() - this.lastZombieTime > 12500) {
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
    const writer = new BinaryWriter()
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
    this.zombies.forEach(zombie => {
      writer.writeInt16(zombie.x)
      writer.writeInt16(zombie.y)
      writer.writeByte(zombie.r)
      writer.writeInt16(zombie.health)
      writer.writeByte(zombie.zstate)
    })

    writer.writeInt16(this.slots.length)
    this.slots.forEach(slot => {
      writer.writeByte(slot.r)
      writer.writeByte(slot.c)

      if (slot.plant) {
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

    Logger.info(
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
      })
    )
  }
}
