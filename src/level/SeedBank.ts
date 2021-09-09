import Level, { SeedPacket } from '@/level/Level'
import SunBank from '@/level/SunBank'
import { Sprite, Texture } from 'pixi.js'

export default class SeedBank extends Sprite {
  public selected = -1
  public sunBank: SunBank
  public packets: SeedPacket[] = []

  public constructor(level: Level) {
    super()

    this.texture = Texture.from('SeedBank')

    this.sunBank = new SunBank(level, 0, 0)
    this.sunBank.text.setText(level.sunCount.toString())
    this.addChild(this.sunBank)

    const s = this.addChild(new SeedPacket(0, this, level.core, Sprite.from('PeaShooter'), 100))
    s.position.set(80, 8)

    const s1 = this.addChild(new SeedPacket(1, this, level.core, Sprite.from('SnowPea'), 175))
    s1.position.set(80 + 60, 8)

    const s3 = this.addChild(new SeedPacket(3, this, level.core, Sprite.from('Sunflower'), 50))
    s3.position.set(80 + 60 + 60 + 60, 8)

    const s2 = this.addChild(new SeedPacket(2, this, level.core, Sprite.from('WallnutBody'), 50))
    s2.position.set(80 + 60 + 60, 8)

    const s4 = this.addChild(new SeedPacket(4, this, level.core, Sprite.from('LilyPad_body'), 25))
    s4.position.set(80 + 60 + 60 + 60 + 60, 8)

    const s5 = this.addChild(new SeedPacket(5, this, level.core, Sprite.from('GraveBuster'), 75))
    s5.position.set(80 + 60 + 60 + 60 + 60 + 60, 8)

    this.packets = [s, s1, s2, s3]

    this.on('selected', (idx) => {
      if (this.selected !== -1) {
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
