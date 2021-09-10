import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import LawnText from '@/font/LawnText'
import Sounds from '@/sound/Sounds'
import { Container, filters, Sprite, Texture, TilingSprite } from 'pixi.js'

const h = new filters.ColorMatrixFilter()
h.brightness(1.3, true)

export default class FitWidthButton extends Container {
  public constructor(x: number, y: number, width: number, text: string | LawnText, onPress: () => void) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = 46

    const leftB = Sprite.from('ButtonLeft')
    const rightB = Sprite.from('ButtonRight')
    const midB = TilingSprite.from('ButtonMiddle', {
      width: width - leftB.width - rightB.width,
      height: leftB.height
    })
    midB.position.x = leftB.width
    rightB.position.x = leftB.width + midB.width

    this.addChild(leftB)
    this.addChild(midB)
    this.addChild(rightB)

    const core = Core.getInstance()

    this.interactive = true
    this.buttonMode = true

    const txt = this.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft18BrightGreenInset, text, 0x00C400))
    txt.setAnchor(1, 0)
    txt.setPos(this.width / 2, 7)

    this.on('pointerdown', (e) => {
      e.stopPropagation()
      leftB.texture = Texture.from('ButtonDownLeft')
      midB.texture = Texture.from('ButtonDownMiddle')
      rightB.texture = Texture.from('ButtonDownRight')
      core.soundManager.playSound(Sounds.GRAVEBUTTON)
      txt.setAnchor(0.5, 0)
      txt.setPos(this.width / 2 + 1, 8)
    })

    this.on('pointerover', () => {
      txt.filters = [h]
    })

    this.on('pointerout', () => {
      txt.filters = []
    })

    const onPointerUp = (e: Event) => {
      e.stopPropagation()
      leftB.texture = Texture.from('ButtonLeft')
      midB.texture = Texture.from('ButtonMiddle')
      rightB.texture = Texture.from('ButtonRight')
      txt.setAnchor(0.5, 0)
      txt.setPos(this.width / 2, 7)
    }

    this.on('pointerup', onPointerUp)
    this.on('pointerupoutside', onPointerUp)

    // const t = new Text(text, {
    //   fill: 0x00ff00,
    //   fontSize: 22
    // })
    // t.position.x = this.width / 2
    // t.position.y = 8
    // t.anchor.set(0.5, 0)

    this.on('click', () => {
      core.soundManager.playSound(Sounds.GRAVEBUTTON)
      onPress()
    })
  }
}
