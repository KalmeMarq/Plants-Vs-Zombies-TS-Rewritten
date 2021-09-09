import Core from '@/.'
import { BaseTexture, Texture } from '@pixi/core'
import { Rectangle } from '@pixi/math'
import { Sprite } from '@pixi/sprite'

export default class TombstoneAtlas {
  private core: Core
  private tombs: Texture[]
  private tombsMounds: Texture[]

  public constructor(core: Core) {
    this.core = core
    this.tombs = []
    this.tombsMounds = []
  }

  public async load(): Promise<void> {
    const h = Sprite.from('Tombstones')
    const m = BaseTexture.from('Tombstone_mounds')
    const hj = Sprite.from('TombstonesMask')
    h.addChild(hj)
    h.mask = hj
    const bt = this.core.app.renderer.generateTexture(h).baseTexture

    for (let i = 0; i < 20; i++) {
      const c = (i % 5)
      const r = Math.floor(i / 5)

      this.tombs.push(new Texture(bt, new Rectangle(86 * c, 91 * r, 86, 91)))
      this.tombsMounds.push(new Texture(m, new Rectangle(86 * c, 91 * r, 86, 91)))
    }
  }

  public getRandom(): { txr: Texture, mound: Texture } {
    const i = Math.round(Math.random() * this.tombs.length)
    return {
      txr: this.tombs[i],
      mound: this.tombsMounds[i]
    }
  }
}
