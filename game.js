// "How Many?" price game — all game logic. No modules, no build step, works from file://.
(function () {
  'use strict';

  // ---------- constants ----------
  var MAX_LOG = 9.5;          // log10 of the biggest ratio the slider can reach
  var CURVE = 1.6;            // slider is non-linear: more precision near the middle
  var MAX_VISUAL_ICONS = 30;  // cap on how many emoji we actually draw per side

  var ANIMALS = [
    '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🐶', '🐱',
    '🐰', '🐹', '🐷', '🐮', '🐔', '🦉', '🐺', '🦄', '🐙', '🐧'
  ];

  // ---------- nice numbers ----------
  var NICE_MULTIPLIERS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8];
  var NICE_NUMBERS = buildNiceNumbers();
  var ALL_STEPS = buildAllSteps(); // signed log10 values reachable by the slider, sorted

  function buildNiceNumbers() {
    var set = {};
    var out = [];
    for (var decade = 0; decade <= 9; decade++) {
      for (var i = 0; i < NICE_MULTIPLIERS.length; i++) {
        var raw = NICE_MULTIPLIERS[i] * Math.pow(10, decade);
        var val = raw < 10 ? Math.round(raw * 10) / 10 : Math.round(raw);
        if (!set[val]) { set[val] = true; out.push(val); }
      }
    }
    out.sort(function (a, b) { return a - b; });
    return out;
  }

  function buildAllSteps() {
    var out = [0];
    for (var i = 0; i < NICE_NUMBERS.length; i++) {
      var n = NICE_NUMBERS[i];
      if (n > 1) {
        var l = Math.log10(n);
        out.push(l, -l);
      }
    }
    out.sort(function (a, b) { return a - b; });
    return out;
  }

  function snapToNice(x) {
    if (x <= 1) return 1;
    var best = NICE_NUMBERS[0], bestDist = Infinity, lx = Math.log(x);
    for (var i = 0; i < NICE_NUMBERS.length; i++) {
      var d = Math.abs(Math.log(NICE_NUMBERS[i]) - lx);
      if (d < bestDist) { bestDist = d; best = NICE_NUMBERS[i]; }
    }
    return best;
  }

  function roundSig(x, sig) {
    if (x === 0) return 0;
    var d = Math.ceil(Math.log10(Math.abs(x)));
    var power = sig - d;
    var mag = Math.pow(10, power);
    return Math.round(x * mag) / mag;
  }

  // ---------- slider <-> ratio mapping ----------
  // s in [-1, 1]. s < 0 => N copies of the LEFT item = 1 right item.
  //               s > 0 => N copies of the RIGHT item = 1 left item.
  function sliderToGuess(s) {
    var sign = s < 0 ? -1 : (s > 0 ? 1 : 0);
    var a = Math.abs(s);
    var log10N = MAX_LOG * Math.pow(a, CURVE);
    var raw = Math.pow(10, log10N);
    var N = sign === 0 ? 1 : snapToNice(raw);
    return { sign: sign, N: N };
  }

  // guessR = priceRight / priceLeft implied by a slider guess
  function guessToRatio(g) {
    if (g.sign < 0) return g.N;
    if (g.sign > 0) return 1 / g.N;
    return 1;
  }

  function stepGuess(direction) {
    var s = Number(slider.value) / 1000;
    var g = sliderToGuess(s);
    var currentLog = g.sign === 0 ? 0 : g.sign * Math.log10(g.N);
    var idx = nearestStepIndex(currentLog);
    var newIdx = idx + direction;
    if (newIdx < 0) newIdx = 0;
    if (newIdx > ALL_STEPS.length - 1) newIdx = ALL_STEPS.length - 1;
    var newLog = ALL_STEPS[newIdx];
    var sign = newLog === 0 ? 0 : (newLog < 0 ? -1 : 1);
    var a = sign === 0 ? 0 : Math.pow(Math.abs(newLog) / MAX_LOG, 1 / CURVE);
    var newS = sign * Math.min(a, 1);
    slider.value = String(Math.round(newS * 1000));
    onSliderInput();
  }

  function nearestStepIndex(v) {
    var best = 0, bestDist = Infinity;
    for (var i = 0; i < ALL_STEPS.length; i++) {
      var d = Math.abs(ALL_STEPS[i] - v);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  // ---------- formatting ----------
  function trimNum(x) {
    var r = Math.round(x * 10) / 10;
    return r.toString();
  }

  function formatNumber(n) {
    if (n >= 1e9) return trimNum(n / 1e9) + ' billion';
    if (n >= 1e6) return trimNum(n / 1e6) + ' million';
    if (n >= 1000) return Math.round(n).toLocaleString('en-IE');
    if (Number.isInteger(n)) return String(n);
    return trimNum(n);
  }

  function formatPrice(p) {
    if (p >= 1e6) return '€' + formatNumber(p);
    if (p >= 1000) return '€' + Math.round(p).toLocaleString('en-IE');
    if (p < 10) return '€' + p.toFixed(2);
    return '€' + Math.round(p).toLocaleString('en-IE');
  }

  // ---------- DOM refs ----------
  var roundLabel = document.getElementById('roundLabel');
  var turnBanner = document.getElementById('turnBanner');

  var leftGroup = document.getElementById('leftGroup');
  var rightGroup = document.getElementById('rightGroup');
  var leftBadge = document.getElementById('leftBadge');
  var rightBadge = document.getElementById('rightBadge');
  var leftCaption = document.getElementById('leftCaption');
  var rightCaption = document.getElementById('rightCaption');

  var guessText = document.getElementById('guessText');
  var sliderArea = document.getElementById('sliderArea');
  var slider = document.getElementById('slider');
  var btnMinus = document.getElementById('btnMinus');
  var btnPlus = document.getElementById('btnPlus');
  var labelLeft = document.getElementById('labelLeft');
  var labelRight = document.getElementById('labelRight');

  var btnCheck = document.getElementById('btnCheck');
  var btnNextPlayer = document.getElementById('btnNextPlayer');
  var btnNext = document.getElementById('btnNext');

  var summaryPanel = document.getElementById('summaryPanel');
  var summaryList = document.getElementById('summaryList');

  var playersList = document.getElementById('playersList');
  var btnAddPlayer = document.getElementById('btnAddPlayer');

  // ---------- state ----------
  var state = {
    left: null,
    right: null,
    recentIds: [],
    players: [],       // persistent roster: {id, animal}
    nextPlayerId: 1,
    roundOrder: [],     // snapshot of players for the current round: {id, animal}
    turnIndex: 0,
    results: {},        // playerId -> {stars, sign, N}
    roundNumber: 0,
    phase: 'guessing'   // 'guessing' | 'result' | 'summary'
  };
  var rafPending = false;

  // ---------- players ----------
  function pickUnusedAnimal() {
    var used = state.players.map(function (p) { return p.animal; });
    var available = ANIMALS.filter(function (a) { return used.indexOf(a) === -1; });
    if (available.length === 0) return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return available[Math.floor(Math.random() * available.length)];
  }

  function addPlayer() {
    if (state.players.length >= ANIMALS.length) return;
    state.players.push({ id: state.nextPlayerId++, animal: pickUnusedAnimal() });
    renderPlayersBar();
  }

  function removePlayer(id) {
    if (state.players.length <= 1) return;
    state.players = state.players.filter(function (p) { return p.id !== id; });
    renderPlayersBar();
  }

  function renderPlayersBar() {
    playersList.innerHTML = '';
    state.players.forEach(function (p, idx) {
      var chip = document.createElement('span');
      chip.className = 'player-chip';

      var emoji = document.createElement('span');
      emoji.className = 'player-emoji';
      emoji.textContent = p.animal;
      chip.appendChild(emoji);

      var name = document.createElement('span');
      name.className = 'player-name';
      name.textContent = 'Player ' + (idx + 1);
      chip.appendChild(name);

      if (state.players.length > 1) {
        var removeBtn = document.createElement('button');
        removeBtn.className = 'player-remove';
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', 'Remove player');
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function () { removePlayer(p.id); });
        chip.appendChild(removeBtn);
      }

      playersList.appendChild(chip);
    });
    btnAddPlayer.disabled = state.players.length >= ANIMALS.length;
  }

  btnAddPlayer.addEventListener('click', addPlayer);

  // ---------- pair picking ----------
  function randomItem() {
    return window.ITEMS[Math.floor(Math.random() * window.ITEMS.length)];
  }

  function ratioTooClose(a, b) {
    var r = b.price / a.price;
    return Math.max(r, 1 / r) < 1.05;
  }

  function pickPair() {
    var left, right, tries = 0;
    do {
      left = randomItem();
      right = randomItem();
      tries++;
    } while (
      tries < 60 && (
        left.id === right.id ||
        state.recentIds.indexOf(left.id) !== -1 ||
        state.recentIds.indexOf(right.id) !== -1 ||
        ratioTooClose(left, right)
      )
    );
    var RECENT_HISTORY = 6;
    state.recentIds = [left.id, right.id].concat(state.recentIds).slice(0, RECENT_HISTORY);
    return { left: left, right: right };
  }

  // ---------- rendering: emoji groups ----------
  function sizeClassFor(n) {
    if (n <= 1) return 'size-xl';
    if (n <= 6) return 'size-lg';
    if (n <= 15) return 'size-md';
    return 'size-sm';
  }

  function makeIconEl(item) {
    var el;
    if (item.image) {
      el = document.createElement('img');
      el.src = item.image;
      el.alt = item.name;
      el.className = 'item-icon';
    } else {
      el = document.createElement('span');
      el.className = 'item-icon';
      el.textContent = item.emoji;
    }
    return el;
  }

  // full animated visualization: draws `count` copies, growing/shrinking with a pop animation
  function renderGroup(groupEl, badgeEl, item, count) {
    var visual = Math.max(1, Math.min(MAX_VISUAL_ICONS, Math.round(count)));
    var sizeClass = sizeClassFor(visual);
    groupEl.className = 'item-emoji-group ' + sizeClass;

    var current = groupEl.children.length;

    if (visual > current) {
      for (var i = current; i < visual; i++) {
        var el = makeIconEl(item);
        el.classList.add('pop-in');
        el.style.animationDelay = (Math.min(i - current, 20) * 15) + 'ms';
        groupEl.appendChild(el);
      }
    } else if (visual < current) {
      var toRemove = Array.prototype.slice.call(groupEl.children, visual);
      toRemove.forEach(function (child, idx) {
        child.classList.remove('pop-in');
        child.classList.add('pop-out');
        child.style.animationDelay = (idx * 10) + 'ms';
      });
      setTimeout(function () {
        toRemove.forEach(function (child) {
          if (child.parentNode === groupEl) groupEl.removeChild(child);
        });
      }, 220);
    }

    if (count > MAX_VISUAL_ICONS) {
      badgeEl.textContent = '× ' + formatNumber(Math.round(count));
      badgeEl.classList.remove('badge-hidden');
    } else {
      badgeEl.classList.add('badge-hidden');
    }
  }

  // simplified static view (no counting animation) — used for every player after the first
  function renderStatic(groupEl, badgeEl, item) {
    if (groupEl.children.length !== 1 || groupEl.dataset.itemId !== item.id) {
      groupEl.className = 'item-emoji-group size-xl';
      groupEl.innerHTML = '';
      groupEl.appendChild(makeIconEl(item));
      groupEl.dataset.itemId = item.id;
    }
    badgeEl.classList.add('badge-hidden');
  }

  function isVisualTurn() {
    return state.turnIndex === 0;
  }

  // ---------- main round rendering ----------
  function renderRoundStatic() {
    leftCaption.textContent = state.left.caption;
    rightCaption.textContent = state.right.caption;
    labelLeft.textContent = 'more ' + state.left.emoji;
    labelRight.textContent = 'more ' + state.right.emoji;
    leftGroup.innerHTML = '';
    rightGroup.innerHTML = '';
    delete leftGroup.dataset.itemId;
    delete rightGroup.dataset.itemId;
  }

  function scheduleUpdateGuess() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      updateGuessDisplay();
    });
  }

  function updateGuessDisplay() {
    var s = Number(slider.value) / 1000;
    var g = sliderToGuess(s);
    var leftCount = g.sign < 0 ? g.N : 1;
    var rightCount = g.sign > 0 ? g.N : 1;

    if (isVisualTurn()) {
      renderGroup(leftGroup, leftBadge, state.left, leftCount);
      renderGroup(rightGroup, rightBadge, state.right, rightCount);
    } else {
      renderStatic(leftGroup, leftBadge, state.left);
      renderStatic(rightGroup, rightBadge, state.right);
    }

    guessText.innerHTML =
      '<strong>' + formatNumber(leftCount) + '</strong> ' + state.left.emoji +
      ' &nbsp;=&nbsp; ' +
      '<strong>' + formatNumber(rightCount) + '</strong> ' + state.right.emoji;
  }

  function onSliderInput() {
    scheduleUpdateGuess();
  }

  slider.addEventListener('input', onSliderInput);
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      stepGuess(-1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      stepGuess(1);
    }
  });
  btnMinus.addEventListener('click', function () { stepGuess(-1); });
  btnPlus.addEventListener('click', function () { stepGuess(1); });

  // ---------- scoring ----------
  var STAR_BASE_P = [0.10, 0.20, 0.35, 0.60, 1.00]; // 5,4,3,2,1 stars
  var STAR_BASE_LN = STAR_BASE_P.map(function (p) { return Math.log(1 + p); });

  function findNiceFloor(M) {
    // half the (log-space) gap between the nice numbers straddling M
    var lower = NICE_NUMBERS[0], upper = NICE_NUMBERS[NICE_NUMBERS.length - 1];
    for (var i = 0; i < NICE_NUMBERS.length; i++) {
      if (NICE_NUMBERS[i] <= M) lower = NICE_NUMBERS[i];
      if (NICE_NUMBERS[i] >= M) { upper = NICE_NUMBERS[i]; break; }
    }
    if (upper === lower) return Math.log(1.05);
    return (Math.log(upper) - Math.log(lower)) / 2;
  }

  function computeStars(guessR, actualR) {
    var err = Math.abs(Math.log(guessR / actualR));
    var M = Math.max(actualR, 1 / actualR);
    var f = 1 + 0.35 * Math.log10(M);
    var floorLn = findNiceFloor(M);
    for (var i = 0; i < STAR_BASE_LN.length; i++) {
      var tol = Math.max(STAR_BASE_LN[i], floorLn) * f;
      if (err <= tol) return 5 - i;
    }
    return 0;
  }

  function starsMarkup(stars) {
    var out = '';
    for (var i = 0; i < 5; i++) out += i < stars ? '⭐' : '☆';
    return out;
  }

  // ---------- turn flow ----------
  function currentRoundPlayer() {
    return state.roundOrder[state.turnIndex];
  }

  function startTurn() {
    state.phase = 'guessing';
    var p = currentRoundPlayer();
    var isLast = state.turnIndex === state.roundOrder.length - 1;
    turnBanner.textContent = p.animal + ' Player ' + (state.turnIndex + 1) + '’s turn';

    slider.value = '0';
    slider.disabled = false;
    btnMinus.disabled = false;
    btnPlus.disabled = false;

    // "Check my guess" only shows up for the last player to go — that's the
    // only moment every guess is in, so it's also the only moment the
    // correct answer can be revealed. Everyone before that just locks in
    // their guess and hands off to the next player.
    btnCheck.classList.toggle('hidden', !isLast);
    btnCheck.disabled = false;
    btnNextPlayer.classList.toggle('hidden', isLast);
    btnNextPlayer.disabled = false;
    btnNext.classList.add('hidden');

    summaryPanel.classList.add('hidden');
    sliderArea.classList.remove('hidden');

    renderRoundStatic();
    updateGuessDisplay();
  }

  // records the current player's guess (and how many stars it's worth) without revealing anything
  function recordGuess() {
    var s = Number(slider.value) / 1000;
    var g = sliderToGuess(s);
    var guessR = guessToRatio(g);
    var actualR = state.right.price / state.left.price;
    var stars = computeStars(guessR, actualR);

    var p = currentRoundPlayer();
    state.results[p.id] = { stars: stars, sign: g.sign, N: g.N };
  }

  btnNextPlayer.addEventListener('click', function () {
    if (state.phase !== 'guessing') return;
    recordGuess();
    state.turnIndex++;
    startTurn();
  });

  btnCheck.addEventListener('click', function () {
    if (state.phase !== 'guessing') return;
    recordGuess();
    showSummary();
  });

  function showSummary() {
    state.phase = 'summary';
    turnBanner.textContent = '🏁 Round results';

    sliderArea.classList.add('hidden');
    btnCheck.classList.add('hidden');
    btnNextPlayer.classList.add('hidden');
    btnNext.classList.remove('hidden');

    var actualR = state.right.price / state.left.price;
    var actualSign = actualR >= 1 ? -1 : 1;
    var actualN = actualR >= 1 ? actualR : 1 / actualR;
    var trueLeftCount = actualSign < 0 ? roundSig(actualN, 3) : 1;
    var trueRightCount = actualSign > 0 ? roundSig(actualN, 3) : 1;

    renderGroup(leftGroup, leftBadge, state.left, trueLeftCount);
    renderGroup(rightGroup, rightBadge, state.right, trueRightCount);

    guessText.innerHTML =
      formatPrice(state.left.price) + ' ' + state.left.emoji + ' &nbsp;·&nbsp; ' +
      formatPrice(state.right.price) + ' ' + state.right.emoji + '<br>' +
      'Really: <strong>' + formatNumber(trueLeftCount) + '</strong> ' + state.left.emoji +
      ' = <strong>' + formatNumber(trueRightCount) + '</strong> ' + state.right.emoji;

    var maxStars = -1;
    state.roundOrder.forEach(function (p) {
      var r = state.results[p.id];
      if (r && r.stars > maxStars) maxStars = r.stars;
    });

    summaryList.innerHTML = '';
    state.roundOrder.forEach(function (p, idx) {
      var r = state.results[p.id];
      var row = document.createElement('div');
      row.className = 'summary-row';

      var who = document.createElement('span');
      who.className = 'summary-who';
      who.textContent = p.animal + ' Player ' + (idx + 1) + (r && r.stars === maxStars ? ' 🏆' : '');
      row.appendChild(who);

      var guess = document.createElement('span');
      guess.className = 'summary-guess';
      if (r) {
        var lc = r.sign < 0 ? r.N : 1;
        var rc = r.sign > 0 ? r.N : 1;
        guess.textContent = formatNumber(lc) + ' ' + state.left.emoji + ' = ' + formatNumber(rc) + ' ' + state.right.emoji;
      } else {
        guess.textContent = 'no guess';
      }
      row.appendChild(guess);

      var stars = document.createElement('span');
      stars.className = 'summary-stars';
      stars.textContent = r ? starsMarkup(r.stars) : '';
      row.appendChild(stars);

      summaryList.appendChild(row);
    });

    summaryPanel.classList.remove('hidden');
  }

  btnNext.addEventListener('click', nextRound);

  function nextRound() {
    var pair = pickPair();
    state.left = pair.left;
    state.right = pair.right;
    state.roundOrder = state.players.map(function (p) { return { id: p.id, animal: p.animal }; });
    state.results = {};
    state.turnIndex = 0;
    state.roundNumber += 1;
    roundLabel.textContent = 'Round ' + state.roundNumber;
    startTurn();
  }

  // ---------- init ----------
  addPlayer();
  nextRound();
})();
