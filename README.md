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

# Technologies
- **Node.js** 
- **Express** 
- **Scoket.io** 
- **HTML, JS, CSS** 


