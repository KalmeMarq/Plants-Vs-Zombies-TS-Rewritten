import Core from '../..'
import DialogQuitButton from '../components/DialogQuitButton'
import MenuDialogScreen from './MenuDialogScreen'

export default class MainOptionsDialogScreen extends MenuDialogScreen {
  public constructor(core: Core) {
    super(core)

    const backBtn = this.menu.addChild(new DialogQuitButton(core, -180, 130, 'OK', () => {
      this.core.removeDialog(this)
    }))
  }
}
