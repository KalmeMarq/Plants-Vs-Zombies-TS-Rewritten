import { Graphics, Sprite, Texture } from "pixi.js";
import Core, { Font, FontText, Sounds } from "../..";
import CustomHitArea from "../../data/CustomHitArea";
import MiniGamesHitArea from "../../data/MinigamesHitArea";
import PuzzleHitArea from "../../data/PuzzleHitArea";
import StartAdventureHitArea from "../../data/StartAdventureHitArea";
import SurvivalHitArea from "../../data/SurvivalHitArea";
import AbstractButton from "../components/AbstractButton";
import SelectorButton from "../components/SelectorButton";
import AlmanacScreen from "./AlmanacScreen";
import GUIScreen from "./GUIScreen";
import HelpScreen from "./HelpScreen";

export default class MainMenuScreen extends GUIScreen {
  public constructor(core: Core) {
    super()

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

    const sBtn = this.addChild(new SelectorButton(core, 405, 65, () => {
      core.setScreen(null)
      core.addLevel()
    }, 'SelectorScreen_StartAdventure1', 'SelectorScreen_StartAdventure1Hightlight', 'SelectorScreen_StartAdventure1Shadow', new StartAdventureHitArea()))

    const mgBtn = this.addChild(new SelectorButton(core, 406.0, 173.1, () => {
      core.setScreen(null)
      core.addLevel()
    }, 'SelectorScreen_Minigames', 'SelectorScreen_MinigamesHighlight', 'SelectorScreen_MinigamesShadow', new MiniGamesHitArea()))
    mgBtn.setEnabled(false)

    const pzBtn = this.addChild(new SelectorButton(core,410.0, 257.5, () => {
      core.setScreen(null)
      core.addLevel()
    }, 'SelectorScreen_Puzzle', 'SelectorScreen_PuzzleHighlight', 'SelectorScreen_PuzzleShadow', new PuzzleHitArea()))
    pzBtn.setEnabled(false)

    const svBtn = this.addChild(new SelectorButton(core, 413.0, 328.0, () => {
      core.setScreen(null)
      core.addLevel()
    }, 'SelectorScreen_Survival', 'SelectorScreen_SurvivalHighlight', 'SelectorScreen_SurvivalShadow', new SurvivalHitArea()))
    svBtn.setEnabled(false)

    const alm = Sprite.from('SelectorScreenAlmanac')
    alm.position.set(331.9, 440.3)
    this.addChild(alm)
    alm.interactive = true
    alm.buttonMode = true
    alm.on('click', () => {
      core.setScreen(new AlmanacScreen(core))
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

    const p = this.addChild(Sprite.from('SelectorScreenWoodSign1'))
    const t = p.addChild(new FontText(core.fontManager, Font.BrianneTod16, 'User name', 0xFBF1C4))
    t.setAnchor(0.5, 0)
    t.setPos(p.width / 2, p.height - 58)

    class Button0 extends AbstractButton {
      private bg: Sprite

      public constructor(core: Core, x: number, y: number, onPress: () => void) {
        super(core, x, y, onPress)

        this.bg = this.addChild(Sprite.from('SelectorScreenHelp1'))
      }

      protected override onMouseOver(): void {
        super.onMouseOver()
        this.bg.texture = Texture.from('SelectorScreenHelp2')
      }
    
      protected override onMouseLeave(): void {
        this.bg.texture = Texture.from('SelectorScreenHelp1')
        this.bg.position.set(0, 0)
      }
    
      protected override onMouseDown(): void {
        super.onMouseDown()
        this.bg.texture = Texture.from('SelectorScreenHelp2')
        this.bg.position.set(1, 1)
      }
    
      protected override onMouseRelease(): void {
        this.bg.texture = Texture.from('SelectorScreenHelp1')
        this.bg.position.set(0, 0)
      }
    }

    this.addChild(new Button0(core, 647, 525, () => {
      core.setScreen(new HelpScreen(core))
    }))
  }

  public override tick(dt: number): void {

  }
}