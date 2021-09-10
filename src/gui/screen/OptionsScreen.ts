import LawnText from '@/font/LawnText'
import Checkbox from '@/gui/components/Checkbox'
import Core from '../..'
import DialogQuitButton from '../components/DialogQuitButton'
import MenuDialogScreen from './MenuDialogScreen'

export default class MainOptionsDialogScreen extends MenuDialogScreen {
  public constructor(core: Core) {
    super(core)

    const fsCheck = this.menu.addChild(new Checkbox(core.isFullscreen()))
    fsCheck.position.set(80, 20)

    fsCheck.on('checked', (checked) => {
      if (checked) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })

    this.menu.addChild(new DialogQuitButton(core, -180, 130, new LawnText('DIALOG_BUTTON_OK'), () => {
      this.core.removeDialog(this)
    }))
  }
}
