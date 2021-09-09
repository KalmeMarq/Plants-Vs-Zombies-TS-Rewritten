import { Graphics } from '@pixi/graphics'
import { Sprite } from '@pixi/sprite'
import Core from '../..'
import GUIScreen from './GUIScreen'
import TitleScreen from './TitleScreen'

export default class SplashScreen extends GUIScreen {
  private core: Core
  private lastTime = 0
  private logo: Sprite
  public constructor(core: Core) {
    super()

    this.core = core
    this.addChild(new Graphics().beginFill(0x000000).drawRect(0, 0, 800, 600).endFill())

    this.logo = this.addChild(Sprite.from('PopCapLogo'))
    this.logo.position.set(400, 300)
    this.logo.anchor.set(0.5, 0.5)
  }

  public override tick(dt: number): void {
    if (this.lastTime === 0) {
      this.lastTime = Date.now()
    }

    if (this.logo.alpha <= 0) {
      this.core.setScreen(new TitleScreen(this.core))
      return
    }

    if (Date.now() - this.lastTime > 1300) {
      this.logo.alpha -= dt * 0.05
    }
  }
}
