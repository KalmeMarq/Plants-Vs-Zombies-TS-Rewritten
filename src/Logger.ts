import { isDev } from '@/Constants'

export default class Logger {
  public static info(...text: unknown[]): void {
    if (!isDev) return
    console.log('Info: ', ...text)
  }
}
