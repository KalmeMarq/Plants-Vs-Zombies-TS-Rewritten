import Font from '@/font/Font'
import FontText from '@/font/FontText'
import { Graphics } from '@pixi/graphics'
import Core from '../..'
import FitWidthButton from '../components/FitWidthButton'
import DialogScreen from './DialogScreen'

class NewUserDialog extends DialogScreen {
  public constructor(core: Core) {
    super(core, 506, 306, 'normal')

    this.back.addChild(new FitWidthButton(31, 225, 210, 'Ok', () => {
      core.removeDialog(this)
    }))

    this.back.addChild(new FitWidthButton(250, 225, 210, 'Cancel', () => {
      core.removeDialog(this)
    }))
  }
}

export default class WhoAreYouDialogScreen extends DialogScreen {
  public constructor(core: Core) {
    super(core, 600, 506, 'big')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'WHO ARE YOU?', 0xDFBA61))
    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    title.setPos(300, 56 + 28)

    const list = this.back.addChild(new Graphics())
    list.lineStyle({
      width: 1,
      color: 0x000000
    })
    list.beginFill(0x161722)
    list.drawRect(0, 0, 457, 200)
    list.endFill()
    list.position.set(64, 132)

    class ListItem extends Graphics {
      public constructor(text: string, action: () => void, useHover = true) {
        super()

        //  0x13B30E
        this.beginFill(0xffffff, 0.0001)
        this.drawRect(0, 0, 455, 24)
        this.endFill()

        this.interactive = true
        this.buttonMode = true

        const txt = this.addChild(new FontText(core.fontManager, Font.BrianneTod16, text, 0xEAE0B3))
        txt.setAnchor(0.5, 0.5)
        txt.setPos(455 / 2, 24 / 2)

        this.on('pointerdown', (e) => {
          e.stopPropagation()
          action()
        })

        this.on('pointerover', () => {
          // this.addChildAt(hoverG, 0)
          txt.setColor(0xffffff)
          if (useHover) {
            this.clear()
            this.beginFill(0x13B30E, 1)
            this.drawRect(0, 0, 455, 24)
            this.endFill()
          }
        })

        this.on('pointerout', () => {
          // this.removeChild(hoverG)
          txt.setColor(0xEAE0B3)
          if (useHover) {
            this.clear()
            this.beginFill(0xffffff, 0.0001)
            this.drawRect(0, 0, 455, 24)
            this.endFill()
          }
        })
      }
    }

    const b = list.addChild(new ListItem('KalmeMarq', () => {
    }))
    b.position.y = 5

    const c = list.addChild(new ListItem('(Create a New User)', () => {
      core.addDialog(new NewUserDialog(core))
    }, false))
    c.position.y = 29

    this.back.addChild(new FitWidthButton(30, 384, 254, 'Rename', () => {
    }))

    this.back.addChild(new FitWidthButton(300, 384, 254, 'Delete', () => {
    }))

    this.back.addChild(new FitWidthButton(30, 430, 254, 'Ok', () => {
      core.removeDialog(this)
    }))

    this.back.addChild(new FitWidthButton(300, 430, 254, 'Cancel', () => {
      core.removeDialog(this)
    }))
  }
}
