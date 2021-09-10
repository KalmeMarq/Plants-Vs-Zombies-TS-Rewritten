import Font from '@/font/Font'
import FontText from '@/font/FontText'
import GUIScreen from '@/gui/screen/GUIScreen'
import MainMenuScreen from '@/gui/screen/MainMenuScreen'
import User from '@/User'
import { Graphics } from '@pixi/graphics'
import Core from '../..'
import FitWidthButton from '../components/FitWidthButton'
import DialogScreen from './DialogScreen'

class DeleteUserWarningDialog extends DialogScreen {
  public constructor(core: Core, parent: GUIScreen, action: () => void) {
    super(core, 408, 306, 'normal')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'ARE YOU SURE?', 0xDFBA61))
    const line1 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'This will permanently remove', 0xDFBA61))
    const line2 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, '\'' + core.users.currentUser?.name + '\' from the player roster', 0xDFBA61))

    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    line1.setAnchor(0.5, 0)
    line2.setAnchor(0.5, 0)
    title.setPos(204, 56 + 25)
    line1.setPos(204, 56 + 70)
    line2.setPos(204, 82 + 70)

    this.back.addChild(new FitWidthButton(31, 225, 160, 'Yes', () => {
      core.removeDialog(this)
      action()
    }))

    this.back.addChild(new FitWidthButton(200, 225, 160, 'Cancel', () => {
      core.removeDialog(this)
      core.removeDialog(parent)
    }))
  }
}

class NewUserWarningDialog extends DialogScreen {
  public constructor(core: Core) {
    super(core, 510, 306, 'normal')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'ENTER YOUR NAME', 0xDFBA61))
    const line1 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'Please enter your name to create a new user', 0xDFBA61))
    const line2 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'profile for storing high score data and game', 0xDFBA61))
    const line3 = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'progress.', 0xDFBA61))

    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    line1.setAnchor(0.5, 0)
    line2.setAnchor(0.5, 0)
    line3.setAnchor(0.5, 0)
    title.setPos(255, 56 + 25)
    line1.setPos(255, 56 + 67)
    line2.setPos(255, 80 + 67)
    line3.setPos(255, 104 + 67)

    this.back.addChild(new FitWidthButton(99, 222, 302, 'Ok', () => {
      core.removeDialog(this)
    }))
  }
}

export class NewUserDialog extends DialogScreen {
  public constructor(core: Core, parent: GUIScreen) {
    super(core, 506, 306, 'normal')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'NEW USER', 0xDFBA61))
    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    title.setPos(255, 56 + 25)

    let nm = ''

    const txt = this.back.addChild(new FontText(core.fontManager, Font.BrianneTod16, 'Name: ' + nm, 0xEAE0B3))
    txt.setAnchor(0.5, 0)
    txt.setPos(506 / 2, 140)

    function a(e: KeyboardEvent) {
      if (nm.length < 12 && ((e.key >= '0' && e.key <= '9') || (e.key >= 'a' && e.key <= 'z') || (e.key >= 'A' && e.key <= 'Z'))) {
        nm += e.key
        txt.setText('Name: ' + nm)
      }
    }

    function b(e: KeyboardEvent) {
      if (e.key === 'Backspace') {
        nm = nm.slice(0, nm.length - 1)
        txt.setText('Name: ' + nm)
      }
    }

    window.addEventListener('keypress', a)
    window.addEventListener('keydown', b)

    this.back.addChild(new FitWidthButton(31, 225, 210, 'Ok', () => {
      if (nm.length > 0) {
        window.removeEventListener('keypress', a)
        window.removeEventListener('keydown', b)
        core.users.createUser(nm)
        core.removeDialog(this)
        if (!(parent instanceof MainMenuScreen)) core.removeDialog(parent)
        else if (parent instanceof MainMenuScreen) {
          parent.setupSigns()
        }
      } else {
        core.addDialog(new NewUserWarningDialog(core))
      }
    }))

    this.back.addChild(new FitWidthButton(250, 225, 210, 'Cancel', () => {
      core.removeDialog(this)
    }))
  }
}

class RenameUserDialog extends DialogScreen {
  public constructor(core: Core, id: number, parent: GUIScreen) {
    super(core, 506, 306, 'normal')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'RENAME USER', 0xDFBA61))
    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    title.setPos(255, 56 + 25)

    let nm = (core.users.users.get(id) as User).name

    const txt = this.back.addChild(new FontText(core.fontManager, Font.BrianneTod16, 'Name: ' + nm, 0xEAE0B3))
    txt.setAnchor(0.5, 0)
    txt.setPos(506 / 2, 140)

    function a(e: KeyboardEvent) {
      if (nm.length < 12 && ((e.key >= '0' && e.key <= '9') || (e.key >= 'a' && e.key <= 'z') || (e.key >= 'A' && e.key <= 'Z'))) {
        nm += e.key
        txt.setText('Name: ' + nm)
      }
    }

    function b(e: KeyboardEvent) {
      if (e.key === 'Backspace') {
        nm = nm.slice(0, nm.length - 1)
        txt.setText('Name: ' + nm)
      }
    }

    window.addEventListener('keypress', a)
    window.addEventListener('keydown', b)

    this.back.addChild(new FitWidthButton(31, 225, 210, 'Ok', () => {
      window.removeEventListener('keypress', a)
      window.removeEventListener('keydown', b)
      core.users.renameUser(id, nm)
      parent.emit('reload')
      core.removeDialog(this)
    }))

    this.back.addChild(new FitWidthButton(250, 225, 210, 'Cancel', () => {
      core.removeDialog(this)
    }))
  }
}

class DeleteUserDialog extends DialogScreen {
  public constructor(core: Core, id: number, parent: GUIScreen) {
    super(core, 506, 306, 'normal')

    this.back.addChild(new FitWidthButton(31, 225, 210, 'Ok', () => {
      core.addDialog(new DeleteUserWarningDialog(core, this, () => {
        core.users.deleteUser(id)
        parent.emit('reload')
        core.removeDialog(this)
      }))
    }))

    this.back.addChild(new FitWidthButton(250, 225, 210, 'Cancel', () => {
      core.removeDialog(this)
    }))
  }
}

class ListItem extends Graphics {
  private id: number
  private selected = false
  private core: Core
  public constructor(core: Core, id: number, text: string, action: (item: ListItem) => void, useHover = true) {
    super()
    this.id = id
    this.core = core

    //  0x13B30E
    this.beginFill(0xffffff, 0.0001)
    this.drawRect(0, 0, 455, 24)
    this.endFill()

    this.interactive = true
    this.buttonMode = true

    const txt = this.addChild(new FontText(core.fontManager, Font.BrianneTod16, text, 0xEAE0B3))
    txt.setAnchor(0.5, 0.5)
    txt.setPos(455 / 2, 24 / 2)

    this.on('pointerdown', (e) => {
      e.stopPropagation()
      action(this)
    })

    this.on('pointerover', () => {
      // this.addChildAt(hoverG, 0)
      txt.setColor(0xffffff)
      if (useHover) {
        this.clear()
        this.beginFill(0x13B30E, 1)
        this.drawRect(0, 0, 455, 24)
        this.endFill()
      }
    })

    this.on('pointerout', () => {
      // this.removeChild(hoverG)
      txt.setColor(0xEAE0B3)
      if (useHover && !this.selected) {
        this.clear()
        this.beginFill(0xffffff, 0.0001)
        this.drawRect(0, 0, 455, 24)
        this.endFill()
      }
    })
  }

  public select(): void {
    this.selected = true
    this.clear()
    this.beginFill(0x13B30E, 1)
    this.drawRect(0, 0, 455, 24)
    this.endFill()

    this.core.users.select(this.id)
  }
}

export default class WhoAreYouDialogScreen extends DialogScreen {
  private selectedId = -1
  public constructor(core: Core) {
    super(core, 600, 506, 'big')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, 'WHO ARE YOU?', 0xDFBA61))
    title.scale.set(1.5, 1.5)
    title.setAnchor(0.5, 0)
    title.setPos(300, 56 + 28)

    const list = this.back.addChild(new Graphics())
    list.lineStyle({
      width: 1,
      color: 0x000000
    })
    list.beginFill(0x161722)
    list.drawRect(0, 0, 457, 200)
    list.endFill()
    list.position.set(64, 132)

    this.setList(list)

    this.back.addChild(new FitWidthButton(30, 384, 254, 'Rename', () => {
      core.addDialog(new RenameUserDialog(core, this.selectedId, this))
    }))

    this.back.addChild(new FitWidthButton(300, 384, 254, 'Delete', () => {
      core.addDialog(new DeleteUserDialog(core, this.core.users.currentUser?.id ?? -1, this))
    }))

    this.back.addChild(new FitWidthButton(30, 430, 254, 'Ok', () => {
      core.removeDialog(this)
    }))

    this.back.addChild(new FitWidthButton(300, 430, 254, 'Cancel', () => {
      core.removeDialog(this)
    }))

    this.on('reload', () => {
      this.setList(list)
    })
  }

  public setList(list: Graphics): void {
    list.removeChildren()

    let y = 5
    for (let i = 0; i < this.core.users.numOfUsers; i++, y += 29) {
      const user = Array.from(this.core.users.users)[i]

      if (!user) return
      const b = list.addChild(new ListItem(this.core, user[1].id, user[1].name ?? '', (li) => {
        li.select()
        this.selectedId = user[1].id
        this.setList(list)
      }))
      b.position.y = y
      if (this.core.users.currentUser?.id === user[1].id) {
        this.selectedId = user[1].id
        b.select()
      }
    }

    const c = list.addChild(new ListItem(this.core, -1, '(Create a New User)', () => {
      this.core.addDialog(new NewUserDialog(this.core, this))
    }, false))
    c.position.y = y
  }
}
