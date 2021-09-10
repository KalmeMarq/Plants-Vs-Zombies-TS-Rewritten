import Core from '@/.'

export default class LawnText {
  private key: string
  private index: number

  public constructor(key: string, index?: number) {
    this.key = key
    this.index = index ?? 0
  }

  public getFinal(core: Core): string {
    const t = core.pvzTexts.lawnStrings[this.key]
    return t ? t[this.index] : this.key
  }
}
