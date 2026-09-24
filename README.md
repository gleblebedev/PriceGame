# How Many? — The Price Game

A tiny static web game to help a kid build a feel for what money is worth.

Each round shows two random everyday items (say, a litre of milk and a car).
Drag the slider to guess how many of the cheaper one it takes to add up to the
price of the pricier one, then hit **Check my guess** to see how close you
were, scored 0–5 stars.

## Running it

No build step, no server required — just open `index.html` in a browser.
It also works fine when double-clicked from disk (`file://...`), and will
later deploy unchanged to Cloudflare Pages (or any static host) as a set of
plain files.

```
index.html   page structure
style.css    layout + animations
items.js     the price data (window.ITEMS)
game.js      all game logic
```

## About the prices

Prices in `items.js` are **approximate, typical/median prices for Dublin,
Ireland**, rounded to friendly numbers for gameplay — not live data, and not
financial advice. If you want to refresh them, edit `items.js` directly; each
entry is a flat object:

```js
{ id: 'milk', name: 'Milk', caption: '1 litre of milk', emoji: '🥛', image: null, price: 1.35, category: 'food' }
```

- `price` is in euro.
- `caption` is the text shown under the item in the game.
- `emoji` is used as the picture until a real image is supplied.

## Adding real pictures later

Each item has an `image` field, currently `null`. Set it to a path or URL
(e.g. `image: 'images/milk.png'`) and the game will render that `<img>`
instead of the emoji — no other code changes needed. A mix of items with and
without `image` works fine.

## How scoring works

The player's guess and the true price ratio are compared on a **log scale**,
so guessing 2× too high counts the same as 2× too low. The tolerance for each
star band widens for bigger ratios (guessing "how many milks make a car" has
much more natural wiggle room than "chair vs sofa"), and there's a floor so
that two items with almost the same price can still earn 5 stars.

## Game loop

Play is endless. Total ⭐ and a 🔥 streak (rounds scoring 3+ stars in a row)
are kept in `localStorage` and persist across reloads; **reset** in the header
clears them.
