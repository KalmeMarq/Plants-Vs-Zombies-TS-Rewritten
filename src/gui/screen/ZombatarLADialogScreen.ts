import Font from '@/font/Font'
import FontText from '@/font/FontText'
import Checkbox from '@/gui/components/Checkbox'
import ZombatarTOSButton from '@/gui/components/ZombatarTOSButton'
import Core from '../..'
import DialogScreen from './DialogScreen'

export default class ZombatarLADialogScreen extends DialogScreen {
  public constructor(core: Core) {
    super(core, 600, 418, 'normal')

    const title = this.back.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft15, core.pvzTexts.zombatarTOS.ZOMBATAR_TOS_HEADER[0], 0xDFBA61))
    title.scale.set(1.7, 1.7)
    title.setAnchor(0.5, 0)
    title.setPos(300, 56 + 28)

    const agreeCheck = this.back.addChild(new Checkbox())
    agreeCheck.position.set(404, 342)

    this.back.addChild(new ZombatarTOSButton(core, 40, 346, 'zombatar_back_button', 'zombatar_back_button_highlight', () => {
      core.removeDialog(this)
    }))

    this.back.addChild(new ZombatarTOSButton(core, 454, 346, 'zombatar_accept_button', 'zombatar_accept_button_highlight', () => {
      if (agreeCheck.checked) {
        if (core.users.currentUser) {
          core.users.currentUser.agreedZombatarTOS = true
          this.core.emit('saveUser', core.users.currentUser)
        }
        core.removeDialog(this)
      }
    }))
  }
}
