import { Graphics, Sprite, Texture } from "pixi.js";
import Core, { Sounds } from "../..";
import AbstractButton from "../components/AbstractButton";
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

    class SelectorButton extends AbstractButton {
      private bg: Sprite

      public constructor(core: Core, x: number, y: number, onPress: () => void) {
        super(core, x, y, onPress)

        this.addChild(Sprite.from('SelectorScreen_StartAdventure1Shadow')).position.set(-3, 3)     
        this.bg = this.addChild(Sprite.from('SelectorScreen_StartAdventure1'))   
      }

      protected override onMouseOver(): void {
        super.onMouseOver()
        this.bg.texture = Texture.from('SelectorScreen_StartAdventure1Hightlight')
      }
    
      protected override onMouseLeave(): void {
        this.bg.position.set(0, 0)
        this.bg.texture = Texture.from('SelectorScreen_StartAdventure1')
      }
    
      protected override onMouseDown(): void {
        super.onMouseDown()
        this.bg.position.set(1, 1)
        this.bg.texture = Texture.from('SelectorScreen_StartAdventure1Hightlight')
      }
    
      protected override onMouseRelease(): void {
        this.bg.position.set(0, 0)
        this.bg.texture = Texture.from('SelectorScreen_StartAdventure1')
      }
    }

    this.addChild(new SelectorButton(core, 405, 65, () => {
      core.setScreen(null)
      core.addLevel()
    }))

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

    this.addChild(Sprite.from('SelectorScreenWoodSign1'))

    const ms = this.addChild(Sprite.from('SelectorScreenHelp1'))
    ms.position.set(641, 518)
    ms.interactive = true
    ms.buttonMode = true
    ms.on('click', () => {
      core.setScreen(new HelpScreen(core))
    })
  }

  public override tick(dt: number): void {

  }
}