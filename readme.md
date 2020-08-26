## Input Expressions
This module makes it possible to enter mathematical expressions into numeric entry fields. This includes the token HUD, as well as many inputs on character and item sheets. These expressions support basic arithmatic, but also support anything from the [Math.js](https://mathjs.org/) library.

![Example GIF](Expressions.gif)

Additionally, there is a `roll()` helper function, which can be used to roll dice and get the result immediately.
```
roll(3d6)
```
When working with a token/actor, access to the `attributes` and `abilities` objects are also available. For more advanced users, `entity` allows access to the entire Entity, and `data` is a shortcut to its data property.

## Todo: Developer Guide