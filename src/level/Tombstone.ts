import Core from '@/.'
import { Container } from '@pixi/display'
import { Sprite } from 'pixi.js'

export default class Tombstone extends Container {
  public r: number
  public c: number
  private txr: Sprite

  public constructor(core: Core, x: number, y: number, r: number, c: number) {
    super()

    this.x = x
    this.y = y
    this.r = r
    this.c = c

    // const mask = new Graphics()
    // mask.beginFill(0x000000, 0.0001)
    // mask.drawRect(0, 0, 86, 91)
    // mask.endFill()

    const info = core.tombsAtlas.getRandom()

    this.txr = this.addChild(new Sprite(info.txr))
    // this.txr.position.y = 20
    this.addChild(new Sprite(info.mound))

    // this.mask = mask
    // this.addChild(mask)
  }

  public tick(dt: number): void {
    // if (this.txr.position.y > 0) {
    //   this.txr.position.y -= dt * 0.1
    // } else {
    //   this.txr.position.y = 0
    // }
  }
}
