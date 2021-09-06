# Plants-Vs-Zombies-TS-Rewritten

## Changes

### v0.1.2
  - Lawnmower
    - Uses a sprite now. No animation yet
  - Shovel Bank
    - Has a shovel that remove plants
  - Sun Bank
    - Display how much sun is accumulated
  - New plants
    - Peashooter
      - Uses the default plant class
    - SnowPea
      - Same as Peashooter. Freeze mechanic is not implemented yet
    - Wallnut
      - Health: 3000
      - Texture will change depending on how much health it has
  - Added grasswalk music
  - Added a menu button to pause game
  - Projectile attack damage reduced from 50 to 20
  - Level
    - Added background

### v0.1.1
  - Zombies are now slower. 1 slot in 4 second
  - Cursor looks the same as the original game one
  - Lawnmowers
    - If a zombie reaches, it starts going forwards and kills all zombies in the same row 
  - Options
    - Added sound sliders with only Master (global) working for now
    - Added a dialog when game is paused that contains sliders to change sound options
    - It's save in local storage
  - Sounds
    - Added plant, sun collect and pause sounds
    - Sound files used are specified in a sounds.json file
  - Sun
    - Initialy is now 0 instead of 2000
### v0.1
  - First version
  - Plant
    - Health: 100
    - Shoots projectiles when there's a zombie in the same row
    - There's only a abstract type
  - Zombie
    - Health: 150
    - Attack: 1
    - Spawns every 12.5 seconds
    - Stops moving when collades with a plant and starts eating it
    - Can be hit by projectiles
    - There's only a abstract type
  - Projectile
    - Attack: 50
    - There's only a abstract type
  - Sun
    - Count: 25 (default)
    - Falls down until it reaches and random y position
    - Disappers after sometime
    - Spawns every 7 seconds
    - SunCount is initially 2000
  - Slot (grid system)  
    - Stores if there's a plant in a specific row and column
  - Debug Texts
    - Shows the app name, level id, fps and the number of suns, projectiles, plants, zombies and all entities
    - Can be shown/hidden by pressing F2
  - Can be paused/resumed by pressing Escape
  - No images yet. Just a sad flat color