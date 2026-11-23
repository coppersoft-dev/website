(function () {
  var svg = document.getElementById('wire-game');
  var path = document.getElementById('wire-path');
  var pathShadow = document.getElementById('wire-shadow');
  var activeGlow = document.getElementById('wire-active-glow');
  var fog = document.getElementById('fog-cloud');
  var stage = document.getElementById('track-stage');
  var panel = document.getElementById('game-panel');
  var touchpad = document.getElementById('game-touchpad');
  var mobileLayout = window.matchMedia('(max-width: 560px)');
  var steerDirection = 0;
  var steerPointers = {};
  var forwardPaused = false;
  var forwardSpeed = 12;
  var acceleratedSpeed = 36;
  var accelerating = false;
  var currentForwardSpeed = forwardSpeed;
  var steeringSpeed = 78;
  var steeringVelocity = 0;
  var joystickFrame = 0;
  var joystickLastTime = 0;
  var joystickSpeed = 60;
  var mobileCameraOffset = 0;
  var trackCanvas = stage.querySelector('.track-canvas');
  var wand = document.getElementById('wand');
  var spark = document.getElementById('spark');
  var overlay = document.getElementById('game-overlay');
  var title = document.getElementById('overlay-title');
  var copy = document.getElementById('overlay-copy');
  var icon = document.getElementById('overlay-icon');
  var button = document.getElementById('start-game');
  var stateLabel = document.getElementById('state-label');
  var timeLabel = document.getElementById('game-time');
  var bestLabel = document.getElementById('game-best');
  var dayTextLabel = document.getElementById('game-day-label');
  var dayChooser = document.getElementById('game-day-chooser');
  var dayTrigger = document.getElementById('game-day-trigger');
  var dayLabel = document.getElementById('game-day-value');
  var dayMenu = document.getElementById('game-day-menu');
  var dayGrid = document.getElementById('game-day-grid');
  var doorTooltip = document.getElementById('door-tooltip');
  var hint = document.getElementById('game-hint');
  var celebration = document.getElementById('celebration');
  var celebrationTimer = 0;
  var celebrationFrame = 0;

  if (!svg || !path || !stage) return;

  /* Fixed Advent calendar: one route for every day from December 1 through 24. */
  var DAILY_LOOPS = {
    1: [[74,190],[170,190],[215,292],[305,292],[350,104],[440,104],[490,320],[570,320],[615,196],[690,260],[770,260],[805,48],[900,48],[925,247],[984,247]],
    2: [[74,190],[145,190],[185,76],[270,76],[315,265],[390,265],[435,126],[520,126],[565,306],[650,306],[700,174],[775,174],[820,62],[900,62],[935,247],[984,247]],
    3: [[74,190],[150,190],[190,310],[275,310],[315,155],[385,155],[425,54],[510,54],[555,280],[635,280],[680,112],[760,112],[805,305],[890,305],[930,247],[984,247]],
    4: [[74,190],[135,190],[180,112],[245,112],[290,292],[365,292],[410,78],[490,78],[535,242],[610,242],[655,325],[735,325],[780,142],[860,142],[910,247],[984,247]],
    5: [[74,190],[155,190],[200,52],[285,52],[330,218],[405,218],[450,316],[530,316],[575,135],[650,135],[695,274],[770,274],[815,82],[900,82],[940,247],[984,247]],
    6: [[74,190],[140,190],[180,270],[255,270],[300,122],[380,122],[425,292],[505,292],[550,72],[630,72],[675,225],[755,225],[800,326],[875,326],[925,247],[984,247]],
    7: [[74,190],[165,190],[205,98],[285,98],[330,318],[410,318],[455,170],[525,170],[570,48],[650,48],[695,286],[775,286],[820,148],[900,148],[940,247],[984,247]],
    8: [[74,190],[140,190],[185,320],[270,320],[315,66],[400,66],[445,238],[525,238],[570,120],[650,120],[695,314],[780,314],[825,92],[905,92],[940,247],[984,247]],
    9: [[74,190],[155,190],[200,135],[270,135],[315,44],[395,44],[440,302],[525,302],[570,162],[640,162],[685,260],[765,260],[810,58],[895,58],[935,247],[984,247]],
    10: [[74,190],[135,190],[180,64],[260,64],[305,300],[390,300],[435,148],[510,148],[555,252],[630,252],[675,90],[755,90],[800,318],[885,318],[930,247],[984,247]],
    11: [[74,190],[150,190],[195,282],[275,282],[320,88],[400,88],[445,330],[525,330],[570,188],[645,188],[690,50],[770,50],[815,278],[895,278],[935,247],[984,247]],
    12: [[74,190],[145,190],[190,46],[275,46],[320,208],[395,208],[440,294],[520,294],[565,82],[650,82],[695,238],[770,238],[815,326],[895,326],[935,247],[984,247]],
    13: [[74,190],[165,190],[210,314],[290,314],[335,128],[410,128],[455,38],[535,38],[580,266],[660,266],[705,118],[780,118],[825,298],[900,298],[940,247],[984,247]],
    14: [[74,190],[140,190],[185,104],[255,104],[300,246],[375,246],[420,56],[505,56],[550,326],[630,326],[675,178],[750,178],[795,72],[880,72],[925,247],[984,247]],
    15: [[74,190],[150,190],[195,324],[280,324],[325,176],[400,176],[445,82],[525,82],[570,286],[650,286],[695,42],[775,42],[820,214],[895,214],[935,247],[984,247]],
    16: [[74,190],[135,190],[180,228],[250,228],[295,42],[380,42],[425,274],[505,274],[550,116],[625,116],[670,324],[755,324],[800,160],[875,160],[925,247],[984,247]],
    17: [[74,190],[160,190],[205,70],[285,70],[330,326],[410,326],[455,142],[530,142],[575,242],[650,242],[695,52],[780,52],[825,290],[905,290],[940,247],[984,247]],
    18: [[74,190],[145,190],[190,300],[270,300],[315,48],[400,48],[445,202],[520,202],[565,320],[650,320],[695,132],[770,132],[815,268],[895,268],[935,247],[984,247]],
    19: [[74,190],[155,190],[200,118],[270,118],[315,304],[395,304],[440,62],[525,62],[570,224],[645,224],[690,328],[770,328],[815,96],[900,96],[940,247],[984,247]],
    20: [[74,190],[140,190],[185,52],[265,52],[310,256],[385,256],[430,112],[510,112],[555,314],[635,314],[680,70],[760,70],[805,230],[885,230],[930,247],[984,247]],
    21: [[74,190],[165,190],[210,286],[290,286],[335,74],[415,74],[460,328],[540,328],[585,154],[655,154],[700,48],[780,48],[825,274],[900,274],[940,247],[984,247]],
    22: [[74,190],[145,190],[190,82],[270,82],[315,318],[400,318],[445,164],[520,164],[565,46],[650,46],[695,286],[775,286],[820,126],[895,126],[935,247],[984,247]],
    23: [[74,190],[155,190],[200,326],[285,326],[330,102],[405,102],[450,246],[525,246],[570,58],[655,58],[700,314],[785,314],[830,172],[905,172],[940,247],[984,247]],
    24: [[74,190],[140,190],[185,58],[265,58],[310,324],[395,324],[440,94],[520,94],[565,278],[645,278],[690,44],[775,44],[820,310],[900,310],[940,247],[984,247]]
  };

  var today = new Date();
  var requestedDay = getRequestedAdventDay();
  var latestAvailableDay = getLatestAvailableDay(today);
  var lastSelectableDay = requestedDay === null ? latestAvailableDay : requestedDay;
  var selectedPastDay = getSelectedPastDay(lastSelectableDay);
  var isPrelaunch = requestedDay === null && latestAvailableDay === 0;
  var adventDay = selectedPastDay || requestedDay || latestAvailableDay || 1;
  var dailyPath = createRoundedPath(DAILY_LOOPS[adventDay]);
  path.setAttribute('d', dailyPath);
  pathShadow.setAttribute('d', dailyPath);
  activeGlow.setAttribute('d', dailyPath);
  populateDaySelector(lastSelectableDay, adventDay);
  document.body.setAttribute('data-advent-day', String(adventDay));

  var pathLength = path.getTotalLength();
  var samples = [];
  var state = isPrelaunch ? 'prelaunch' : 'intro';
  var startTime = 0;
  var timer = 0;
  var pointerId = null;
  var lastProgress = 0;
  // Inner edge of the loop minus half the visible wire width.
  var contactDistance = 20 - 5 / 2 - 4.5 / 2;
  var storageKey = 'coppersoft-wire-loop-best-day-' + adventDay;
  var bestTime = loadBestTime();
  var lastRunWasBest = false;
  var currentElapsed = 0;
  var scrollFrame = 0;
  var pointerClientX = 0;
  var pointerClientY = 0;
  var pointerActive = false;
  var activePointerType = '';
  var touchOffsetX = 0;
  var touchOffsetY = 0;
  var sparkEnabled = true;
  var sparkCount = Math.min(4, 1 + Math.floor((adventDay - 1) / 6));
  var sparks = [];
  var sparkFrame = 0;
  var sparkStarted = 0;
  var lastSparkDecoration = -Infinity;
  var currentWandPoint = null;
  var lastFailureWasSpark = false;
  var nextFogAt = 0;
  var fogUntil = 0;
  var fogCount = adventDay < 7 ? 0 : 1 + Math.floor((adventDay - 7) / 6);
  var fogClouds = fogCount ? [fog] : [];

  for (var fogIndex = 1; fogIndex < fogCount; fogIndex += 1) {
    var extraFog = fog.cloneNode(true);
    extraFog.removeAttribute('id');
    fog.parentNode.insertBefore(extraFog, fog.nextSibling);
    fogClouds.push(extraFog);
  }

  function scheduleFog(elapsed) {
    var maxDelay = 5000 - Math.max(0, adventDay - 7) * (3000 / 17);
    nextFogAt = elapsed + 1000 + Math.random() * (maxDelay - 1000);
  }

  function updateFog(elapsed) {
    if (!fogCount) return;
    if (elapsed >= nextFogAt) {
      var earliest = Math.max(.1, lastProgress + .03);
      if (earliest >= .98) {
        scheduleFog(elapsed);
        panel.classList.remove('has-fog');
        return;
      }
      fogClouds.forEach(function (cloud, index) {
        var segmentStart = earliest + (.98 - earliest) * index / fogCount;
        var segmentEnd = earliest + (.98 - earliest) * (index + 1) / fogCount;
        var fogProgress = segmentStart + Math.random() * (segmentEnd - segmentStart);
        var point = path.getPointAtLength(pathLength * fogProgress);
        cloud.setAttribute('transform', 'translate(' + point.x.toFixed(1) + ' ' + point.y.toFixed(1) + ')');
      });
      fogUntil = elapsed + 3000;
      scheduleFog(fogUntil);
    }
    panel.classList.toggle('has-fog', elapsed < fogUntil);
  }

  if (sparkEnabled) {
    for (var sparkIndex = 0; sparkIndex < sparkCount; sparkIndex += 1) {
      var sparkElement = sparkIndex === 0 ? spark : spark.cloneNode(true);
      var flickerElement = sparkElement.querySelector('#spark-flicker');
      if (sparkIndex > 0) {
        sparkElement.removeAttribute('id');
        flickerElement.removeAttribute('id');
        spark.parentNode.insertBefore(sparkElement, wand);
      }
      var particles = [];
      for (var particleIndex = 0; particleIndex < 12; particleIndex += 1) {
        var particle = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        particle.setAttribute('class', 'spark-particle');
        flickerElement.insertBefore(particle, flickerElement.firstChild);
        particles.push(particle);
      }
      sparkElement.setAttribute('visibility', 'visible');
      sparks.push({ element: sparkElement, flicker: flickerElement, raysA: flickerElement.querySelector('.spark-rays-a'), raysB: flickerElement.querySelector('.spark-rays-b'), particles: particles, point: null, progress: sparkCount === 1 ? .54 : .23 + .54 * sparkIndex / (sparkCount - 1) });
    }
    placeSpark(0);
  }

  renderBestTime();
  renderCurrentTime();
  if (isPrelaunch) renderPrelaunch();

  function getRequestedAdventDay() {
    var hostname = window.location.hostname.toLowerCase();
    var isLocal = window.location.protocol === 'file:' || hostname === 'localhost' ||
      hostname.endsWith('.localhost') || hostname === '127.0.0.1' || hostname === '[::1]' || hostname === 'ollwiller';
    if (!isLocal) return null;

    var requestedDay = Number(new URLSearchParams(window.location.search).get('day'));
    if (Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= 24) {
      return requestedDay;
    }

    return null;
  }

  function getLatestAvailableDay(date) {
    if (date.getMonth() !== 11) return 0;
    return Math.min(24, Math.max(1, date.getDate()));
  }

  function getSelectedPastDay(lastAvailableDay) {
    var selectedDay = Number(new URLSearchParams(window.location.search).get('playDay'));
    if (Number.isInteger(selectedDay) && selectedDay >= 1 && selectedDay <= lastAvailableDay) {
      return selectedDay;
    }

    return null;
  }

  function populateDaySelector(lastDay, selectedDay) {
    var doorOrder = [17,2,23,8,5,14,1,20,11,24,7,16,21,4,13,9,18,6,22,10,3,15,12,19];
    dayGrid.replaceChildren();
    dayLabel.textContent = String(selectedDay).padStart(2, '0') + ' / 24';
    doorOrder.forEach(function (day) {
      var option = document.createElement('button');
      option.type = 'button';
      option.className = 'game-day-option';
      option.dataset.day = String(day);
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(day === selectedDay));
      option.setAttribute('aria-disabled', String(day > lastDay));
      if (day > lastDay) option.classList.add('is-locked');
      option.textContent = String(day).padStart(2, '0');
      dayGrid.appendChild(option);
    });
    dayMenu.querySelectorAll('.game-day-option[aria-selected="true"]').forEach(function (option) {
      option.classList.add('is-opened');
    });
    dayTrigger.disabled = lastDay < 1;
  }

  function createRoundedPath(points) {
    var radius = 24;
    var command = 'M' + points[0][0] + ' ' + points[0][1];

    for (var i = 1; i < points.length - 1; i += 1) {
      var previous = points[i - 1];
      var current = points[i];
      var next = points[i + 1];
      var incomingX = previous[0] - current[0];
      var incomingY = previous[1] - current[1];
      var outgoingX = next[0] - current[0];
      var outgoingY = next[1] - current[1];
      var incomingLength = Math.hypot(incomingX, incomingY);
      var outgoingLength = Math.hypot(outgoingX, outgoingY);
      var cornerRadius = Math.min(radius, incomingLength / 2, outgoingLength / 2);
      var cornerStartX = current[0] + incomingX / incomingLength * cornerRadius;
      var cornerStartY = current[1] + incomingY / incomingLength * cornerRadius;
      var cornerEndX = current[0] + outgoingX / outgoingLength * cornerRadius;
      var cornerEndY = current[1] + outgoingY / outgoingLength * cornerRadius;

      command += ' L' + cornerStartX.toFixed(1) + ' ' + cornerStartY.toFixed(1);
      command += ' Q' + current[0] + ' ' + current[1] + ' ' + cornerEndX.toFixed(1) + ' ' + cornerEndY.toFixed(1);
    }

    var last = points[points.length - 1];
    return command + ' L' + last[0] + ' ' + last[1];
  }

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
    return (milliseconds / 1000).toFixed(1) + words(' seconds', ' Sekunden');
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

  function renderOutcomeCopy(won) {
    if (!won) {
      setText(copy, 'Reliable routes leave little room for error. Reset and give it another run.', 'Verlässliche Wege verzeihen keine Abweichung. Starte neu und versuche es noch einmal.');
      return;
    }

    setText(
      copy,
      'With a steady hand, you kept everything running. Thank you for the trust and partnership we have shared this year. We wish you and your loved ones a joyful Christmas, time to recharge, and a bright start to the new year.',
      'Mit ruhiger Hand hast du alles am Laufen gehalten. Herzlichen Dank für dein Vertrauen und die gute Zusammenarbeit in diesem Jahr. Wir wünschen dir und deinen Liebsten ein frohes Weihnachtsfest, erholsame Feiertage und einen guten Start ins neue Jahr.'
    );
  }

  function renderPrelaunch() {
    panel.className = 'game-panel is-prelaunch';
    button.hidden = true;
    button.disabled = true;
    setText(dayTextLabel, 'Starts', 'Start');
    dayLabel.textContent = words('Dec 1', '1. Dez.');
    dayGrid.replaceChildren();
    dayTrigger.disabled = true;
    setText(stateLabel, 'Coming soon', 'Bald geht’s los');
    setText(title, 'Stay tuned.', 'Bleib gespannt.');
    setText(
      copy,
      'The first Advent challenge goes live on December 1. Come back then — a new route will be waiting for you.',
      'Die erste Advents-Herausforderung startet am 1. Dezember. Schau dann wieder vorbei — eine neue Strecke wartet schon auf dich.'
    );
    setText(hint, '24 days. 24 routes. Starting December 1.', '24 Tage. 24 Strecken. Start am 1. Dezember.');
  }

  function setText(element, en, de) {
    element.textContent = words(en, de);
  }

  function pointFromClient(clientX, clientY) {
    var clientPoint = new DOMPoint(clientX, clientY);
    var matrix = svg.getScreenCTM();
    return matrix ? clientPoint.matrixTransform(matrix.inverse()) : { x: 0, y: 0 };
  }

  function pointForPointer(clientX, clientY) {
    return pointFromClient(clientX + touchOffsetX, clientY + touchOffsetY);
  }

  function anchorTouch(event, point) {
    var matrix = svg.getScreenCTM();
    if (!matrix) return;
    var screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
    touchOffsetX = screenPoint.x - event.clientX;
    touchOffsetY = screenPoint.y - event.clientY;
  }

  function nearestOnWire(point) {
    var closest = null;
    var minSquared = Infinity;
    for (var i = 1; i < samples.length; i += 1) {
      var start = samples[i - 1];
      var end = samples[i];
      var segmentX = end.x - start.x;
      var segmentY = end.y - start.y;
      var lengthSquared = segmentX * segmentX + segmentY * segmentY;
      var fraction = lengthSquared ? Math.max(0, Math.min(1, ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / lengthSquared)) : 0;
      var x = start.x + segmentX * fraction;
      var y = start.y + segmentY * fraction;
      var dx = point.x - x;
      var dy = point.y - y;
      var squared = dx * dx + dy * dy;
      if (squared < minSquared) {
        minSquared = squared;
        closest = { x: x, y: y, distance: start.distance + (end.distance - start.distance) * fraction };
      }
    }
    return { point: closest, distance: Math.sqrt(minSquared) };
  }

  function placeWand(point) {
    currentWandPoint = point;
    wand.setAttribute('transform', 'translate(' + point.x.toFixed(1) + ' ' + point.y.toFixed(1) + ')');
  }

  function placeSpark(elapsed) {
    var speed = 0.00035 + (adventDay - 1) * 0.000025;
    if (mobileLayout.matches) {
      // Keep the fastest spark slower than the loop in screen pixels.
      var matrix = svg.getScreenCTM();
      var scale = matrix ? Math.hypot(matrix.a, matrix.b) : 1;
      speed = Math.min(speed * joystickSpeed / 240, joystickSpeed * .5 / (55 * 2 * Math.PI * (scale || 1)));
    }
    sparks.forEach(function (item, index) {
      var crossing = pathLength * item.progress;
      var center = path.getPointAtLength(crossing);
      var before = path.getPointAtLength(crossing - 2);
      var after = path.getPointAtLength(crossing + 2);
      var dx = after.x - before.x;
      var dy = after.y - before.y;
      var length = Math.hypot(dx, dy) || 1;
      var phase = index * 1.7;
      var offset = 55 * Math.cos(elapsed * speed * 2 * Math.PI + phase);
      item.point = { x: center.x - dy / length * offset, y: center.y + dx / length * offset };
      item.element.setAttribute('transform', 'translate(' + item.point.x.toFixed(1) + ' ' + item.point.y.toFixed(1) + ')');
      if (!mobileLayout.matches || elapsed - lastSparkDecoration >= 100) animateSparkAppearance(item, elapsed, index);
    });
    if (mobileLayout.matches && elapsed - lastSparkDecoration >= 100) lastSparkDecoration = elapsed;
  }

  function animateSparkAppearance(item, elapsed, index) {
      var phase = index * 1.7;
      item.flicker.setAttribute('opacity', (.75 + .25 * Math.sin(elapsed * .034 + phase)).toFixed(2));
      item.raysA.setAttribute('opacity', (.4 + .6 * Math.abs(Math.sin(elapsed * .018 + phase))).toFixed(2));
      item.raysB.setAttribute('opacity', (.3 + .7 * Math.abs(Math.sin(elapsed * .026 + phase + 1))).toFixed(2));
      item.particles.forEach(function (particle, particleIndex) {
        if (mobileLayout.matches && particleIndex >= 4) return;
        var life = ((elapsed / 650 + particleIndex * .31 + index * .17) % 1);
        var angle = particleIndex * 2.39996 + index * .7;
        var distance = 4 + life * (22 + (particleIndex % 4) * 4);
        var tail = Math.max(2, distance - 3 - 7 * Math.sin(life * Math.PI));
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        particle.setAttribute('x1', (cos * tail).toFixed(1));
        particle.setAttribute('y1', (sin * tail).toFixed(1));
        particle.setAttribute('x2', (cos * distance).toFixed(1));
        particle.setAttribute('y2', (sin * distance).toFixed(1));
        particle.setAttribute('opacity', Math.sin(life * Math.PI).toFixed(2));
      });
  }

  function sparkTouchesWand() {
    return sparkEnabled && currentWandPoint && sparks.some(function (item) {
      return item.point && Math.hypot(item.point.x - currentWandPoint.x, item.point.y - currentWandPoint.y) < 12;
    });
  }

  function animateSpark(now) {
    if (state !== 'running') return;
    placeSpark(now - sparkStarted);
    if (sparkTouchesWand()) {
      showResult(false, true);
      return;
    }
    sparkFrame = requestAnimationFrame(animateSpark);
  }

  function updateTimer() {
    if (state !== 'running') return;
    currentElapsed = performance.now() - startTime;
    updateFog(currentElapsed);
    renderCurrentTime();
    timer = requestAnimationFrame(updateTimer);
  }

  function armGame() {
    state = 'armed';
    lastProgress = 0;
    currentForwardSpeed = forwardSpeed;
    lastRunWasBest = false;
    lastFailureWasSpark = false;
    touchOffsetX = 0;
    touchOffsetY = 0;
    fogUntil = 0;
    scheduleFog(0);
    currentElapsed = 0;
    renderCurrentTime();
    clearTimeout(celebrationTimer);
    cancelAnimationFrame(celebrationFrame);
    celebration.replaceChildren();
    panel.classList.remove('is-celebrating');
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
    mobileCameraOffset = 0;
    trackCanvas.style.transform = '';
    if (mobileLayout.matches) sizeMobileTrack();
    panel.className = 'game-panel is-armed';
    overlay.classList.add('is-hidden');
    placeWand(samples[0]);
    if (mobileLayout.matches) followMobileWand();
    if (sparkEnabled) placeSpark(0);
    setText(stateLabel, 'Find the start', 'Zum Startpunkt');
    if (mobileLayout.matches) {
      begin(null, nearestOnWire(samples[0]), touchpad);
      joystickLastTime = performance.now();
      joystickFrame = requestAnimationFrame(moveMobile);
    } else setText(hint, 'Click the loop to begin.', 'Klicke auf den Ring, um zu beginnen.');
  }

  function begin(event, nearest, captureTarget) {
    if (state !== 'armed' || nearest.point.distance > 45 || nearest.distance > 32) return;
    state = 'running';
    pointerId = event ? event.pointerId : null;
    pointerActive = !!event;
    activePointerType = captureTarget ? 'touch' : event.pointerType;
    if (event) (captureTarget || stage).setPointerCapture(pointerId);
    startTime = performance.now();
    sparkStarted = startTime;
    lastSparkDecoration = -Infinity;
    pointerClientX = event ? event.clientX : 0;
    pointerClientY = event ? event.clientY : 0;
    panel.classList.remove('is-armed');
    panel.classList.add('is-running');
    setText(stateLabel, 'Line active', 'Spiel läuft');
    if (captureTarget) setText(hint, 'Hold left or right to steer, Boost to accelerate, or both arrows to wait.', 'Halte links oder rechts zum Lenken, Boost zum Beschleunigen, beide Pfeile zum Warten.');
    else setText(hint, fogCount ? 'Stay on the wire, dodge the sparks, and watch for fog.' : 'Stay on the wire and dodge the sparks.', fogCount ? 'Bleib auf der Leitung, weiche den Funken aus und achte auf Nebel.' : 'Bleib auf der Leitung und weiche den Funken aus.');
    cancelAnimationFrame(timer);
    updateTimer();
    if (sparkEnabled) sparkFrame = requestAnimationFrame(animateSpark);
    if (!captureTarget) {
      var startPoint = pointForPointer(event.clientX, event.clientY);
      evaluateRunningPoint(startPoint, nearestOnWire(startPoint));
      if (state === 'running') startAutoScroll();
    }
  }

  function showResult(won, hitSpark) {
    var elapsed = performance.now() - startTime;
    cancelAnimationFrame(timer);
    cancelAnimationFrame(scrollFrame);
    cancelAnimationFrame(sparkFrame);
    cancelAnimationFrame(joystickFrame);
    steerDirection = 0;
    steeringVelocity = 0;
    steerPointers = {};
    forwardPaused = false;
    accelerating = false;
    touchpad.querySelectorAll('.steer-button').forEach(function (control) { control.classList.remove('is-pressed'); });
    pointerId = null;
    pointerActive = false;
    activePointerType = '';
    state = won ? 'won' : 'failed';
    lastFailureWasSpark = !!hitSpark;
    panel.className = 'game-panel ' + (won ? 'is-won' : 'is-failed');
    if (won) {
      currentElapsed = elapsed;
      renderCurrentTime();
      recordBestTime(elapsed);
      if (lastRunWasBest) panel.classList.add('is-personal-best');
    }
    setText(
      stateLabel,
      won ? 'Route complete' : 'Contact lost',
      won ? 'Ziel erreicht' : 'Kontakt verloren'
    );
    icon.textContent = won ? '★' : '×';
    setText(title, won ? 'You did it.' : hitSpark ? 'Spark struck.' : 'Off the line.', won ? 'Geschafft.' : hitSpark ? 'Funke getroffen.' : 'Vom Kurs abgekommen.');
    renderOutcomeCopy(won);
    if (hitSpark) setText(copy, 'The spark caught you. Try again and find a way around it.', 'Der Funke hat dich erwischt. Versuch es noch einmal und weiche ihm aus.');
    button.firstElementChild.textContent = words(won ? 'Run it again' : 'Try again', won ? 'Noch einmal spielen' : 'Erneut versuchen');
    overlay.classList.remove('is-hidden');
    if (won) celebrate();
  }

  function celebrate() {
    if (!celebration) return;

    celebration.replaceChildren();
    panel.classList.remove('is-celebrating');
    void panel.offsetWidth;
    panel.classList.add('is-celebrating');
    clearTimeout(celebrationTimer);
    var fragment = document.createDocumentFragment();
    var shower = [];
    for (var i = 0; i < 32; i += 1) {
      var particle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      particle.setAttribute('viewBox', '-45 -45 90 90');
      particle.setAttribute('class', 'celebration-particle');
      var sparkCopy = spark.cloneNode(true);
      sparkCopy.removeAttribute('id');
      sparkCopy.removeAttribute('transform');
      var flickerCopy = sparkCopy.querySelector('#spark-flicker');
      flickerCopy.removeAttribute('id');
      particle.appendChild(sparkCopy);
      particle.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      particle.style.setProperty('--fall-distance', (celebration.clientHeight + 140) + 'px');
      particle.style.setProperty('--delay', (Math.random() * 1400).toFixed(0) + 'ms');
      particle.style.setProperty('--duration', (1500 + Math.random() * 1000).toFixed(0) + 'ms');
      particle.style.setProperty('--size', (30 + Math.random() * 35).toFixed(0) + 'px');
      shower.push({ flicker: flickerCopy, raysA: flickerCopy.querySelector('.spark-rays-a'), raysB: flickerCopy.querySelector('.spark-rays-b'), particles: Array.from(flickerCopy.querySelectorAll('.spark-particle')) });
      fragment.appendChild(particle);
    }

    celebration.appendChild(fragment);
    var showerStart = performance.now();
    function animateShower(now) {
      shower.forEach(function (item, index) { animateSparkAppearance(item, now - showerStart, index); });
      celebrationFrame = requestAnimationFrame(animateShower);
    }
    celebrationFrame = requestAnimationFrame(animateShower);
    celebrationTimer = window.setTimeout(function () {
      cancelAnimationFrame(celebrationFrame);
      celebration.replaceChildren();
      panel.classList.remove('is-celebrating');
    }, 4100);
  }

  function renderMobileIntro() {
    setText(copy,
      'The loop moves on its own. Hold left or right to steer, Boost to accelerate, and both arrows to wait.',
      'Der Ring bewegt sich von selbst. Halte links oder rechts zum Lenken, Boost zum Beschleunigen und beide Pfeile zum Warten.');
  }

  function refreshDynamicLanguage() {
    renderCurrentTime();
    renderBestTime();
    if (state === 'prelaunch') {
      renderPrelaunch();
    } else if (state === 'intro' && mobileLayout.matches) {
      renderMobileIntro();
    } else if (state === 'armed') {
      setText(stateLabel, 'Find the start', 'Zum Startpunkt');
      if (mobileLayout.matches) setText(hint, 'Hold left or right to steer, Boost to accelerate, or both arrows to wait.', 'Halte links oder rechts zum Lenken, Boost zum Beschleunigen, beide Pfeile zum Warten.');
      else setText(hint, 'Click the loop to begin.', 'Klicke auf den Ring, um zu beginnen.');
    } else if (state === 'running') {
      setText(stateLabel, 'Line active', 'Spiel läuft');
      if (mobileLayout.matches) setText(hint, 'Hold left or right to steer, Boost to accelerate, or both arrows to wait.', 'Halte links oder rechts zum Lenken, Boost zum Beschleunigen, beide Pfeile zum Warten.');
      else setText(hint, fogCount ? 'Stay on the wire, dodge the sparks, and watch for fog.' : 'Stay on the wire and dodge the sparks.', fogCount ? 'Bleib auf der Leitung, weiche den Funken aus und achte auf Nebel.' : 'Bleib auf der Leitung und weiche den Funken aus.');
    } else if (state === 'won' || state === 'failed') {
      var won = state === 'won';
      setText(
        stateLabel,
        won ? 'Route complete' : 'Contact lost',
        won ? 'Ziel erreicht' : 'Kontakt verloren'
      );
      setText(title, won ? 'You did it.' : lastFailureWasSpark ? 'Spark struck.' : 'Off the line.', won ? 'Geschafft.' : lastFailureWasSpark ? 'Funke getroffen.' : 'Vom Kurs abgekommen.');
      renderOutcomeCopy(won);
      if (!won && lastFailureWasSpark) setText(copy, 'The spark caught you. Try again and find a way around it.', 'Der Funke hat dich erwischt. Versuch es noch einmal und weiche ihm aus.');
      button.firstElementChild.textContent = words(won ? 'Run it again' : 'Try again', won ? 'Noch einmal spielen' : 'Erneut versuchen');
    }
  }

  function move(event) {
    if (state !== 'running') return;
    var rawPoint = pointForPointer(event.clientX, event.clientY);
    var nearest = nearestOnWire(rawPoint);

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
    if (sparkTouchesWand()) {
      showResult(false, true);
      return;
    }
    if (nearest.distance >= contactDistance || movedBackTooFar) {
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
      if (activePointerType !== 'mouse' && !pointerActive) return;

      var rect = stage.getBoundingClientRect();
      var edgeWidth = activePointerType === 'touch' ? rect.width * .55 : Math.min(72, rect.width * .22);
      var edgeStart = rect.right - edgeWidth;
      var available = stage.scrollWidth - stage.clientWidth - stage.scrollLeft;

      if (pointerClientX > edgeStart && available > 0) {
        var intensity = Math.min(1, (pointerClientX - edgeStart) / edgeWidth);
        var previousScroll = stage.scrollLeft;
        stage.scrollLeft += activePointerType === 'touch' ? 1 + intensity * 2 : .75 + intensity * 1.5;

        if (stage.scrollLeft !== previousScroll) {
          var rawPoint = pointForPointer(pointerClientX, pointerClientY);
          evaluateRunningPoint(rawPoint, nearestOnWire(rawPoint));
        }
      }

      if (state === 'running') scrollFrame = requestAnimationFrame(autoScroll);
    }

    scrollFrame = requestAnimationFrame(autoScroll);
  }

  function release(event) {
    if (state !== 'running' || event.pointerId !== pointerId) return;
    if (activePointerType !== 'mouse') {
      pointerActive = false;
      cancelAnimationFrame(scrollFrame);
    }
  }

  function sizeMobileTrack() {
    if (!mobileLayout.matches) return;
    stage.style.setProperty('--mobile-track-length', (stage.clientWidth * 1000 / 350) + 'px');
  }

  function followMobileWand() {
    if (!mobileLayout.matches || !currentWandPoint) return;
    var screenPoint = new DOMPoint(currentWandPoint.x, currentWandPoint.y).matrixTransform(svg.getScreenCTM());
    var rect = stage.getBoundingClientRect();
    var desiredOffset = mobileCameraOffset + (rect.top + rect.height * .68) - screenPoint.y;
    var minimumOffset = Math.min(0, stage.clientHeight - trackCanvas.offsetHeight);
    mobileCameraOffset = Math.max(minimumOffset, Math.min(0, desiredOffset));
    trackCanvas.style.transform = 'translateY(' + mobileCameraOffset + 'px)';
  }

  touchpad.addEventListener('touchstart', function (event) {
    if (event.target.closest('.steer-button')) event.preventDefault();
  }, { passive: false });

  touchpad.addEventListener('contextmenu', function (event) {
    if (event.target.closest('.steer-button')) event.preventDefault();
  });

  function updateSteering() {
    var left = false;
    var right = false;
    var faster = false;
    Object.keys(steerPointers).forEach(function (id) {
      if (steerPointers[id] < 0) left = true;
      else if (steerPointers[id] > 0) right = true;
      else faster = true;
    });
    accelerating = faster;
    forwardPaused = left && right;
    steerDirection = Number(right) - Number(left);
    if (!steerDirection) steeringVelocity = 0;
    touchpad.querySelector('.steer-left').classList.toggle('is-pressed', left);
    touchpad.querySelector('.steer-right').classList.toggle('is-pressed', right);
    touchpad.querySelector('.accelerate-button').classList.toggle('is-pressed', faster);
  }

  touchpad.addEventListener('pointerdown', function (event) {
    var control = event.target.closest('.steer-button');
    if (!control || !mobileLayout.matches || state !== 'running') return;
    event.preventDefault();
    steerPointers[event.pointerId] = Number(control.dataset.steer);
    updateSteering();
    control.setPointerCapture(event.pointerId);
  });

  function releaseSteering(event) {
    if (!(event.pointerId in steerPointers)) return;
    delete steerPointers[event.pointerId];
    steeringVelocity = 0;
    updateSteering();
  }
  touchpad.addEventListener('pointerup', releaseSteering);
  touchpad.addEventListener('pointercancel', releaseSteering);
  touchpad.addEventListener('lostpointercapture', releaseSteering);

  function moveMobile(now) {
    if (state !== 'running' || !mobileLayout.matches) return;
    var elapsed = Math.min(50, now - joystickLastTime) / 1000;
    joystickLastTime = now;
    currentForwardSpeed += ((accelerating ? acceleratedSpeed : forwardSpeed) - currentForwardSpeed) * (1 - Math.exp(-elapsed / .2));
    var targetVelocity = steerDirection * steeringSpeed;
    steeringVelocity += (targetVelocity - steeringVelocity) * (1 - Math.exp(-elapsed / .08));
    if (!steerDirection && Math.abs(steeringVelocity) < .1) steeringVelocity = 0;
    var matrix = svg.getScreenCTM();
    if (matrix) {
      var inverse = matrix.inverse();
      var origin = new DOMPoint(0, 0).matrixTransform(inverse);
      var delta = new DOMPoint(steeringVelocity * elapsed, (forwardPaused ? 0 : -currentForwardSpeed * elapsed)).matrixTransform(inverse);
      var point = { x: currentWandPoint.x + delta.x - origin.x, y: currentWandPoint.y + delta.y - origin.y };
      evaluateRunningPoint(point, nearestOnWire(point));
      if (state === 'running') followMobileWand();
    }
    if (state === 'running') joystickFrame = requestAnimationFrame(moveMobile);
  }

  window.addEventListener('resize', function () {
    if (mobileLayout.matches) { sizeMobileTrack(); followMobileWand(); }
    else { mobileCameraOffset = 0; trackCanvas.style.transform = ''; }
  });

  button.addEventListener('click', armGame);
  stage.addEventListener('pointerdown', function (event) {
    if (mobileLayout.matches) return;
    var nearest = nearestOnWire(pointFromClient(event.clientX, event.clientY));
    if (state === 'armed') {
      if (event.pointerType === 'touch') {
        var startScreen = new DOMPoint(samples[0].x, samples[0].y).matrixTransform(svg.getScreenCTM());
        if (Math.abs(event.clientX - startScreen.x) > 55 || event.clientY < startScreen.y - 25 || event.clientY > startScreen.y + 85) return;
        anchorTouch(event, samples[0]);
        nearest = nearestOnWire(pointForPointer(event.clientX, event.clientY));
      } else {
        var clickPoint = pointFromClient(event.clientX, event.clientY);
        if (Math.hypot(clickPoint.x - samples[0].x, clickPoint.y - samples[0].y) > 22.5) return;
        anchorTouch(event, samples[0]);
        nearest = nearestOnWire(pointForPointer(event.clientX, event.clientY));
      }
      begin(event, nearest);
      return;
    }

    if (state === 'running' && event.pointerType !== 'mouse') {
      if (event.pointerType === 'touch' && currentWandPoint) {
        var wandScreen = new DOMPoint(currentWandPoint.x, currentWandPoint.y).matrixTransform(svg.getScreenCTM());
        if (Math.abs(event.clientX - wandScreen.x) > 55 || event.clientY < wandScreen.y - 25 || event.clientY > wandScreen.y + 85) return;
        anchorTouch(event, currentWandPoint);
        nearest = nearestOnWire(pointForPointer(event.clientX, event.clientY));
      }
      var progress = nearest.point.distance / pathLength;
      if (nearest.distance < contactDistance && Math.abs(progress - lastProgress) <= .055) {
        pointerId = event.pointerId;
        pointerActive = true;
        activePointerType = event.pointerType;
        pointerClientX = event.clientX;
        pointerClientY = event.clientY;
        stage.setPointerCapture(pointerId);
        startAutoScroll();
      }
    }
  });
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('pointerleave', function (event) {
    if (state === 'running' && activePointerType === 'mouse' && event.pointerType === 'mouse') showResult(false);
  });
  dayTrigger.addEventListener('click', function () {
    if (dayTrigger.disabled) return;
    var willOpen = dayMenu.hidden;
    dayMenu.hidden = !willOpen;
    panel.classList.toggle('is-day-picker-open', willOpen);
    dayTrigger.setAttribute('aria-expanded', String(willOpen));
  });

  dayMenu.addEventListener('click', function (event) {
    var option = event.target.closest('.game-day-option');
    if (!option) return;
    if (option.getAttribute('aria-disabled') === 'true') {
      showDoorTooltip(option);
      return;
    }
    var parameters = new URLSearchParams(window.location.search);
    parameters.set('playDay', option.dataset.day);
    window.location.search = parameters.toString();
  });

  function showDoorTooltip(option) {
    if (!option || option.getAttribute('aria-disabled') !== 'true') return;
    var day = Number(option.dataset.day);
    doorTooltip.textContent = words('This door opens on December ' + day + '.', 'Dieses Türchen öffnet sich am ' + day + '. Dezember.');
    doorTooltip.hidden = false;
    option.setAttribute('aria-describedby', 'door-tooltip');
  }

  function hideDoorTooltip() {
    doorTooltip.hidden = true;
    dayGrid.querySelectorAll('[aria-describedby="door-tooltip"]').forEach(function (option) {
      option.removeAttribute('aria-describedby');
    });
  }

  dayGrid.addEventListener('pointerover', function (event) {
    var option = event.target.closest('.game-day-option');
    hideDoorTooltip();
    showDoorTooltip(option);
  });
  dayGrid.addEventListener('pointerleave', hideDoorTooltip);
  dayGrid.addEventListener('focusin', function (event) {
    hideDoorTooltip();
    showDoorTooltip(event.target.closest('.game-day-option'));
  });
  dayGrid.addEventListener('focusout', hideDoorTooltip);

  document.addEventListener('click', function (event) {
    if (dayMenu.hidden || dayChooser.contains(event.target) || dayMenu.contains(event.target)) return;
    dayMenu.hidden = true;
    panel.classList.remove('is-day-picker-open');
    dayTrigger.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || dayMenu.hidden) return;
    dayMenu.hidden = true;
    panel.classList.remove('is-day-picker-open');
    dayTrigger.setAttribute('aria-expanded', 'false');
    dayTrigger.focus();
  });
  if (mobileLayout.matches) {
    if (state === 'intro') renderMobileIntro();
    sizeMobileTrack();
    mobileCameraOffset = Math.min(0, stage.clientHeight - trackCanvas.offsetHeight);
    trackCanvas.style.transform = 'translateY(' + mobileCameraOffset + 'px)';
  }

  document.querySelectorAll('.langswitch button').forEach(function (languageButton) {
    languageButton.addEventListener('click', function () {
      document.querySelectorAll('[data-svg-en][data-svg-de]').forEach(function (element) {
        element.textContent = element.getAttribute('data-svg-' + languageButton.getAttribute('data-lang'));
      });
      refreshDynamicLanguage();
    });
  });
})();
