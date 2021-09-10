import { isDev } from '@/Constants'
import BinaryReader from '@/data/binary/BinaryReader'
import BinaryWriter from '@/data/binary/BinaryWriter'
import PvZTexts from '@/data/PvZTexts'
import TombstoneAtlas from '@/data/TombstoneAtlas'
import Font from '@/font/Font'
import FontManager from '@/font/FontManager'
import FontText from '@/font/FontText'
import FitWidthButton from '@/gui/components/FitWidthButton'
import DebugOverlay from '@/gui/DebugOverlay'
import GUIScreen from '@/gui/screen/GUIScreen'
import LevelOptionsDialogScreen from '@/gui/screen/LevelOptionsScreen'
import SplashScreen from '@/gui/screen/SplashScreen'
import Level from '@/level/Level'
import Logger from '@/Logger'
import Options from '@/Options'
import SoundManager from '@/sound/SoundManager'
import Sounds from '@/sound/Sounds'
import User from '@/User'
import Users from '@/Users'
import { Application, Container, Loader, Sprite, Text } from 'pixi.js'
import { parse as parseYAML } from 'yaml'

export default class Core extends Container {
  private static instance: Core
  public running = true
  public showDebug = false
  public pvzTexts: PvZTexts
  public app: Application
  public currentUser: User | null = null
  public level: Level | null = null
  public root: Container
  public debugOverlay: DebugOverlay
  public options: Options
  public soundManager: SoundManager
  public fontManager: FontManager
  public screen: null | GUIScreen = null
  public loader: Loader
  public tombsAtlas: TombstoneAtlas
  public achievements = {
    sunny_day: 0,
    mustache_mode: 0
  }

  public users: Users

  public dialogScreenStack: GUIScreen[] = []

  public constructor() {
    super()
    Core.instance = this

    this.users = new Users(this)
    this.users.load()

    this.app = new Application({
      width: 800,
      height: 600,
      resolution: devicePixelRatio
    })

    function isFullscreen(): boolean {
      return window.outerHeight - window.innerHeight <= 1
    }

    window.addEventListener('resize', () => {
      if (isFullscreen()) {
        const w = 800 / 600
        this.app.view.style.width = window.innerHeight * w + 'px'
        this.app.view.style.height = window.innerHeight + 'px'
        document.body.style.background = 'black'
      } else {
        this.app.view.style.width = '800px'
        this.app.view.style.height = '600px'
        document.body.style.background = '#232323'
      }
    })

    this.loader = new Loader()
    this.options = new Options()
    this.root = new Container()
    this.fontManager = new FontManager(this)
    this.pvzTexts = new PvZTexts()
    this.soundManager = new SoundManager(this)
    this.tombsAtlas = new TombstoneAtlas(this)

    this.app.renderer.plugins.interaction.cursorStyles.default = 'url("./static/images/cursor.png"), auto'
    this.app.renderer.plugins.interaction.cursorStyles.pointer = 'url("./static/images/cursor_pointer.png"), auto'
    this.app.renderer.plugins.interaction.cursorStyles.grab = 'url("./static/images/cursor_grab.png"), auto'

    document.getElementById('root')?.appendChild(this.app.view)

    this.root.sortableChildren = true
    this.app.stage.addChild(this.root)

    this.debugOverlay = new DebugOverlay(this)
    this.root.addChild(this.debugOverlay)

    window.addEventListener('click', (e) => {
      Logger.info(e.clientX, e.clientY)
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'F10' && e.ctrlKey) {
        e.preventDefault()

        this.saveUser()
      }

      if (e.key === 'F1' && e.ctrlKey) {
        e.preventDefault()
        this.level?.saveLevelData()
      }

      if (e.key === 'Escape') {
        if (this.dialogScreenStack.length > 0 && isDev) {
          this.removeDialog(this.dialogScreenStack[this.dialogScreenStack.length - 1])
        }

        if (this.level) {
          this.addDialog(new LevelOptionsDialogScreen(this))
        }
      }

      if (e.code === 'F2') {
        e.preventDefault()
        if (this.showDebug) {
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
      if (this.users.currentUser?.achievements.mustache_mode) return
      s += e.key
      Logger.info(s)

      if (s.length > 0 && !'mustache'.includes(s)) {
        s = ''
      }

      if (s === 'mustache') {
        s = ''

        if (this.users.currentUser?.achievements.mustache_mode === 0) {
          if (this.users.currentUser) this.users.currentUser.achievements.mustache_mode = 1
          this.emit('saveUser', this.users.currentUser)
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

  public isFullscreen(): boolean {
    return window.outerHeight - window.innerHeight <= 1
  }

  public addDialog(dialog: GUIScreen): void {
    dialog.zIndex = 1000
    this.root.addChild(dialog)
    this.dialogScreenStack.push(dialog)
    this.checkInteractivability()
  }

  public removeDialog(dialog: GUIScreen): void {
    this.root.removeChild(dialog)
    const i = this.dialogScreenStack.findIndex(d => d === dialog)
    this.dialogScreenStack.splice(i, 1)
    this.checkInteractivability()
  }

  public checkInteractivability(): void {
    if (this.dialogScreenStack.length === 0) {
      if (this.screen) this.screen.interactiveChildren = true
      if (this.level) this.level.interactiveChildren = true
    } else if (this.dialogScreenStack.length > 0) {
      if (this.screen) this.screen.interactiveChildren = false
      if (this.level) this.level.interactiveChildren = false

      this.dialogScreenStack.slice(0, this.dialogScreenStack.length - 1).forEach(d => {
        d.interactiveChildren = false
      })

      this.dialogScreenStack[this.dialogScreenStack.length - 1].interactiveChildren = true
    }
  }

  public setScreen(scrn: null | GUIScreen): void {
    if (this.screen !== null) {
      this.root.removeChild(this.screen)
      this.screen.destroy()
      this.screen = null
    }

    this.screen = scrn

    if (this.screen) {
      this.root.addChild(this.screen)
      this.checkInteractivability()
    }
  }

  public async init(): Promise<void> {
    const res = parseYAML(await (await fetch('static/resources.yaml')).text())

    await new Promise<void>((resolve) => {
      this.loader.add(Object.entries<string>(res.preloaded).map((r: [string, string]) => {
        return {
          name: r[0],
          url: r[1]
        }
      })).load(() => {
        resolve()
      })
    })

    await this.pvzTexts.load()
    await this.fontManager.preload()

    this.setScreen(new SplashScreen(this))

    this.app.ticker.add((dt) => {
      if (this.screen) {
        this.screen.tick(dt)
      }

      if (this.level && this.running) {
        this.level.update(dt)
        this.debugOverlay.update(dt)
      }
    })
  }

  public addLevel(): void {
    this.level = new Level(this)
    this.root.addChild(this.level)

    const cb = this.level.addChild(Sprite.from('CoinBank'))
    cb.position.set(50, 600 - cb.height - 1)

    const b = new FontText(this.fontManager, Font.ContinuumBold14, '$' + this.users.currentUser?.money.toString() ?? '0', 0xB3FD59)
    b.setAnchor(1, 0)
    b.setPos(123, 6)
    cb.addChild(b)

    this.on('addMoney', (count) => {
      if (this.users.currentUser) {
        this.users.currentUser.money += count
        b.setText('$' + this.users.currentUser.money.toString())
        this.emit('saveUser', this.users.currentUser)
      }
    })

    const b0 = new FitWidthButton(682, -12, 118, 'Menu', () => {
      this.addDialog(new LevelOptionsDialogScreen(this))
      this.soundManager.playSound(Sounds.PAUSE)
    })
    this.level.addChild(b0)
  }

  public static getInstance(): Core {
    return Core.instance
  }

  public saveUser(): void {
    const writer = new BinaryWriter()
    writer.writeUint32(14)
    writer.writeInt32(this.users.currentUser!.money)
    Object.values(this.users.currentUser!.achievements).forEach(v => {
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

  public download(filename: string, cont: Uint8Array | string): void {
    const blob = new Blob([cont], { type: '' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    const fileName = filename
    link.download = fileName
    link.click()
  }
}

const coreApp = new Core()
coreApp.init()
