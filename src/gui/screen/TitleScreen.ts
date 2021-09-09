import Font from '@/font/Font'
import FontText from '@/font/FontText'
import MainMenuScreen from '@/gui/screen/MainMenuScreen'
import { Graphics, Sprite } from 'pixi.js'
import Core from '../..'
import GUIScreen from './GUIScreen'

export default class TitleScreen extends GUIScreen {
  private core: Core
  private loadMask: Graphics
  private size = 0
  private maxSize: number

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

    const barDirt = this.addChild(Sprite.from('LoadBar_dirt'))
    barDirt.anchor.set(0.5, 0)
    barDirt.position.set(400, 530)

    const barGrass = this.addChild(Sprite.from('LoadBar_grass'))
    barGrass.anchor.set(0.5, 0)
    barGrass.position.set(392, 513)
    this.maxSize = barGrass.width

    this.loadMask = new Graphics().beginFill(0xffffff).drawRect(0, 0, this.size, 33).endFill()
    barGrass.addChild(this.loadMask)
    this.loadMask.position.set(-this.maxSize / 2, 0)
    barGrass.mask = this.loadMask

    const txt = barDirt.addChild(new FontText(core.fontManager, Font.BrianneTod16, 'LOADING...', 0xD9B720))
    txt.setAnchor(0.5, 0.5)
    txt.setPos(0, barDirt.height / 2 - 2)

    this.loadResources().then(() => {
      txt.setText('CLICK TO START')

      txt.interactive = true
      txt.buttonMode = true

      txt.on('pointerover', () => {
        txt.setColor(0xF9590E)
      })

      txt.on('pointerout', () => {
        txt.setColor(0xD9B720)
      })

      txt.on('click', () => {
        core.setScreen(new MainMenuScreen(core))
      })
    })
  }

  private async loadResources(): Promise<void> {
    const res = await (await fetch('static/resources.json')).json()
    const resources = Object.entries<string>(res).map((r: [string, string]) => {
      return {
        name: r[0],
        url: r[1]
      }
    })

    const total = resources.length + 3
    let now = 0
    await new Promise<void>((resolve) => {
      this.core.loader.add(resources).load(() => {
        resolve()
      }).onLoad.add((o) => {
        this.size = ++now * this.maxSize / total
        this.loadMask.clear()
        this.loadMask.beginFill(0xffffff).drawRect(0, 0, this.size, 33).endFill()
      })
    })

    await this.core.soundManager.load()
    this.size = ++now * this.maxSize / total
    this.loadMask.clear()
    this.loadMask.beginFill(0xffffff).drawRect(0, 0, this.size, 33).endFill()
    await this.core.pvzTexts.load()
    this.size = ++now * this.maxSize / total
    this.loadMask.clear()
    this.loadMask.beginFill(0xffffff).drawRect(0, 0, this.size, 33).endFill()
    await this.core.tombsAtlas.load()
    this.size = ++now * this.maxSize / total
    this.loadMask.clear()
    this.loadMask.beginFill(0xffffff).drawRect(0, 0, this.size, 33).endFill()
  }
}
