import Font from '@/font/Font'
import FontText from '@/font/FontText'
import Core from '../..'
import FitWidthButton from '../components/FitWidthButton'
import DialogScreen from './DialogScreen'

export default class LockedDialogScreen extends DialogScreen {
  private nameType: string
  public constructor(core: Core, name: string) {
    super(core, 412, 306, 'normal')

    this.nameType = name

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'Locked!', 0xDFBA61))
    const line1 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'Play more Adventure to', 0xDFBA61))
    const line2 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'unlock the ' + this.nameType + '.', 0xDFBA61))

    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    line1.setAnchor(0.5, 0)
    line2.setAnchor(0.5, 0)
    title.setPos(206, 56 + 25)
    line1.setPos(206, 56 + 70)
    line2.setPos(206, 82 + 70)

    this.back.addChild(new FitWidthButton(50, 220, 302, 'Ok', () => {
      core.removeDialog(this)
    }))
  }
}
