import { Application, Container, Text } from 'pixi.js'
import DebugOverlay from './DebugOverlay';
import Level from './Level';
export const MAX_SUN_COUNT = 9999

const debugTexts = new Container()

export default class Core {
  public running: boolean = true
  public showDebug: boolean = true
  public app: Application
  public level: Level | null = null
  public root: Container
  public debugOverlay: DebugOverlay

  public constructor() {
    this.app = new Application({
      width: 800,
      height: 600,
      resolution: devicePixelRatio
    })

    this.root = new Container()

    document.getElementById('root')?.appendChild(this.app.view)

    this.root.sortableChildren = true
    this.app.stage.addChild(this.root)

    this.debugOverlay = new DebugOverlay(this)
    this.root.addChild(this.debugOverlay)

    window.addEventListener('keyup', (e) => {
      if(e.key === 'Escape') {
        if(this.running) {
          this.running = false
          this.app.stop()
        } else {
          this.running = true
          this.app.start()
        }
      }
    
      if(e.code === 'F2') {
        e.preventDefault()
        if(this.showDebug) {
          this.showDebug = false
          debugTexts.visible = false
        } else {
          this.showDebug = true
          debugTexts.visible = true
        }
      }
    })

    this.level = new Level(this)

    this.app.ticker.add((dt) => {
      if(this.level) {
        this.level.update(dt)
        this.debugOverlay.update(dt)
      }
    })
  }
}

new Core()