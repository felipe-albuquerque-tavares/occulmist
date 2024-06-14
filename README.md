# [Occultimist](https://occultimist.onrender.com/)
#### Video Demo: [Final Project - CS50](https://www.youtube.com/watch?v=c5ZsbhvY68c&ab_channel=FelipeAlbuquerque)
#### Description:
# Game Overview
Occultimist is an action-packed multiplayer experience where players engage in battles with enemies and each other. The primary components of the game include:

- **Players** : Users can join the game, control the character, and interact with the game world.

- **Enemies**: AI-controlled entities that players can battle. Enemies have unique behaviors and follow the closet player to attack him.

- **Items**: 2 items can be scattered throughout the game world, a sword for melee attacks and a staff for ranged attacks.

- **Bullets**: Projectiles fired by players during ranged attacks. Bullets interact with both players and enemies.

# Game Mechanics
## Player Controls
- **Movement**: Players can move their characters using standard directional controls.
- **Melee Attacks**: Melee attacks are triggered based on player input.
- **Ranged Attacks**: Players can use ranged weapons to shoot bullets at enemies.

## Item System
Players can collect different items with varying attributes, such as weapons with different damage outputs, cooldowns, and attack ranges.

## Enemy Behavior
Enemies move autonomously and attack nearby players. Each enemy is spawned when a player joins the match.

## Collision System
The game employs a collision system to handle interactions between players, enemies, bullets, and items.

## Score and Leaderboard
Players earn scores based on their performance in the game. A leaderboard displays the top players based on their scores.

# Code Structure

The game code is organized into several modules:

- **Constants** : Contains shared constants used throughout the game.
- **Objects** : Includes classes for Player, Enemy, Item, Game and more.

I organized the code with two folders. Client and Server.
#### Client
- **Render**: Render all the sprites and bacground.
- **Networking**: Manage all the sockets connections.
- **State**: Interpolate some sprites for a more smooth gameplay and organize the updates from the backend.
- **Leaderboard**: Render and update the leaderboard.
- **Input**: Get the user input and send to the network functions to send to the backend.
- **Inventory**: Render and update the inventory.
- **Index**: Inicialize all the main functions and control the screens like game over and the initial screen.
And the folder have the index.html where all the game is rended and two CSS files.


#### Server
- **Objects**: The server side have objects to control and create new players, enemys, items and bullets.
- **Collisions**: This file make all the checks for collisions, between player, enemys, items and bullets.
- **Game**: Here is all the game logic to create all the objects, control animations, delete players and ect.
- **Server**: This file create the game it self, organize the sockets and initialize the server.

# Technologies
- **Node.js**
- **Express**
- **Socket.io**
- **HTML, JS, CSS**

#### Run
To run the program first you need to download all the packages:
```shell
npm install
```
After this you need to build it:
```shell
npm run build
```
And then start it:
```shell
npm run start
```
And now the server is running on the port 3005!

Have Fun!
