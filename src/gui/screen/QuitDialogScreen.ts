import Font from '@/font/Font'
import FontText from '@/font/FontText'
import Core from '../..'
import FitWidthButton from '../components/FitWidthButton'
import DialogScreen from './DialogScreen'

export default class QuitDialogScreen extends DialogScreen {
  public constructor(core: Core) {
    super(core, 408, 306, 'normal')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'Quit', 0xDFBA61))
    const line1 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'Are you sure you wish to', 0xDFBA61))
    const line2 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'quit the game?', 0xDFBA61))

    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    line1.setAnchor(0.5, 0)
    line2.setAnchor(0.5, 0)
    title.setPos(204, 56 + 25)
    line1.setPos(204, 56 + 70)
    line2.setPos(204, 82 + 70)

    this.back.addChild(new FitWidthButton(31, 225, 160, 'Quit', () => {
      core.app.destroy(true)
    }))

    this.back.addChild(new FitWidthButton(200, 225, 160, 'Cancel', () => {
      core.removeDialog(this)
    }))
  }
}
