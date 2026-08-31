(function (global) {
  'use strict';

  const stroke =
    'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"';

  global.ModernAlertIcons = {
    success:
      '<svg class="ma-svg" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle class="ma-stroke ma-stroke--ring" cx="32" cy="32" r="26" ' + stroke + '></circle>' +
      '<path class="ma-stroke ma-stroke--mark" d="M20.5 33.2l8.2 8.3 15.6-18" ' + stroke + '></path>' +
      '</svg>',

    error:
      '<svg class="ma-svg" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle class="ma-stroke ma-stroke--ring" cx="32" cy="32" r="26" ' + stroke + '></circle>' +
      '<path class="ma-stroke ma-stroke--mark" d="M24 24l16 16M40 24L24 40" ' + stroke + '></path>' +
      '</svg>',

    warning:
      '<svg class="ma-svg" viewBox="0 0 64 64" aria-hidden="true">' +
      '<path class="ma-stroke ma-stroke--ring" d="M32 12.5L54 51.5H10z" ' + stroke + '></path>' +
      '<path class="ma-stroke ma-stroke--mark" d="M32 26v12" ' + stroke + '></path>' +
      '<circle class="ma-stroke ma-stroke--dot" cx="32" cy="46" r="1.4" fill="currentColor" stroke="none"></circle>' +
      '</svg>',

    info:
      '<svg class="ma-svg" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle class="ma-stroke ma-stroke--ring" cx="32" cy="32" r="26" ' + stroke + '></circle>' +
      '<path class="ma-stroke ma-stroke--mark" d="M32 29.5V42" ' + stroke + '></path>' +
      '<circle class="ma-stroke ma-stroke--dot" cx="32" cy="23" r="1.6" fill="currentColor" stroke="none"></circle>' +
      '</svg>',

    question:
      '<svg class="ma-svg" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle class="ma-stroke ma-stroke--ring" cx="32" cy="32" r="26" ' + stroke + '></circle>' +
      '<path class="ma-stroke ma-stroke--mark" d="M26 25.5c1.2-3.6 6.8-5 10.2-2.4 3 2.3 2.6 6.2-.2 8.2-1.8 1.3-4 2.2-4 5.2" ' + stroke + '></path>' +
      '<circle class="ma-stroke ma-stroke--dot" cx="32" cy="44.5" r="1.6" fill="currentColor" stroke="none"></circle>' +
      '</svg>',

    confirm:
      '<svg class="ma-svg" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle class="ma-stroke ma-stroke--ring" cx="32" cy="32" r="26" ' + stroke + '></circle>' +
      '<path class="ma-stroke ma-stroke--mark" d="M19 25h22.5l-6-5.8M41.5 25l-6 5.8" ' + stroke + '></path>' +
      '<path class="ma-stroke ma-stroke--mark" d="M45 39H22.5l6-5.8M22.5 39l6 5.8" ' + stroke + '></path>' +
      '</svg>'
  };
})(typeof window !== 'undefined' ? window : this);
