import { Sprite, Graphics } from "pixi.js"
import Core from "../.."
import Slider from "../../Slider"
import GUIScreen from "./GUIScreen"
import MainMenuScreen from "./MainMenuScreen"

export default class OptionsScreen extends GUIScreen {
  public constructor(core: Core) {
    super()
    // this.beginFill(0xff22ff)
    // this.drawRect(400 - 200, 300 - 200, 400, 400)
    // this.endFill()


    const mb = this.addChild(Sprite.from('OptionsMenuBack'))
    const mbmk = mb.addChild(Sprite.from('OptionsMenuBackMask'))
    mb.mask = mbmk

    mb.position.set(400 / 2, 10)
    
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
      this.destroy()
      core.screen = null
    })

    const btn1 = new Graphics()
    btn1.position.set(400 - 100, 200 + 150 - 44)
    btn1.beginFill(0x333333)
    btn1.drawRect(0, 0, 200, 40)
    btn1.endFill()
    this.addChild(btn1)

    btn1.interactive = true
    btn1.buttonMode = true

    btn1.on('click', () => {
      this.parent.removeChild(this)
      const core = Core.getInstance()
      core.running = true
      core.root.interactiveChildren = true
      core.screen = null
      
      core.level?.parent.removeChild(core.level)
      core.level = null

      core.setScreen(new MainMenuScreen(core))

      this.destroy()
    })
  }
}