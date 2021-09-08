import Core, { Logger, Sounds } from ".."

export default class SoundManager {
  private core: Core
  public context: AudioContext
  private gainNode: GainNode
  private sounds: Map<string, AudioBuffer>

  public constructor(core: Core) {
    this.core = core
    this.sounds = new Map()
    this.context = new AudioContext()
    this.gainNode = this.context.createGain()
    this.gainNode.connect(this.context.destination)
  }

  public playSound(sound: Sounds, volume?: number): void {
    const s = this.sounds.get(sound.getLocation())
    if(!s) return


    const source = this.context.createBufferSource()
    source.buffer = s
    source.connect(this.gainNode)
    this.gainNode.gain.value = this.core.options.sound_master * (volume ?? 1)
    source.start(0)
  }

  public async load(): Promise<void> {
    const sounds = await (await fetch('static/sounds.json')).json()
    const dataSounds = Object.entries<{ sounds: string[] }>(sounds)
    
    for(let i = 0; i < dataSounds.length; i++) {
      const [name, data] = dataSounds[i]

      try {
        const soundData = await (await fetch(`static/sounds/${data.sounds[0]}`)).arrayBuffer()
        const decoded = await this.context.decodeAudioData(soundData)
        this.sounds.set(name, decoded)
      } catch(e) {}
    }

    Logger.info(this.sounds)
    Logger.info(Sounds)
  }
}