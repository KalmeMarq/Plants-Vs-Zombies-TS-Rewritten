import { Sprite } from '@pixi/sprite'
import Core from '../..'
import GUIScreen from './GUIScreen'

export default class MenuDialogScreen extends GUIScreen {
  protected core: Core
  /* eslint-disable */
  private dragData: any
  private dragging = false
  protected menu: Sprite

  public constructor(core: Core) {
    super()
    this.core = core

    this.menu = this.addChild(Sprite.from('OptionsMenuBack'))
    const mbmk = this.menu.addChild(Sprite.from('OptionsMenuBackMask'))
    this.menu.mask = mbmk
    this.menu.anchor.set(0.5, 0.5)
    mbmk.anchor.set(0.5, 0.5)

    this.menu.position.set(400, 300)

    this.menu.interactive = true
    // this.menu.buttonMode = true

    const onDragStart = (e: any) => {
      this.dragData = e.data
      this.dragging = true

      this.menu.cursor = 'url("./static/images/cursor_grab.png"), auto'
    }

    const onDragEnd = () => {
      this.dragData = null
      this.dragging = false

      this.menu.cursor = 'url("./static/images/cursor.png"), auto'
    }

    const onDragMove = () => {
      if (this.dragging) {
        const newpos = this.dragData.getLocalPosition(this.menu.parent)
        this.menu.x = Math.min(Math.max(this.menu.width / 2, newpos.x), 800 - this.menu.width / 2)
        this.menu.y = Math.min(Math.max(this.menu.height / 2, newpos.y), 600 - this.menu.height / 2)
      }
    }

    this.menu
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupside', onDragEnd)
      .on('pointermove', onDragMove)
  }
}
