import { Graphics } from '@pixi/graphics'
import { Sprite } from '@pixi/sprite'
import Core from '../..'
import Sounds from '../../sound/Sounds'
import SeedChooserButton from '../components/SeedChooserButton'
import GUIScreen from './GUIScreen'
import MainMenuScreen from './MainMenuScreen'

export default class HelpScreen extends GUIScreen {
  private overlay: Graphics | undefined

  public constructor(core: Core) {
    super()

    const bg = this.addChild(Sprite.from('Background1'))
    bg.scale.set(2, 2)
    bg.position.set(-348 * 2, -150 * 2)

    const zn = this.addChild(Sprite.from('ZombieNote'))
    const znm = zn.addChild(Sprite.from('ZombieNoteMask'))
    zn.mask = znm

    const znhm = zn.addChild(Sprite.from('ZombieNoteHelpMask'))
    const znh = znhm.addChild(Sprite.from('ZombieNoteHelp'))
    znhm.mask = znh

    znhm.position.set(45, 45)
    zn.position.set(400 - zn.width / 2, 80)

    this.addChild(new SeedChooserButton(core, 328, 518, 'Main Menu', () => {
      core.setScreen(new MainMenuScreen(core))
    }))

    core.soundManager.playSound(Sounds.PAPER)

    this.overlay = this.addChild(new Graphics().beginFill(0x000000).drawRect(0, 0, 800, 600).endFill())
  }

  public tick(dt: number): void {
    if (this.overlay) {
      if (this.overlay?.alpha <= 0) {
        this.overlay.parent.removeChild(this.overlay)
        this.overlay.destroy()
        this.overlay = undefined
      } else {
        this.overlay.alpha -= dt * 0.02
      }
    }
  }
}
