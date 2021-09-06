import { Application, Container, Graphics } from 'pixi.js'
import DebugOverlay from './DebugOverlay';
import Level from './Level';
import Options from './Options';
import Slider from './Slider';
import SoundManager from './sound/SoundManager';

export class Sounds {
  public static SUN_POINTS: Sounds = new Sounds('ui.sun_points')
  public static PEA_HIT: Sounds = new Sounds('plant.pea_splat')
  public static PLANT: Sounds = new Sounds('plant.plant')
  public static PAUSE: Sounds = new Sounds('ui.pause_game')

  private location: string
  private constructor(location: string) {
    this.location = location
  }

  public getLocation(): string {
    return this.location
  }
}

export default class Core {
  private static instance: Core
  public running: boolean = true
  public showDebug: boolean = true
  public app: Application
  public level: Level | null = null
  public _root: Container
  public root: Container
  public debugOverlay: DebugOverlay
  public options: Options
  public soundManager: SoundManager
  public screen: any

  public constructor() {
    Core.instance = this

    this.app = new Application({
      width: 800,
      height: 600,
      resolution: devicePixelRatio
    })

    this.options = new Options()
    this._root = new Container()
    this.root = new Container()
    this.soundManager = new SoundManager(this)

    this.app.renderer.plugins.interaction.cursorStyles.default = 'url("./static/cursor.png"), auto'
    this.app.renderer.plugins.interaction.cursorStyles.pointer = 'url("./static/cursor_pointer.png"), auto'
    this.app.renderer.plugins.interaction.cursorStyles.grab = 'url("./static/cursor_grab.png"), auto'

    document.getElementById('root')?.appendChild(this.app.view)

    this.root.sortableChildren = true
    this.root.interactiveChildren = this.running
    this._root.addChild(this.root)
    this.app.stage.addChild(this._root)

    this.debugOverlay = new DebugOverlay(this)
    this.root.addChild(this.debugOverlay)

    window.addEventListener('keyup', (e) => {
      if(e.key === 'Escape') {
        if(this.running) {
          this.running = false
          // this.app.stop()
          this.root.interactiveChildren = false
          this.soundManager.playSound(Sounds.PAUSE)
          this.screen = new OptionsScreen(this)
          this._root.addChild(this.screen)
          this.level?.saveLevelData()
        } else {
          this.running = true
          this.root.interactiveChildren = true
          // this.app.start()
          this._root.removeChild(this.screen)
          this.screen = null
        }
      }
    
      if(e.code === 'F2') {
        e.preventDefault()
        if(this.showDebug) {
          this.showDebug = false
          this.debugOverlay.visible = false
        } else {
          this.showDebug = true
          this.debugOverlay.visible = true
        }
      }
    })

    class OptionsScreen extends Graphics {
      public constructor(core: Core) {
        super()

        this.beginFill(0xff22ff)
        this.drawRect(400 - 200, 300 - 200, 400, 400)
        this.endFill()

        const masterSlider = new Slider(400 - 150, 200 - 80, () => {
          return core.options.sound_master
        }, (v) => {
            core.options.sound_master = v
        }, (v) => {
          return `Master: ${Math.round(v * 100)}%`
        })
        this.addChild(masterSlider)
    
        const musicSlider = new Slider(400 - 150, 200 - 40, () => {
          return core.options.sound_music
        }, (v) => {
            core.options.sound_music = v
        }, (v) => {
          return `Music: ${Math.round(v * 100)}%`
        })
        this.addChild(musicSlider)

        const plantsSlider = new Slider(400 - 150, 200, () => {
          return core.options.sound_plants
        }, (v) => {
            core.options.sound_plants = v
        }, (v) => {
          return `Plants: ${Math.round(v * 100)}%`
        })
        this.addChild(plantsSlider)

        const zombiesSlider = new Slider(400 - 150, 200 + 40, () => {
          return core.options.sound_zombies
        }, (v) => {
            core.options.sound_zombies = v
        }, (v) => {
          return `Zombies: ${Math.round(v * 100)}%`
        })
        this.addChild(zombiesSlider)

        const crazy_daveSlider = new Slider(400 - 150, 200 + 80, () => {
          return core.options.sound_crazy_dave
        }, (v) => {
            core.options.sound_crazy_dave = v
        }, (v) => {
          return `Crazy Dave: ${Math.round(v * 100)}%`
        })
        this.addChild(crazy_daveSlider)

        const btn = new Graphics()
        btn.position.set(400 - 100, 200 + 150)
        btn.beginFill(0x333333)
        btn.drawRect(0, 0, 200, 40)
        btn.endFill()
        this.addChild(btn)

        btn.interactive = true
        btn.buttonMode = true

        btn.on('click', () => {
          this.parent.removeChild(this)
          const core = Core.getInstance()
          core.running = true
          core.root.interactiveChildren = true
          this.destroy(true)
          core.screen = null
        })
      }
    }
  }

  public async init(): Promise<void> {
    await this.soundManager.load()
    this.level = new Level(this)

    this.app.ticker.add((dt) => {
      if(this.level && this.running) {
        this.level.update(dt)
        this.debugOverlay.update(dt)
      }
    })
  }

  public static getInstance(): Core {
    return Core.instance
  }
}

const coreApp = new Core()
coreApp.init()