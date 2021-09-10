import { Graphics } from '@pixi/graphics'
import { Sprite } from '@pixi/sprite'
import { TilingSprite } from '@pixi/sprite-tiling'
import Core from '../..'
import GUIScreen from './GUIScreen'

export default abstract class DialogScreen extends GUIScreen {
  public core: Core
  /*eslint-disable */
  private dragData: any
  private dragging = false
  protected back: Graphics

  public constructor(core: Core, width: number, height: number, type: 'normal' | 'big') {
    super()
    this.core = core

    // this.width = width
    // this.height = height

    this.back = this.addChild(new Graphics().beginFill(0x000000, 0.0001).drawRect(0, 0, width, height).endFill())

    this.back.x = 400 - width / 2
    this.back.y = 300 - height / 2

    this.back.interactive = true
    /*eslint-disable */
    const onDragStart = (e: any) => {
      this.dragData = e.data
      this.dragging = true

      this.back.cursor = 'url("./static/images/cursor_grab.png"), auto'
    }

    const onDragEnd = () => {
      this.dragData = null
      this.dragging = false

      this.back.cursor = 'url("./static/images/cursor.png"), auto'
    }

    const onDragMove = () => {
      if (this.dragging) {
        const newpos = this.dragData.getLocalPosition(this.back.parent)
        this.back.x = Math.min(Math.max(this.back.width / 2, newpos.x), 800 - this.back.width / 2) - width / 2
        this.back.y = Math.min(Math.max(this.back.height / 2, newpos.y), 600 - this.back.height / 2) - height / 2
      }
    }

    this.back
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupside', onDragEnd)
      .on('pointermove', onDragMove)

    const oxfh = 44

    const h = this.back.addChild(Sprite.from('DialogHeader'))
    h.anchor.set(0.5, 0)
    h.x = width / 2
    h.zIndex = 10

    const ctl = this.back.addChild(Sprite.from('DialogTopLeft'))
    ctl.y = oxfh

    const ctr = this.back.addChild(Sprite.from('DialogTopRight'))
    ctr.anchor.set(1, 0)
    ctr.x = width
    ctr.y = oxfh

    const tm = this.back.addChild(TilingSprite.from('DialogTopMiddle', {
      width: width - ctl.width - ctr.width,
      height: 97
    }))
    tm.x = ctl.width
    tm.y = oxfh

    const cbl = this.back.addChild(Sprite.from(`Dialog${type === 'big' ? 'Big' : ''}BottomLeft`))
    cbl.anchor.set(0, 1)
    cbl.y = height - 2

    const cbr = this.back.addChild(Sprite.from(`Dialog${type === 'big' ? 'Big' : ''}BottomRight`))
    cbr.anchor.set(1, 1)
    cbr.y = height
    cbr.x = width

    const bm = this.back.addChild(TilingSprite.from(`Dialog${type === 'big' ? 'Big' : ''}BottomMiddle`, {
      width: width - cbl.width - cbr.width,
      height: type === 'big' ? 150 : 114
    }))
    bm.anchor.set(0, 1)
    bm.x = cbl.width
    bm.y = height

    const cl = this.back.addChild(TilingSprite.from('DialogCenterLeft', {
      width: 107,
      height: height - ctl.height - cbl.height - oxfh
    }))
    cl.y = oxfh + ctl.height

    const cr = this.back.addChild(TilingSprite.from('DialogCenterRight', {
      width: 117,
      height: height - ctr.height - cbr.height - oxfh
    }))
    cr.anchor.set(1, 0)
    cr.x = width - 2
    cr.y = oxfh + ctr.height

    const cm = this.back.addChild(TilingSprite.from('DialogCenterMiddle', {
      width: width - cl.width - cr.width,
      height: height - tm.height - bm.height - oxfh
    }))
    cm.y = oxfh + tm.height
    cm.x = cl.width

    this.back.sortChildren()
  }
}
