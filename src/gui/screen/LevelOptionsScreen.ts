import Core from '@/.'
import DialogQuitButton from '@/gui/components/DialogQuitButton'
import FitWidthButton from '@/gui/components/FitWidthButton'
import AlmanacScreen from '@/gui/screen/AlmanacScreen'
import MainMenuScreen from '@/gui/screen/MainMenuScreen'
import MenuDialogScreen from '@/gui/screen/MenuDialogScreen'

export default class LevelOptionsDialogScreen extends MenuDialogScreen {
  public constructor(core: Core) {
    super(core)
    this.core.running = false

    this.menu.addChild(new FitWidthButton(-100, 24, 200, 'View Almanac', () => {
      core.removeDialog(this)
      this.core.setScreen(new AlmanacScreen(this.core, () => {
        core.setScreen(null)
        core.addDialog(this)
      }))
    }))

    this.menu.addChild(new FitWidthButton(-100, 70, 200, 'Main Menu', () => {
      this.core.removeDialog(this)
      this.core.running = true
      this.core.level?.parent.removeChild(this.core.level)
      this.core.level = null
      this.core.setScreen(new MainMenuScreen(this.core))
    }))

    const backBtn = this.menu.addChild(new DialogQuitButton(core, -180, 130, 'BACK TO GAME', () => {
      this.core.removeDialog(this)
      this.core.running = true
    }))

    backBtn.msg.scale.set(0.9, 0.9)
    backBtn.msg.setPos(backBtn.width - 32, backBtn.height / 2 - 3 + 24)
  }

  public tick(): void {

  }
}
