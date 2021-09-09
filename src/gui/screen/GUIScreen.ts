import { Container } from 'pixi.js'

interface ITickable {
  tick(dt: number): void
}

abstract class GUIScreen extends Container implements ITickable {
  public tick(dt: number): void {
  }
}

export default GUIScreen
