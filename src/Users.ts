import Core from '@/.'
import User from '@/User'

export default class Users {
  private core: Core
  public numOfUsers = 0
  public users: Map<number, User>
  public currentUser: User | undefined

  public constructor(core: Core) {
    this.core = core
    this.users = new Map()

    this.core.on('userChanged', (id, user) => {
      localStorage.setItem('users', JSON.stringify({
        selected: this.currentUser?.id ?? -1,
        users: Array.from(this.users.entries()).map(value => {
          return {
            id: value[0],
            name: value[1].name
          }
        })
      }))
    })

    this.core.on('saveUser', (user) => {
      user.save()
    })
  }

  public load(): void {
    const li = localStorage.getItem('users')

    if (li) {
      const data = JSON.parse(li)
      for (let i = 0; i < data.users.length; i++) {
        const id = data.users[i].id
        const user = new User(id, data.users[i].name)
        user.load()
        this.users.set(id, user)
        if (data.selected === id) this.currentUser = user
        this.numOfUsers += 1
      }
    }

    // const user = new User(0, 'Player')
    // this.users.set(0, user)
    // this.currentUser = user
    // this.numOfUsers += 1

    // const user2 = new User(1, 'Player2')
    // this.users.set(1, user2)
    // user2.currentLevel = 6
    // this.numOfUsers += 1

    // const li = localStorage.getItem('users')

    // if (li) {
    //   const usersData = new Uint8Array(JSON.parse(li))
    //   const reader = new BinaryReader(usersData)

    //   console.log('version: ' + reader.readUint32())
    //   // for (let i = 0; i < usersData.length; i++) {
    //   //   const user = localStorage.getItem('user_' + usersData[i])
    //   //   console.log(user)
    //   // }
    // }
  }

  public write(): void {
    // const writer = new BinaryWriter()
    // writer.writeUint32(14)

    // localStorage.setItem('users', JSON.stringify(Array.from(writer.finish())))
  }

  public select(id: number): void {
    const user = this.users.get(id) as User
    this.currentUser = user

    this.core.emit('userChanged', id, user)
    this.core.emit('saveUser', user)
  }

  public createUser(name?: string): void {
    const d = Array.from(this.users.entries())
    const id = d[d.length - 1][1].id + 1

    const user = new User(id, name ?? 'Player' + (id))
    this.users.set(id, user)
    this.numOfUsers++

    this.select(id)
  }

  public renameUser(id: number, newName: string): void {
    const user = this.users.get(id) as User
    user.name = newName
    this.core.emit('userChanged', id, user)
  }

  public deleteUser(id: number): void {
    const user = this.users.get(id) as User
    user.remove()
    const isCurrent = user.id === this.currentUser?.id

    this.users.delete(id)
    this.numOfUsers--

    if (isCurrent) {
      const h = Array.from(this.users)
      this.select(h[0][0])
    }

    localStorage.setItem('users', JSON.stringify({
      selected: this.currentUser?.id ?? -1,
      users: Array.from(this.users.entries()).map(value => {
        return {
          id: value[0],
          name: value[1].name
        }
      })
    }))
  }
}
