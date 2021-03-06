# Plants-Vs-Zombies-TS-Rewritten

## Changes

### v0.2.5
  - Added test reanimation to sun and wallnut

### v0.2.4
  - Bug fixes
    - [PVZTSR-0] Error when creating a new user for the first time

### v0.2.3
  - All original pvz config files are now using yaml format. Converters for the old format are still around
  - Added user system
    - all users are stored in localstorage
  - Added fulscreen option

### v0.2.2
  - Fixed some fonts not loading
  - Fixed debug texts not appearing outside the level
  - Ajusted help screen to match PvZ
  - Ajusted seed and shovel bank to match PvZ
  - Added more fonts
  - Added a better screen stack
    - the top most dialog will be interactable and every other behind will not (including the main screen)
  - Main and Level have now their own options dialog
  - Added "who are you" and zombatar dialogs (Not functional yet)
  - Ajusted things
  - Added tombstones
    - Plants can't be placed if there's a tomb in that slot
  - New plants
    - Grave Buster
      - Can only be placed on top of tombstones and after 4 seconds it removes them
    - Lilypad
      - Doesn't do anything and can be placed on grass since there's no pool yet
  - Zombies when cold will also attack slower
  - Added 'View alamanac' button to Level options

### v0.2.1
  - Fixed cost not appearing in the level seed packets
  - Fixed money bank scale y
  - Added splash screen
  - Better main menu
  - Now uses pvz fonts most of the time
  - Added enter animation to help screen and paper sound
  - Ajusted offsets

### v0.2
  - Added titlescreen
  - Added main menu
    - Start button to open level
    - Almanac to open Alamanac screen
  - Added Plants Almanac
  - Added coin sound
  - Sun
    - Spawns every 10 seconds instead of 7
    - When collected it will move towards the sun bank
  - New plant
    - Sunflower
      - Produces suns
  - SunBank moved to seed bank
  - Seed Bank
    - Contains all current plants
  - Seed Packet
  - Debug texts is hidden by default
  - Each plant has there own cost
    - Peashooter: 100
    - SnowPea: 175
    - Wallnut: 50
    - Sunflower: 50
  - Added the money bank
  - Added coins
    - Silver Coin: $10
    - Gold Coin: $50
    - Spawns when zombie dies
  - Shovel now follows the cursor
  - Added Achievements
    - Sunny days: Get to 8000 sun
    - Mustache Mode: Type "mustache"
  - Added snow pea projectile
    - Makes zombies slower for 8 seconds
  - BinData
    - Pressing Ctrl + F10 will download the user data file
    - Pressing Ctrl + F1 will download the level data file
    - Use loaded data from data files is not implemented yet
  - Options Dialog
    - Added button to return to the main menu
  - Added help screen
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
