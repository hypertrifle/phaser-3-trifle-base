# Phaser 3 Webpack Project Template

Based off of [Richard Davey's Phaser 3 Webpack Project Template](https://github.com/photonstorm/phaser3-project-template)

Originally planed & written by [Rich Searle](//hypertrifle.com) for SpongeUK, since then I have removed any unnicery code that I deemed bloated on not useful for small game projects (any any contributuions from sponge)

All this work is my own, (with help from the Phaser commuity and is completly unlicenced, )

why not `npm i` ?

## To Remove

- HyperScorm - or move to more suitible repo
- interfaces? remove this package?
- single save / game model, (lets not load from JSON files unless required)
- HUD overlay / system and  model is a good Idea in practive but not needed for now.

## To Fix

- rmeove sponge refernces from plgings / scenes etc.
- convert interaces to classes - I can't see of any overhead, but allows us default values, and the abilitiy to define getters and setters, potentailly tieing into VueJS's 'reactive' natiure..

## to Add

- revisit package.json - are all these commands needed?
- error checking on loading both atlas types (and a configuration?)
- revisit webpack config
- requiring image files.
