import { Application, Container, Graphics, Loader, Sprite, Texture, Text } from 'pixi.js'
import BinaryReader from './binary/BinaryReader';
import BinaryWriter from './binary/BinaryWriter';
import DebugOverlay from './DebugOverlay';
import FitWidthButton from './gui/components/FitWidthButton';
import GUIScreen from './gui/screen/GUIScreen';
import MainMenuScreen from './gui/screen/MainMenuScreen';
import OptionsScreen from './gui/screen/OptionsScreen';
import TitleScreen from './gui/screen/TitleScreen';
import Level from './Level';
import Options from './Options';
import Slider from './Slider';
import SoundManager from './sound/SoundManager';

export class Sounds {
  public static SHOVEL_TAP: Sounds = new Sounds('ui.shovel_tap')
  public static SUN_POINTS: Sounds = new Sounds('ui.sun_points')
  public static COIN: Sounds = new Sounds('ui.coin')
  public static TAP: Sounds = new Sounds('ui.tap')
  public static BLEEP: Sounds = new Sounds('ui.bleep')
  public static PEA_HIT: Sounds = new Sounds('plant.pea_splat')
  public static PLANT: Sounds = new Sounds('plant.plant')
  public static PAUSE: Sounds = new Sounds('ui.pause_game')
  public static GRASS_WALK: Sounds = new Sounds('music.grasswalk_ingame')
  public static ACHIEVEMENT: Sounds = new Sounds('ui.earn_achievement')

  private location: string
  private constructor(location: string) {
    this.location = location
  }

  public getLocation(): string {
    return this.location
  }
}

export default class Core extends Container {
  private static instance: Core
  public running: boolean = true
  public showDebug: boolean = false
  public app: Application
  public level: Level | null = null
  public _root: Container
  public root: Container
  public debugOverlay: DebugOverlay
  public options: Options
  public soundManager: SoundManager
  public screen: null | GUIScreen = null
  public loader: Loader
  public money: number = 0
  public achievements = {
    'sunny_day': 0,
    'mustache_mode': 0
  }

  public constructor() {
    super()
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

    window.addEventListener('click', (e) => {
      console.log(e.clientX, e.clientY)
    })

    window.addEventListener('keyup', (e) => {
      if(e.key === 'F10' && e.ctrlKey) {
        e.preventDefault()

        this.saveUser()
      }

      if(e.key === 'F1' && e.ctrlKey) {
        e.preventDefault()
        this.level?.saveLevelData()
      }

      if(e.key === 'Escape') {
        if(this.running) {
          this.running = false
          // this.app.stop()
          this.root.interactiveChildren = false
          this.screen = new OptionsScreen(this)
          this._root.addChild(this.screen)
          this.soundManager.playSound(Sounds.PAUSE)
        } else {
          this.running = true
          this.root.interactiveChildren = true
          // this.app.start()
          // this._root.removeChild(this.screen)
          // this.screen.destroy()
          // this.screen = null
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

    let s = ''
    window.addEventListener('keypress', (e) => {
      if(this.achievements.mustache_mode) return
      s += e.key
      console.log(s)

      if(s.length > 0 && !'mustache'.includes(s)) {
        s = ''
      }

      if(s === 'mustache') {
        s = ''

        if(this.achievements.mustache_mode === 0) {
          this.achievements.mustache_mode = 1
  
          this.soundManager.playSound(Sounds.ACHIEVEMENT)
          const p = this.root.addChild(new Text('Achievement: Mustache Mode'))
          setTimeout(() => {
            p.parent.removeChild(this)
            p.destroy()
          }, 3000)
        }
      }
    })
  }

  public setScreen(scrn: null | GUIScreen): void {
    if(this.screen !== null) {
      this._root.removeChild(this.screen)
      this.screen.destroy()
      this.screen = null
    }

    this.screen = scrn

    if(this.screen) {
      this._root.addChild(this.screen)
    }
  }

  public async init(): Promise<void> {
    const res0 = await (await fetch('static/preloaded_resources.json')).json()

    await new Promise<void>((resolve, reject) => {
      this.loader.add(Object.entries(res0).map((r: any) => {
        return {
          name: r[0],
          url: r[1]
        }
      })).load(() => {
        resolve()
      })
    })

    this.setScreen(new TitleScreen())

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

    this.setScreen(null)

    this.setScreen(new MainMenuScreen(this))

    this.app.ticker.add((dt) => {
      if(this.level && this.running) {
        this.level.update(dt)
        this.debugOverlay.update(dt)
      }
    })
  }

  public addLevel(): void {
    this.level = new Level(this)
    this.root.addChild(this.level)
    // this.root.addChild(this.level)

    const cb = this.level.addChild(Sprite.from('CoinBank'))
    cb.scale.y = 1.2
    cb.position.set(10, 540)

    const a = cb.addChild(new Text('$' + this.money.toString(), {
      fill: 0x00dd00,
      fontSize: 16,
      align: 'right'
    }))
    a.position.set(120 - a.width, 8)

    this.on('addMoney', (count) => {
      this.money += count
      a.text = '$' + this.money.toString()
      a.position.set(120 - a.width, 8)
    })

    const b0 = new FitWidthButton(690, 0, 200, 'Menu', () => {
      this.running = false
      this.root.interactiveChildren = false
      this.screen = new OptionsScreen(this)
      this._root.addChild(this.screen)
      this.soundManager.playSound(Sounds.PAUSE)
      this.level?.shovelBank?.setVisible(false)
    })
    this.level.addChild(b0)
  }

  public static getInstance(): Core {
    return Core.instance
  }

  public saveUser(): void {
    let writer = new BinaryWriter()
    writer.writeUint32(14)
    writer.writeInt32(this.money)
    Object.values(this.achievements).forEach(v => {
      writer.writeByte(v)
    })

    this.download('pvztsuser.dat', writer.finish())
    // this.loadUser(new BinaryReader(writer.finish()))
  }

  public loadUser(reader: BinaryReader): void {
    reader.readInt32()
    console.log(
      'money: ' + reader.readInt32(),
      'sunny_days: ' + reader.readByte(),
      'mustache_mode: ' + reader.readByte()
    )
  }

  public download(filename: string, cont: any): void {
    let blob = new Blob([cont], {type: ""})
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    let fileName = filename
    link.download = fileName
    link.click()
  }
}

const coreApp = new Core()
coreApp.init()