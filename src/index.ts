import { Application, Container, Graphics, Loader, Sprite, Texture, Text } from 'pixi.js'
import DebugOverlay from './DebugOverlay';
import Level from './Level';
import Options from './Options';
import Slider from './Slider';
import SoundManager from './sound/SoundManager';

export let plantsel = 0
window.addEventListener('keyup', (e) => {
  if(e.key === '1') {
    plantsel = 0
  }

  if(e.key === '2') {
    plantsel = 1
  }

  if(e.key === '3') {
    plantsel = 2
  }
})

export class Sounds {
  public static SHOVEL_TAP: Sounds = new Sounds('ui.shovel_tap')
  public static SUN_POINTS: Sounds = new Sounds('ui.sun_points')
  public static PEA_HIT: Sounds = new Sounds('plant.pea_splat')
  public static PLANT: Sounds = new Sounds('plant.plant')
  public static PAUSE: Sounds = new Sounds('ui.pause_game')
  public static GRASS_WALK: Sounds = new Sounds('music.grasswalk_ingame')

  private location: string
  private constructor(location: string) {
    this.location = location
  }

  public getLocation(): string {
    return this.location
  }
}

class OptionsScreen extends Graphics {
  public constructor(core: Core) {
    super()

    this.beginFill(0xff22ff)
    this.drawRect(400 - 200, 300 - 200, 400, 400)
    this.endFill()

    // const mb = this.addChild(Sprite.from('OptionsMenuBack'))
    // const mbmk = mb.addChild(Sprite.from('OptionsMenuBackMask'))
    // mb.mask = mbmk

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
  public loader: Loader

  public constructor() {
    Core.instance = this

    this.app = new Application({
      width: 800,
      height: 600,
      resolution: devicePixelRatio
    })

    this.loader = new Loader()
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
          this.screen = new OptionsScreen(this)
          this._root.addChild(this.screen)
          this.soundManager.playSound(Sounds.PAUSE)
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
  }

  public async init(): Promise<void> {
    const res = await (await fetch('static/resources.json')).json()

    await new Promise<void>((resolve, reject) => {
      this.loader.add(Object.entries(res).map((r: any) => {
        return {
          name: r[0],
          url: r[1]
        }
      })).load(() => {
        resolve()
      })
    })

    await this.soundManager.load()
    this.level = new Level(this)
    this.root.addChild(this.level)

    this.app.ticker.add((dt) => {
      if(this.level && this.running) {
        this.level.update(dt)
        this.debugOverlay.update(dt)
      }
    })

    class FitWidthButton extends Container {
      public constructor(x: number, y: number, width: number, text: string, onPress: () => void) {
        super()
        
        this.x = x
        this.y = y
        this.width = width
        this.height = 46

        const leftB = Sprite.from('ButtonLeft')
        const midB = Sprite.from('ButtonMiddle')
        midB.position.x = leftB.width
        const rightB = Sprite.from('ButtonRight')
        rightB.position.x = leftB.width + midB.width
      
        this.addChild(leftB)
        this.addChild(midB)
        this.addChild(rightB)

        this.interactive = true
        this.on('pointerdown', () => {
          leftB.texture = Texture.from('ButtonDownLeft')
          midB.texture = Texture.from('ButtonDownMiddle')
          rightB.texture = Texture.from('ButtonDownRight')
        })

        const onPointerUp = () => {
          leftB.texture = Texture.from('ButtonLeft')
          midB.texture = Texture.from('ButtonMiddle')
          rightB.texture = Texture.from('ButtonRight')
        }

        this.on('pointerup', onPointerUp)
        this.on('pointerupoutside', onPointerUp)

        const t = new Text(text, {
          fill: 0x00ff00,
          fontSize: 22
        })
        t.position.x = this.width / 2
        t.position.y = 8
        t.anchor.set(0.5, 0)

        this.addChild(t)

        this.on('click', () => {
          onPress()
        })
      }
    }

    const b0 = new FitWidthButton(690, 0, 200, 'Menu', () => {
      this.running = false
      this.root.interactiveChildren = false
      this.screen = new OptionsScreen(this)
      this._root.addChild(this.screen)
      this.soundManager.playSound(Sounds.PAUSE)
    })
    this._root.addChild(b0)
  }

  public static getInstance(): Core {
    return Core.instance
  }
}

const coreApp = new Core()
coreApp.init()