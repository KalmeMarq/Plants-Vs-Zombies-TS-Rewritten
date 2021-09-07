import { Sprite } from "pixi.js"
import GUIScreen from "./GUIScreen"

export default class TitleScreen extends GUIScreen {
  public constructor() {
    super()

    this.addChild(Sprite.from('TitleScreenBg'))

    const logo = this.addChild(Sprite.from('PvZLogo'))
    const logoM = logo.addChild(Sprite.from('PvZLogoMask'))
    logo.mask = logoM
    logo.x = 400
    logo.y = 10
    logo.anchor.set(0.5, 0)
    logoM.anchor.set(0.5, 0)
  }
}