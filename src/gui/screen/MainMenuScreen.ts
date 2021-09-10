import { Graphics, Sprite, Texture } from 'pixi.js'
import Core from '../..'
import MiniGamesHitArea from '../../data/MinigamesHitArea'
import PuzzleHitArea from '../../data/PuzzleHitArea'
import StartAdventureHitArea from '../../data/StartAdventureHitArea'
import SurvivalHitArea from '../../data/SurvivalHitArea'
import Font from '../../font/Font'
import FontText from '../../font/FontText'
import Sounds from '../../sound/Sounds'
import MainPotButton from '../components/MainPotButton'
import SelectorButton from '../components/SelectorButton'
import SelectorSignButton from '../components/SelectorSignButton'
import AlmanacScreen from './AlmanacScreen'
import GUIScreen from './GUIScreen'
import HelpScreen from './HelpScreen'
import LockedDialogScreen from './LockedDialogScreen'
import MainOptionsDialogScreen from './OptionsScreen'
import QuitDialogScreen from './QuitDialogScreen'
import WhoAreYouDialogScreen, { NewUserDialog } from './WhoAreYouDialogScreen'
import ZombatarLADialogScreen from './ZombatarLADialogScreen'

export default class MainMenuScreen extends GUIScreen {
  private core: Core
  public constructor(core: Core) {
    super()
    this.core = core

    this.setupBackground()

    const sBtn = this.addChild(new SelectorButton(core, 405, 65, () => {
      core.setScreen(null)
      core.addLevel()
    }, 'SelectorScreen_StartAdventure1', 'SelectorScreen_StartAdventure1Hightlight', 'SelectorScreen_StartAdventure1Shadow', new StartAdventureHitArea()))

    const mgBtn = this.addChild(new SelectorButton(core, 406.0, 173.1, () => {
      core.addDialog(new LockedDialogScreen(core, 'Mini-games'))
    }, 'SelectorScreen_Minigames', 'SelectorScreen_MinigamesHighlight', 'SelectorScreen_MinigamesShadow', new MiniGamesHitArea()))
    mgBtn.setEnabled(false)

    const pzBtn = this.addChild(new SelectorButton(core, 410.0, 257.5, () => {
      core.addDialog(new LockedDialogScreen(core, 'Puzzles'))
    }, 'SelectorScreen_Puzzle', 'SelectorScreen_PuzzleHighlight', 'SelectorScreen_PuzzleShadow', new PuzzleHitArea()))
    pzBtn.setEnabled(false)

    const svBtn = this.addChild(new SelectorButton(core, 413.0, 328.0, () => {
      core.addDialog(new LockedDialogScreen(core, 'Survival'))
    }, 'SelectorScreen_Survival', 'SelectorScreen_SurvivalHighlight', 'SelectorScreen_SurvivalShadow', new SurvivalHitArea()))
    svBtn.setEnabled(false)

    const alm = Sprite.from('SelectorScreenAlmanac')
    alm.position.set(331.9, 440.3)
    this.addChild(alm)
    alm.interactive = true
    alm.buttonMode = true
    alm.on('click', () => {
      core.setScreen(new AlmanacScreen(core, () => {
        core.setScreen(new MainMenuScreen(core))
      }))
      core.soundManager.playSound(Sounds.BLEEP)
    })

    alm.on('pointerover', () => {
      alm.texture = Texture.from('SelectorScreenAlmanacHighlight')
      core.soundManager.playSound(Sounds.BLEEP)
    })

    alm.on('pointerout', () => {
      alm.texture = Texture.from('SelectorScreenAlmanac')
      alm.position.set(331.9, 440.3)
    })

    alm.on('pointerdown', () => {
      alm.position.set(332.9, 441.3)
      core.soundManager.playSound(Sounds.TAP)
    })

    alm.on('pointerup', () => {
      alm.position.set(331.9, 440.3)
    })

    alm.on('pointerupoutside', () => {
      alm.position.set(331.9, 440.3)
    })

    this.setupSigns()

    this.addChild(new MainPotButton(core, 565, 492, 'SelectorScreenOptions1', 'SelectorScreenOptions2', () => {
      this.core.addDialog(new MainOptionsDialogScreen(this.core))
    }))

    this.addChild(new MainPotButton(core, 647, 527, 'SelectorScreenHelp1', 'SelectorScreenHelp2', () => {
      core.setScreen(new HelpScreen(core))
    }))

    this.addChild(new MainPotButton(core, 720, 515, 'SelectorScreenQuit1', 'SelectorScreenQuit2', () => {
      this.core.addDialog(new QuitDialogScreen(core))
    }))
  }

  private setupBackground(): void {
    const sky = new Graphics()
    sky.beginFill(0x0458C0)
    sky.drawRect(0, 0, 800, 600)
    sky.endFill()
    this.addChild(sky)

    const mb2 = this.addChild(Sprite.from('SelectorScreenBg'))
    mb2.scale.set(8, 8)

    const mb1 = this.addChild(Sprite.from('SelectorScreenBGCenter'))
    const mbmk1 = mb1.addChild(Sprite.from('SelectorScreenBGCenterMask'))
    mb1.mask = mbmk1
    mb1.position.x = 80.0
    mb1.position.y = 250

    const mb0 = this.addChild(Sprite.from('SelectorScreenBGLeft'))
    const mbmk0 = mb0.addChild(Sprite.from('SelectorScreenBGLeftMask'))
    mb0.mask = mbmk0
    mb0.position.y = -79.8

    const mb = this.addChild(Sprite.from('SelectorScreenBGRight'))
    const mbmk = mb.addChild(Sprite.from('SelectorScreenBGRightMask'))
    mb.mask = mbmk

    mb.position.x = /* 800 - mb.width */71.0
    mb.position.y = /* 600 - mb.height */41.0
  }

  public setupSigns(): void {
    if (this.core.users.currentUser) {
      const p = this.addChild(Sprite.from('SelectorScreenWoodSign1'))
      const t = p.addChild(new FontText(this.core.fontManager, Font.BrianneTod16, (this.core.users.currentUser?.name ?? '') + '!', 0xFBF1C4))
      t.setAnchor(0.5, 0)
      t.setPos(p.width / 2, p.height - 58)
      p.position.set(30, -10)

      this.core.on('userChanged', (id, user) => {
        t.setText(user.name + '!')
      })

      this.addChild(new SelectorSignButton(this.core, 30, p.height - 19, 'SelectorScreenWoodSign2', 'SelectorScreenWoodSign2Pressed', () => {
        this.core.addDialog(new WhoAreYouDialogScreen(this.core))
      }))

      this.addChild(new SelectorSignButton(this.core, 30, p.height - 19 + 55, 'SelectorScreenWoodSign3', 'SelectorScreenWoodSign3Pressed', () => {
        if (!this.core.users.currentUser?.agreedZombatarTOS) this.core.addDialog(new ZombatarLADialogScreen(this.core))
      }))
    } else {
      this.core.addDialog(new NewUserDialog(this.core, this))
    }
  }
}
