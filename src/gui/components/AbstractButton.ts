import { Container } from "pixi.js";
import Core, { Sounds } from "../..";

export default abstract class AbstractButton extends Container {
  protected core: Core

  public constructor(core: Core, x: number, y: number, onPress: () => void) {
    super()

    this.core = core
    this.x = x
    this.y = y

    this.interactive = true
    this.buttonMode = true

    this.on('click', () => {
      onPress()
    })

    this.on('pointerover', this.onMouseOver)
    this.on('pointerout', this.onMouseLeave)
    this.on('pointerdown', this.onMouseDown)
    this.on('pointerup', this.onMouseRelease)
    this.on('pointerupoutside', this.onMouseRelease)
  }

  protected onMouseOver(): void {
    this.core.soundManager.playSound(Sounds.BLEEP)
  }

  protected onMouseLeave(): void {
  }

  protected onMouseDown(): void {
    this.core.soundManager.playSound(Sounds.TAP)
  }

  protected onMouseRelease(): void {
  }
}