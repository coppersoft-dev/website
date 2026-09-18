(function () {
  var svg = document.getElementById('wire-game');
  var path = document.getElementById('wire-path');
  var stage = document.getElementById('track-stage');
  var panel = document.getElementById('game-panel');
  var wand = document.getElementById('wand');
  var overlay = document.getElementById('game-overlay');
  var title = document.getElementById('overlay-title');
  var resultScore = document.getElementById('result-score');
  var copy = document.getElementById('overlay-copy');
  var icon = document.getElementById('overlay-icon');
  var button = document.getElementById('start-game');
  var stateLabel = document.getElementById('state-label');
  var timeLabel = document.getElementById('game-time');
  var bestLabel = document.getElementById('game-best');
  var hint = document.getElementById('game-hint');
  var celebration = document.getElementById('celebration');

  if (!svg || !path || !stage) return;

  var pathLength = path.getTotalLength();
  var samples = [];
  var state = 'intro';
  var startTime = 0;
  var timer = 0;
  var pointerId = null;
  var lastProgress = 0;
  var tolerance = 25;
  var storageKey = 'coppersoft-wire-loop-best';
  var bestTime = loadBestTime();
  var lastRunWasBest = false;
  var lastElapsed = null;
  var currentElapsed = 0;
  var scrollFrame = 0;
  var pointerClientX = 0;
  var pointerClientY = 0;

  renderBestTime();
  renderCurrentTime();

  for (var distance = 0; distance <= pathLength; distance += 5) {
    var point = path.getPointAtLength(distance);
    samples.push({ x: point.x, y: point.y, distance: distance });
  }
  var endPoint = path.getPointAtLength(pathLength);
  samples.push({ x: endPoint.x, y: endPoint.y, distance: pathLength });

  function language() {
    return document.documentElement.lang === 'de' ? 'de' : 'en';
  }

  function words(en, de) { return language() === 'de' ? de : en; }

  function formatTime(milliseconds) {
    return (milliseconds / 1000).toFixed(1).padStart(4, '0') + words(' seconds', ' Sekunden');
  }

  function loadBestTime() {
    try {
      var stored = Number(window.localStorage.getItem(storageKey));
      return stored > 0 && Number.isFinite(stored) ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function renderBestTime() {
    bestLabel.textContent = bestTime === null ? words('— seconds', '— Sekunden') : formatTime(bestTime);
  }

  function renderCurrentTime() {
    timeLabel.textContent = formatTime(currentElapsed);
  }

  function recordBestTime(milliseconds) {
    lastRunWasBest = bestTime === null || milliseconds < bestTime;
    if (!lastRunWasBest) return;
    bestTime = milliseconds;
    renderBestTime();
    try { window.localStorage.setItem(storageKey, String(milliseconds)); } catch (error) {}
  }

  function renderResultScore() {
    if (state !== 'won' || lastElapsed === null) {
      resultScore.hidden = true;
      return;
    }

    resultScore.hidden = false;
    if (lastRunWasBest) {
      setText(resultScore, 'New personal best: ' + formatTime(lastElapsed), 'Neue Bestzeit: ' + formatTime(lastElapsed));
    } else {
      setText(
        resultScore,
        'Your time: ' + formatTime(lastElapsed) + ' · Best: ' + formatTime(bestTime),
        'Ihre Zeit: ' + formatTime(lastElapsed) + ' · Bestzeit: ' + formatTime(bestTime)
      );
    }
  }

  function setText(element, en, de) {
    element.textContent = words(en, de);
  }

  function pointFromClient(clientX, clientY) {
    var clientPoint = new DOMPoint(clientX, clientY);
    var matrix = svg.getScreenCTM();
    return matrix ? clientPoint.matrixTransform(matrix.inverse()) : { x: 0, y: 0 };
  }

  function nearestOnWire(point) {
    var closest = null;
    var minSquared = Infinity;
    for (var i = 0; i < samples.length; i += 1) {
      var dx = point.x - samples[i].x;
      var dy = point.y - samples[i].y;
      var squared = dx * dx + dy * dy;
      if (squared < minSquared) {
        minSquared = squared;
        closest = samples[i];
      }
    }
    return { point: closest, distance: Math.sqrt(minSquared) };
  }

  function placeWand(point) {
    wand.setAttribute('transform', 'translate(' + point.x.toFixed(1) + ' ' + point.y.toFixed(1) + ')');
  }

  function updateTimer() {
    if (state !== 'running') return;
    currentElapsed = performance.now() - startTime;
    renderCurrentTime();
    timer = requestAnimationFrame(updateTimer);
  }

  function armGame() {
    state = 'armed';
    lastProgress = 0;
    lastRunWasBest = false;
    lastElapsed = null;
    resultScore.hidden = true;
    currentElapsed = 0;
    renderCurrentTime();
    celebration.replaceChildren();
    panel.classList.remove('is-celebrating');
    stage.scrollLeft = 0;
    panel.className = 'game-panel is-armed';
    overlay.classList.add('is-hidden');
    placeWand(samples[0]);
    setText(stateLabel, 'Find the start', 'Zum Start');
    setText(hint, 'Press and hold the ring at START, then trace the wire.', 'Ring bei START gedrückt halten und der Leitung folgen.');
  }

  function begin(event, nearest) {
    if (state !== 'armed' || nearest.point.distance > 45 || nearest.distance > 32) return;
    state = 'running';
    pointerId = event.pointerId;
    stage.setPointerCapture(pointerId);
    startTime = performance.now();
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    panel.className = 'game-panel is-running';
    setText(stateLabel, 'Line active', 'Leitung aktiv');
    setText(hint, 'Stay on the copper. Releasing the pointer breaks the contact.', 'Bleib auf dem Kupfer. Loslassen unterbricht den Kontakt.');
    cancelAnimationFrame(timer);
    updateTimer();
    startAutoScroll();
  }

  function showResult(won) {
    var elapsed = performance.now() - startTime;
    cancelAnimationFrame(timer);
    cancelAnimationFrame(scrollFrame);
    pointerId = null;
    state = won ? 'won' : 'failed';
    panel.className = 'game-panel ' + (won ? 'is-won' : 'is-failed');
    if (won) {
      lastElapsed = elapsed;
      currentElapsed = elapsed;
      renderCurrentTime();
      recordBestTime(elapsed);
      if (lastRunWasBest) panel.classList.add('is-personal-best');
    }
    renderResultScore();
    setText(
      stateLabel,
      won ? (lastRunWasBest ? 'New personal best' : 'Route complete') : 'Contact lost',
      won ? (lastRunWasBest ? 'Neue Bestzeit' : 'Ziel erreicht') : 'Kontakt verloren'
    );
    icon.textContent = won ? '★' : '×';
    setText(title, won ? 'You did it.' : 'Off the line.', won ? 'Geschafft.' : 'Leitung verlassen.');
    setText(
      copy,
      won ? 'With a steady hand, you kept the systems running. Now we wish you a Merry Christmas, peaceful holidays, and a bright new year. Thank you for your trust and partnership.' : 'Reliable routes leave little room for error. Reset and give it another run.',
      won ? 'Mit ruhiger Hand haben Sie die Systeme am Laufen gehalten. Jetzt wünschen wir Ihnen frohe Weihnachten, ruhige Feiertage und einen guten Start ins neue Jahr. Danke für Ihr Vertrauen und die gute Zusammenarbeit.' : 'Verlässliche Wege lassen wenig Raum für Fehler. Zurücksetzen und noch einmal versuchen.'
    );
    button.firstElementChild.textContent = words(won ? 'Run it again' : 'Try again', won ? 'Noch einmal' : 'Erneut versuchen');
    overlay.classList.remove('is-hidden');
    if (won) celebrate();
  }

  function celebrate() {
    if (!celebration) return;

    celebration.replaceChildren();
    panel.classList.remove('is-celebrating');
    void panel.offsetWidth;
    panel.classList.add('is-celebrating');
    var colors = ['#b87333', '#d89456', '#f5f3f0', '#2fa66b'];
    var fragment = document.createDocumentFragment();
    var burst = document.createElement('span');
    burst.className = 'celebration-burst';
    fragment.appendChild(burst);

    var crown = document.createElement('span');
    crown.className = 'christmas-crown';
    crown.textContent = '★';
    fragment.appendChild(crown);

    for (var i = 0; i < 64; i += 1) {
      var particle = document.createElement('i');
      var shape = i % 8;
      particle.className = 'celebration-particle';
      if (shape === 0 || shape === 4) {
        particle.classList.add('is-snowflake');
        particle.textContent = '❄';
      } else if (shape === 2) {
        particle.classList.add('is-star');
        particle.textContent = '✦';
      } else if (shape === 6) {
        particle.classList.add('is-round');
      }
      particle.style.setProperty('--x', (4 + Math.random() * 92).toFixed(1) + '%');
      particle.style.setProperty('--drift', (-90 + Math.random() * 180).toFixed(0) + 'px');
      particle.style.setProperty('--spin', (180 + Math.random() * 720).toFixed(0) + 'deg');
      particle.style.setProperty('--delay', (Math.random() * 620).toFixed(0) + 'ms');
      particle.style.setProperty('--duration', (1450 + Math.random() * 1000).toFixed(0) + 'ms');
      particle.style.setProperty('--flake-size', (12 + Math.random() * 14).toFixed(0) + 'px');
      particle.style.setProperty('--particle-color', colors[i % colors.length]);
      fragment.appendChild(particle);
    }

    celebration.appendChild(fragment);
    window.setTimeout(function () {
      celebration.replaceChildren();
      panel.classList.remove('is-celebrating');
    }, 2800);
  }

  function refreshDynamicLanguage() {
    renderCurrentTime();
    renderBestTime();
    if (state === 'armed') {
      setText(stateLabel, 'Find the start', 'Zum Start');
      setText(hint, 'Press and hold the ring at START, then trace the wire.', 'Ring bei START gedrückt halten und der Leitung folgen.');
    } else if (state === 'running') {
      setText(stateLabel, 'Line active', 'Leitung aktiv');
      setText(hint, 'Stay on the copper. Releasing the pointer breaks the contact.', 'Bleib auf dem Kupfer. Loslassen unterbricht den Kontakt.');
    } else if (state === 'won' || state === 'failed') {
      var won = state === 'won';
      setText(
        stateLabel,
        won ? (lastRunWasBest ? 'New personal best' : 'Route complete') : 'Contact lost',
        won ? (lastRunWasBest ? 'Neue Bestzeit' : 'Ziel erreicht') : 'Kontakt verloren'
      );
      setText(title, won ? 'You did it.' : 'Off the line.', won ? 'Geschafft.' : 'Leitung verlassen.');
      setText(
        copy,
        won ? 'With a steady hand, you kept the systems running. Now we wish you a Merry Christmas, peaceful holidays, and a bright new year. Thank you for your trust and partnership.' : 'Reliable routes leave little room for error. Reset and give it another run.',
        won ? 'Mit ruhiger Hand haben Sie die Systeme am Laufen gehalten. Jetzt wünschen wir Ihnen frohe Weihnachten, ruhige Feiertage und einen guten Start ins neue Jahr. Danke für Ihr Vertrauen und die gute Zusammenarbeit.' : 'Verlässliche Wege lassen wenig Raum für Fehler. Zurücksetzen und noch einmal versuchen.'
      );
      button.firstElementChild.textContent = words(won ? 'Run it again' : 'Try again', won ? 'Noch einmal' : 'Erneut versuchen');
      renderResultScore();
    }
  }

  function move(event) {
    if (state !== 'armed' && state !== 'running') return;
    var rawPoint = pointFromClient(event.clientX, event.clientY);
    var nearest = nearestOnWire(rawPoint);

    if (state === 'armed') {
      if (nearest.point.distance < 45) placeWand(nearest.point);
      return;
    }

    if (event.pointerId !== pointerId) return;
    event.preventDefault();
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    evaluateRunningPoint(rawPoint, nearest);
  }

  function evaluateRunningPoint(rawPoint, nearest) {
    if (state !== 'running') return;
    placeWand(rawPoint);

    var progress = nearest.point.distance / pathLength;
    var movedBackTooFar = progress < lastProgress - .055;
    if (nearest.distance > tolerance || movedBackTooFar) {
      showResult(false);
      return;
    }

    lastProgress = Math.max(lastProgress, progress);
    if (progress > .985) showResult(true);
  }

  function startAutoScroll() {
    cancelAnimationFrame(scrollFrame);

    function autoScroll() {
      if (state !== 'running' || typeof pointerId !== 'number') return;

      var rect = stage.getBoundingClientRect();
      var edgeWidth = Math.min(72, rect.width * .22);
      var edgeStart = rect.right - edgeWidth;
      var available = stage.scrollWidth - stage.clientWidth - stage.scrollLeft;

      if (pointerClientX > edgeStart && available > 0) {
        var intensity = Math.min(1, (pointerClientX - edgeStart) / edgeWidth);
        var previousScroll = stage.scrollLeft;
        stage.scrollLeft += .75 + intensity * 1.5;

        if (stage.scrollLeft !== previousScroll) {
          var rawPoint = pointFromClient(pointerClientX, pointerClientY);
          evaluateRunningPoint(rawPoint, nearestOnWire(rawPoint));
        }
      }

      if (state === 'running') scrollFrame = requestAnimationFrame(autoScroll);
    }

    scrollFrame = requestAnimationFrame(autoScroll);
  }

  function release(event) {
    if (state === 'running' && event.pointerId === pointerId) showResult(false);
  }

  button.addEventListener('click', armGame);
  stage.addEventListener('pointerdown', function (event) {
    if (state !== 'armed') return;
    var nearest = nearestOnWire(pointFromClient(event.clientX, event.clientY));
    begin(event, nearest);
  });
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', function () {
    if (state === 'running') showResult(false);
  });
  document.querySelectorAll('.langswitch button').forEach(function (languageButton) {
    languageButton.addEventListener('click', function () {
      document.querySelectorAll('[data-svg-en][data-svg-de]').forEach(function (element) {
        element.textContent = element.getAttribute('data-svg-' + languageButton.getAttribute('data-lang'));
      });
      refreshDynamicLanguage();
    });
  });
})();
