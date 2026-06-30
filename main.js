
(function(){
  var NAV = `<div class="nav-outer"><nav>
  <a href="#" class="logo" aria-label="Coppersoft">
    <svg class="logomark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <path fill-rule="evenodd" fill="#B87333" d="M 60 60 m -48 0 a 48 48 0 1 0 96 0 a 48 48 0 1 0 -96 0 Z M 87.78 70.67 L 86.68 73.19 L 85.35 75.59 L 83.80 77.87 L 82.05 79.99 L 80.11 81.94 L 77.99 83.70 L 75.73 85.27 L 73.33 86.61 L 70.81 87.73 L 68.20 88.61 L 65.53 89.24 L 62.80 89.63 L 60.05 89.76 L 57.30 89.64 L 54.58 89.26 L 51.90 88.64 L 49.29 87.76 L 46.77 86.66 L 44.36 85.32 L 42.09 83.77 L 39.97 82.01 L 38.02 80.07 L 36.26 77.95 L 34.71 75.68 L 33.37 73.28 L 32.25 70.76 L 31.38 68.15 L 30.75 65.47 L 30.37 62.75 L 30.24 60.00 L 30.37 57.25 L 30.75 54.53 L 31.38 51.85 L 32.25 49.24 L 33.37 46.72 L 34.71 44.32 L 36.26 42.05 L 38.02 39.93 L 39.97 37.99 L 42.09 36.23 L 44.36 34.68 L 46.77 33.34 L 49.29 32.24 L 51.90 31.36 L 54.58 30.74 L 57.30 30.36 L 60.05 30.24 L 62.80 30.37 L 65.53 30.76 L 68.20 31.39 L 70.81 32.27 L 73.33 33.39 L 75.73 34.73 L 77.99 36.30 L 80.11 38.06 L 82.05 40.01 L 83.80 42.13 L 85.35 44.41 L 86.68 46.81 L 87.78 49.33 L 77.92 53.12 L 77.21 51.49 L 76.35 49.94 L 75.35 48.47 L 74.22 47.10 L 72.97 45.84 L 71.61 44.71 L 70.15 43.70 L 68.60 42.83 L 66.97 42.11 L 65.29 41.54 L 63.56 41.13 L 61.81 40.89 L 60.03 40.80 L 58.26 40.88 L 56.50 41.12 L 54.77 41.53 L 53.09 42.09 L 51.46 42.80 L 49.91 43.66 L 48.45 44.67 L 47.08 45.80 L 45.82 47.05 L 44.69 48.42 L 43.68 49.88 L 42.82 51.43 L 42.10 53.06 L 41.53 54.74 L 41.13 56.47 L 40.88 58.23 L 40.80 60.00 L 40.88 61.77 L 41.13 63.53 L 41.53 65.26 L 42.10 66.94 L 42.82 68.57 L 43.68 70.12 L 44.69 71.58 L 45.82 72.95 L 47.08 74.20 L 48.45 75.33 L 49.91 76.34 L 51.46 77.20 L 53.09 77.91 L 54.77 78.47 L 56.50 78.88 L 58.26 79.12 L 60.03 79.20 L 61.81 79.11 L 63.56 78.87 L 65.29 78.46 L 66.97 77.89 L 68.60 77.17 L 70.15 76.30 L 71.61 75.29 L 72.97 74.16 L 74.22 72.90 L 75.35 71.53 L 76.35 70.06 L 77.21 68.51 L 77.92 66.88 Z"/>
    </svg>
    <span>coppersoft</span>
  </a>
  <div class="navlinks">
    <a href="/#services" data-de="Leistungen" data-en="Services">Leistungen</a>
    <a href="/#approach" data-de="Ansatz" data-en="Approach">Ansatz</a>
    <a href="/#domain" data-de="Domäne" data-en="Domain">Domäne</a>
    <a href="/#contact" data-de="Kontakt" data-en="Contact">Kontakt</a>
  </div>
  <div class="navactions">
    <div class="langswitch" role="group" aria-label="Sprache / Language">
      <button type="button" data-lang="en">EN</button>
      <button type="button" data-lang="de">DE</button>
    </div>
    <a href="/#contact" class="btn letstalk" data-de="Lass uns reden" data-en="Let's talk">Lass uns reden</a>
  </div>
</nav></div>`;

  var FOOTER = `<footer id="contact">
  <div class="wrap">
    <div class="fcols">
      <div>
        <a href="#" class="logo" aria-label="Coppersoft">
          <svg class="logomark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <path fill-rule="evenodd" fill="#B87333" d="M 60 60 m -48 0 a 48 48 0 1 0 96 0 a 48 48 0 1 0 -96 0 Z M 87.78 70.67 L 86.68 73.19 L 85.35 75.59 L 83.80 77.87 L 82.05 79.99 L 80.11 81.94 L 77.99 83.70 L 75.73 85.27 L 73.33 86.61 L 70.81 87.73 L 68.20 88.61 L 65.53 89.24 L 62.80 89.63 L 60.05 89.76 L 57.30 89.64 L 54.58 89.26 L 51.90 88.64 L 49.29 87.76 L 46.77 86.66 L 44.36 85.32 L 42.09 83.77 L 39.97 82.01 L 38.02 80.07 L 36.26 77.95 L 34.71 75.68 L 33.37 73.28 L 32.25 70.76 L 31.38 68.15 L 30.75 65.47 L 30.37 62.75 L 30.24 60.00 L 30.37 57.25 L 30.75 54.53 L 31.38 51.85 L 32.25 49.24 L 33.37 46.72 L 34.71 44.32 L 36.26 42.05 L 38.02 39.93 L 39.97 37.99 L 42.09 36.23 L 44.36 34.68 L 46.77 33.34 L 49.29 32.24 L 51.90 31.36 L 54.58 30.74 L 57.30 30.36 L 60.05 30.24 L 62.80 30.37 L 65.53 30.76 L 68.20 31.39 L 70.81 32.27 L 73.33 33.39 L 75.73 34.73 L 77.99 36.30 L 80.11 38.06 L 82.05 40.01 L 83.80 42.13 L 85.35 44.41 L 86.68 46.81 L 87.78 49.33 L 77.92 53.12 L 77.21 51.49 L 76.35 49.94 L 75.35 48.47 L 74.22 47.10 L 72.97 45.84 L 71.61 44.71 L 70.15 43.70 L 68.60 42.83 L 66.97 42.11 L 65.29 41.54 L 63.56 41.13 L 61.81 40.89 L 60.03 40.80 L 58.26 40.88 L 56.50 41.12 L 54.77 41.53 L 53.09 42.09 L 51.46 42.80 L 49.91 43.66 L 48.45 44.67 L 47.08 45.80 L 45.82 47.05 L 44.69 48.42 L 43.68 49.88 L 42.82 51.43 L 42.10 53.06 L 41.53 54.74 L 41.13 56.47 L 40.88 58.23 L 40.80 60.00 L 40.88 61.77 L 41.13 63.53 L 41.53 65.26 L 42.10 66.94 L 42.82 68.57 L 43.68 70.12 L 44.69 71.58 L 45.82 72.95 L 47.08 74.20 L 48.45 75.33 L 49.91 76.34 L 51.46 77.20 L 53.09 77.91 L 54.77 78.47 L 56.50 78.88 L 58.26 79.12 L 60.03 79.20 L 61.81 79.11 L 63.56 78.87 L 65.29 78.46 L 66.97 77.89 L 68.60 77.17 L 70.15 76.30 L 71.61 75.29 L 72.97 74.16 L 74.22 72.90 L 75.35 71.53 L 76.35 70.06 L 77.21 68.51 L 77.92 66.88 Z"/>
          </svg>
        </a>
        <p class="muted">Solid Software for Critical Infrastructure</p>
      </div>
      <div class="muted">
        <p style="color:#cbd5dd;margin-bottom:8px;font-weight:600" data-de="Kontakt" data-en="Contact">Kontakt</p>
        <p><a href="mailto:ping@coppersoft.com">ping@coppersoft.com</a></p>
        <p><a href="tel:+4922830406375">+49 228 3040 6375</a></p>
      </div>
      <div class="muted">
        <p style="color:#cbd5dd;margin-bottom:8px;font-weight:600">Coppersoft GmbH</p>
        <p data-de="Am Kaiserkai 69<br>20457 Hamburg, Deutschland" data-en="Am Kaiserkai 69<br>20457 Hamburg, Germany">Am Kaiserkai 69<br>20457 Hamburg, Deutschland</p>
      </div>
    </div>
    <div class="copy">
      <span>© 2026 Coppersoft GmbH</span>
      <span><a href="https://www.linkedin.com/company/coppersoft-dev" style="color:inherit">LinkedIn</a> · <a href="https://github.com/coppersoft-dev/" style="color:inherit">GitHub</a> · <a href="legalnotice.html" style="color:inherit" data-de="Impressum" data-en="Legal Notice">Impressum</a> · <a href="privacy.html" style="color:inherit" data-de="Datenschutz" data-en="Privacy">Datenschutz</a></span>
    </div>
  </div>
</footer>`;

  var tmp = document.createElement('div');
  tmp.innerHTML = NAV;
  document.body.insertBefore(tmp.firstChild, document.body.firstChild);
  tmp.innerHTML = FOOTER;
  document.body.appendChild(tmp.firstChild);

  var nodes = document.querySelectorAll('[data-de][data-en]');
  function apply(lang) {
    nodes.forEach(function(el) {
      var v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.langswitch button').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('cs-lang', lang); } catch(e) {}
  }
  var fallback = document.documentElement.lang || 'en';
  var saved = fallback;
  try { saved = localStorage.getItem('cs-lang') || fallback; } catch(e) {}
  apply(saved);
  document.querySelectorAll('.langswitch button').forEach(function(b) {
    b.addEventListener('click', function() { apply(b.getAttribute('data-lang')); });
  });
})();
