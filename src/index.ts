import { Application, Container, Loader, Sprite, Texture, Text, BaseTexture, filters, Resource, BaseImageResource, CanvasResource, Rectangle } from 'pixi.js'
import BinaryReader from './binary/BinaryReader';
import BinaryWriter from './binary/BinaryWriter';
import { isDev } from './Constants';
import { Convert } from './data/Converter';
import DebugOverlay from './DebugOverlay';
import FitWidthButton from './gui/components/FitWidthButton';
import GUIScreen from './gui/screen/GUIScreen';
import OptionsScreen from './gui/screen/OptionsScreen';
import SplashScreen from './gui/screen/SplashScreen';
import Level from './Level';
import Options from './Options';
import SoundManager from './sound/SoundManager';

export enum Font {
  BrianneTod12 = '_BrianneTod12',
  BrianneTod16 = '_BrianneTod16',
  BrianneTod32 = '_BrianneTod32',
  Pico129 = '_Pico129',
  DwarvenTodcraft18Yellow = '_DwarvenTodcraft18Yellow',
  HouseofTerror28 = '_HouseofTerror28',
  ContinuumBold14 = '_ContinuumBold14'
}

export class Logger {
  public static info(...text: any[]): void {
    if(!isDev) return
    console.log('Info: ', ...text)
  }
}

class FontManager {
  private core: Core
  public fonts: Map<Font, BaseTexture>
  public fontsInfo: Map<Font, any>

  public constructor(core: Core) {
    this.core = core
    this.fonts = new Map()
    this.fontsInfo = new Map()
  }

  public async load(): Promise<void> {
    const fonts = ['_BrianneTod16', '_BrianneTod12', '_BrianneTod32', '_Pico129', '_DwarvenTodcraft18Yellow', '_HouseofTerror28', '_ContinuumBold14']

    for(let i = 0; i < fonts.length; i++) {
      
      const jk = fonts[i] as Font
      const d = await (await fetch('./static/data/' + jk.replace('_', '') + '.txt')).text()
      
      this.fontsInfo.set(jk, Convert.newFontInfo(d))
      Logger.info(jk, this.fontsInfo.get(jk));
      if(jk !== '_DwarvenTodcraft18Yellow' && jk !== '_HouseofTerror28') {
        const si = Sprite.from(jk)
  
        const c = document.createElement('canvas')
        c.width = si.width
        c.height = si.height
        const ctx = c.getContext('2d')
        ctx!.fillStyle = 'white'
        ctx!.fillRect(0, 0, si.width, si.height)
  
        const font = new Sprite(new Texture(new BaseTexture(c)))
        font.addChild(si)
        font.mask = si

        const s = this.core.app.renderer.generateTexture(font).baseTexture
        this.fonts.set(jk as Font, s)
      } else {
        const font = Sprite.from(jk)
        const s = this.core.app.renderer.generateTexture(font).baseTexture
        this.fonts.set(jk as Font, s)
      }
    }
  }

  public createText(font: Font, str: string, tint: number = 0xffffff) {
    const m = str.split('')

    const text = new Container()
    const txr = this.fonts.get(font)!

    for(let i = 0, j = 0; i < m.length; i++) {
      if(m[i] === ' ') {
        j += 4
        continue
      }

      const info = this.fontsInfo.get(font)[m[i]]
      Logger.info(m[i], info)
      const l = new Sprite(new Texture(txr, new Rectangle(info.rect[0], info.rect[1], info.rect[2], info.rect[3])))
      l.tint = tint
      l.position.x = j
      text.addChild(l)
      j += info.w
    }

    return text
  }
}

export class FontText extends Container {
  private fontManager: FontManager
  private t: Container
  private tsr: string
  private color: number
  private font: Font
  private anchor: [number, number]
  private abPos: [number, number] = [0, 0]

  public constructor(fontM: FontManager, font: Font, text: string, tint: number = 0xffffff) {
    super()
    this.fontManager = fontM
    this.font = font
    this.color = tint
    this.tsr = text
    this.anchor = [0, 0]
    this.t = new Container()
    this.setText(this.tsr)
    this.addChild(this.t)
  }

  public setText(text: string, tint?: number) {
    this.t.removeChildren()
    this.tsr = text
    if(tint) this.color = tint
    
    const m = this.tsr.split('')
    const txr = this.fontManager.fonts.get(this.font)!

    for(let i = 0, j = 0; i < m.length; i++) {
      if(m[i] === ' ') {
        j += 4
        continue
      }

      const info = this.fontManager.fontsInfo.get(this.font)[m[i]]
      const l = new Sprite(new Texture(txr, new Rectangle(info.rect[0], info.rect[1], info.rect[2], info.rect[3])))
      l.tint = this.color
      l.position.x = j
      this.t.addChild(l)
      j += info.w
    }

    this.setPos(this.abPos[0], this.abPos[1])
  }

  public setColor(tint: number) {
    this.setText(this.tsr, tint)
  }

  public setAnchor(x: number, y: number) {
    this.anchor = [x, y]
    this.setPos(this.abPos[0], this.abPos[1])
  }

  public setPos(x: number, y: number) {
    this.abPos[0] = x
    this.abPos[1] = y
    this.x = this.abPos[0] - (this.anchor[0] * this.width)
    this.y = this.abPos[1] - (this.anchor[1] * this.height)
  }
}

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
  public static PAPER: Sounds = new Sounds('ui.paper')

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
  public fontManager: FontManager
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
    this.fontManager = new FontManager(this)

    this.soundManager = new SoundManager(this)

    this.app.renderer.plugins.interaction.cursorStyles.default = 'url("./static/cursor.png"), auto'
    this.app.renderer.plugins.interaction.cursorStyles.pointer = 'url("./static/cursor_pointer.png"), auto'
    this.app.renderer.plugins.interaction.cursorStyles.grab = 'url("./static/cursor_grab.png"), auto'

    document.getElementById('root')?.appendChild(this.app.view)

    this.root.sortableChildren = true
    this._root.sortableChildren = true
    this.root.interactiveChildren = this.running
    this._root.addChild(this.root)
    this.app.stage.addChild(this._root)

    this.debugOverlay = new DebugOverlay(this)
    this.root.addChild(this.debugOverlay)

    window.addEventListener('click', (e) => {
      Logger.info(e.clientX, e.clientY)
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
      Logger.info(s)

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

    await this.fontManager.load()

    // this.setScreen(new TitleScreen())
    this.setScreen(new SplashScreen(this))

    this.app.ticker.add((dt) => {
      if(this.screen) {
        this.screen.tick(dt)
      }

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
    cb.position.set(50, 600 - cb.height - 1)

    // const a = cb.addChild(new Text('$' + this.money.toString(), {
    //   fill: 0x00dd00,
    //   fontSize: 16,
    //   align: 'right'
    // }))
    // a.position.set(120 - a.width, 8)

    const b = new FontText(this.fontManager, Font.ContinuumBold14, '$' + this.money.toString(), 0xB3FD59)
    b.setAnchor(1, 0)
    b.setPos(123, 6)
    cb.addChild(b)

    this.on('addMoney', (count) => {
      this.money += count
      b.setText('$' + this.money.toString())
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
    Logger.info(
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