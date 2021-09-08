import { Sprite } from "pixi.js"
import Core, { Font, FontText } from "../.."
import GUIScreen from "./GUIScreen"
import MainMenuScreen from "./MainMenuScreen"

export default class TitleScreen extends GUIScreen {
  private core: Core

  public constructor(core: Core) {
    super()

    this.core = core
    this.addChild(Sprite.from('TitleScreenBg'))

    const logo = this.addChild(Sprite.from('PvZLogo'))
    const logoM = logo.addChild(Sprite.from('PvZLogoMask'))
    logo.mask = logoM
    logo.x = 400
    logo.y = 10
    logo.anchor.set(0.5, 0)
    logoM.anchor.set(0.5, 0)

    this.loadResources().then(() => {
      core.setScreen(new MainMenuScreen(core))
    })
  }

  private async loadResources(): Promise<void> {
    const res = await (await fetch('static/resources.json')).json()

    await new Promise<void>((resolve, reject) => {
      this.core.loader.add(Object.entries(res).map((r: any) => {
        return {
          name: r[0],
          url: r[1]
        }
      })).load(() => {
        resolve()
      })
    })

    await this.core.soundManager.load()
  }
}