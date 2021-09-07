import { Container, Sprite, Texture, Text } from "pixi.js"

export default class FitWidthButton extends Container {
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