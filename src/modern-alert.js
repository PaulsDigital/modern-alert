(function (global) {
  'use strict';

  const stroke =
    'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"';

  const BUILTIN_ICONS = {
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

  const ICONS = Object.assign({}, BUILTIN_ICONS, global.ModernAlertIcons || {});
  const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const defaults = {
    type: 'info',
    title: '',
    text: '',
    html: '',
    confirmText: 'OK',
    cancelText: '',
    showConfirm: true,
    showCancel: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    timer: 0,
    input: '',
    inputPlaceholder: '',
    inputValue: '',
    inputLabel: '',
    inputOptions: null,
    inputValidator: null,
    inputAttributes: null,
    theme: 'auto',
    icon: false,
    backdrop: true
  };

  const ICON_TYPES = { success: 1, error: 1, warning: 1, info: 1, question: 1, confirm: 1 };
  const INPUT_TYPES = {
    text: 1,
    email: 1,
    password: 1,
    number: 1,
    tel: 1,
    url: 1,
    search: 1,
    date: 1,
    time: 1,
    month: 1,
    week: 1,
    'datetime-local': 1,
    textarea: 1,
    select: 1
  };
  const INPUT_ATTR_ALLOW = {
    autocomplete: 1,
    autocapitalize: 1,
    autocorrect: 1,
    dirname: 1,
    disabled: 1,
    enterkeyhint: 1,
    inputmode: 1,
    list: 1,
    max: 1,
    maxlength: 1,
    min: 1,
    minlength: 1,
    name: 1,
    pattern: 1,
    placeholder: 1,
    readonly: 1,
    required: 1,
    size: 1,
    spellcheck: 1,
    step: 1,
    tabindex: 1,
    title: 1,
    type: 1
  };
  const NATIVE_FIELD_TYPES = {
    text: 1,
    email: 1,
    password: 1,
    number: 1,
    tel: 1,
    url: 1,
    search: 1,
    date: 1,
    time: 1,
    month: 1,
    week: 1,
    'datetime-local': 1
  };

  let state = emptyState();

  function emptyState() {
    return {
      overlay: null,
      dialog: null,
      resolve: null,
      options: null,
      timerId: null,
      abort: null,
      previousFocus: null,
      closing: false,
      scrollbarGap: 0
    };
  }

  function show() {
    const options = parseArgs(arguments);
    return openDialog(normalize(options));
  }

  function parseArgs(args) {
    if (!args.length) return {};
    if (typeof args[0] === 'object' && args[0]) return args[0];
    const options = { title: String(args[0] || '') };
    if (typeof args[1] === 'string') options.text = args[1];
    if (typeof args[2] === 'string') options.type = args[2];
    return options;
  }

  function normalize(raw) {
    const options = {};
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        options[key] = raw[key] != null ? raw[key] : defaults[key];
      }
    }

    if (raw.type === 'confirm') {
      options.type = 'confirm';
      options.showCancel = raw.showCancel != null ? raw.showCancel : true;
      options.cancelText = raw.cancelText || 'Cancel';
    }

    if (options.cancelText && raw.showCancel == null && raw.type !== 'loading') {
      options.showCancel = true;
    }

    if (raw.type === 'loading' || options.type === 'loading') {
      options.type = 'loading';
      options.showConfirm = false;
      options.showCancel = false;
      options.icon = true;
      options.allowOutsideClick = raw.allowOutsideClick != null ? raw.allowOutsideClick : false;
      options.allowEscapeKey = raw.allowEscapeKey != null ? raw.allowEscapeKey : false;
    }

    if (options.input && !INPUT_TYPES[options.input]) {
      options.input = 'text';
    }

    if (options.timer) {
      options.timer = Number(options.timer) || 0;
    }

    return options;
  }

  function openDialog(options) {
    return new Promise(function (resolve) {
      if (state.overlay && state.closing) {
        forceRemoveOverlay();
      }

      if (state.overlay && !state.closing) {
        settle({ isConfirmed: false, isDismissed: true, value: undefined, dismiss: 'replace' });
        state.resolve = resolve;
        mount(options, true);
        return;
      }

      state.previousFocus = document.activeElement;
      state.resolve = resolve;
      lockScroll();
      mount(options, false);
    });
  }

  function mount(options, swap) {
    clearTimer();
    if (state.abort) state.abort.abort();
    state.abort = new AbortController();
    state.options = options;
    state.closing = false;

    const overlay = state.overlay || document.createElement('div');
    overlay.className = 'ma-overlay';
    overlay.dataset.maType = visualType(options);
    overlay.dataset.maTheme = resolveTheme(options.theme);
    overlay.classList.toggle('ma-overlay--clear', !options.backdrop);
    if (options.type === 'loading') overlay.setAttribute('aria-busy', 'true');
    else overlay.removeAttribute('aria-busy');

    const dialog = buildDialog(options);
    overlay.innerHTML = '';
    overlay.appendChild(dialog);

    if (!state.overlay) {
      document.body.appendChild(overlay);
    } else if (swap) {
      dialog.classList.add('ma-swap');
    }

    state.overlay = overlay;
    state.dialog = dialog;
    bindEvents(overlay, dialog, options, state.abort.signal);
    focusInitial(dialog, options);
    startTimer(options);
  }

  function visualType(options) {
    return options.type || 'info';
  }

  function resolveTheme(theme) {
    if (theme === 'light' || theme === 'dark') return theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function buildDialog(options) {
    const dialog = document.createElement('div');
    dialog.className = 'ma-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('tabindex', '-1');

    const titleId = 'ma-title';
    const textId = 'ma-text';
    if (options.title) dialog.setAttribute('aria-labelledby', titleId);
    if (options.text || options.html) dialog.setAttribute('aria-describedby', textId);

    if (!options.icon) dialog.classList.add('ma-dialog--plain');
    if (options.icon) dialog.appendChild(buildIcon(options));

    if (options.title) {
      const title = document.createElement('h2');
      title.className = 'ma-title';
      title.id = titleId;
      title.textContent = options.title;
      dialog.appendChild(title);
    }

    if (options.html || options.text) {
      const body = document.createElement('div');
      body.className = 'ma-text';
      body.id = textId;
      if (options.html) body.innerHTML = sanitizeHtml(options.html);
      else body.textContent = options.text;
      dialog.appendChild(body);
    }

    if (options.input) {
      dialog.appendChild(buildInput(options));
      const error = document.createElement('div');
      error.className = 'ma-error';
      error.hidden = true;
      error.setAttribute('role', 'alert');
      dialog.appendChild(error);
    }

    const actions = buildActions(options);
    if (actions) dialog.appendChild(actions);

    return dialog;
  }

  function buildIcon(options) {
    const wrap = document.createElement('div');
    wrap.className = 'ma-icon';
    wrap.setAttribute('aria-hidden', 'true');

    if (options.type === 'loading') {
      wrap.innerHTML =
        '<div class="ma-spinner"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22"></circle></svg></div>';
      return wrap;
    }

    const kind = ICON_TYPES[visualType(options)] ? visualType(options) : 'info';
    wrap.innerHTML = ICONS[kind] || ICONS.info || '';
    return wrap;
  }

  function buildInput(options) {
    const wrap = document.createElement('div');
    wrap.className = 'ma-input-wrap';

    if (options.inputLabel) {
      const label = document.createElement('label');
      label.className = 'ma-label';
      label.setAttribute('for', 'ma-field');
      label.textContent = options.inputLabel;
      wrap.appendChild(label);
    }

    let field;
    if (options.input === 'textarea') {
      field = document.createElement('textarea');
      field.className = 'ma-textarea';
      field.rows = 4;
    } else if (options.input === 'select') {
      field = document.createElement('select');
      field.className = 'ma-select';
      const map = options.inputOptions || {};
      Object.keys(map).forEach(function (value) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = map[value];
        if (String(options.inputValue) === String(value)) opt.selected = true;
        field.appendChild(opt);
      });
    } else {
      field = document.createElement('input');
      field.className = 'ma-field';
      field.type = options.input;
    }

    field.id = 'ma-field';
    if (options.input !== 'select') {
      field.value = options.inputValue || '';
      if (options.inputPlaceholder) field.placeholder = options.inputPlaceholder;
    }
    wrap.appendChild(field);
    applyInputAttributes(field, options.inputAttributes);
    return wrap;
  }

  function applyInputAttributes(field, attrs) {
    if (!attrs || typeof attrs !== 'object') return;
    Object.keys(attrs).forEach(function (key) {
      const name = String(key).toLowerCase();
      if (!INPUT_ATTR_ALLOW[name] || name.indexOf('on') === 0) return;
      const value = attrs[key];
      if (name === 'type') {
        if (field.tagName === 'INPUT' && NATIVE_FIELD_TYPES[String(value)]) {
          field.type = String(value);
        }
        return;
      }
      if (value == null || value === false) {
        field.removeAttribute(name);
        return;
      }
      if (value === true) {
        field.setAttribute(name, '');
        return;
      }
      field.setAttribute(name, String(value));
    });
  }

  function buildActions(options) {
    if (!options.showConfirm && !options.showCancel) return null;
    const actions = document.createElement('div');
    actions.className = 'ma-actions';

    if (options.showCancel) {
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'ma-btn ma-btn--ghost';
      cancel.dataset.maAction = 'cancel';
      cancel.textContent = options.cancelText || 'Cancel';
      actions.appendChild(cancel);
    }

    if (options.showConfirm) {
      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'ma-btn ma-btn--solid';
      confirmBtn.dataset.maAction = 'confirm';
      confirmBtn.textContent = options.confirmText || 'OK';
      actions.appendChild(confirmBtn);
    }

    return actions;
  }

  function bindEvents(overlay, dialog, options, signal) {
    overlay.addEventListener(
      'pointerdown',
      function (event) {
        if (event.target !== overlay) return;
        if (!options.allowOutsideClick || options.type === 'loading') return;
        dismiss('backdrop');
      },
      { signal: signal }
    );

    dialog.addEventListener(
      'click',
      function (event) {
        const btn = event.target.closest('[data-ma-action]');
        if (!btn) return;
        if (btn.dataset.maAction === 'cancel') dismiss('cancel');
        if (btn.dataset.maAction === 'confirm') confirm();
      },
      { signal: signal }
    );

    document.addEventListener(
      'keydown',
      function (event) {
        if (!state.overlay || state.closing) return;
        if (event.key === 'Escape' && options.allowEscapeKey && options.type !== 'loading') {
          event.preventDefault();
          dismiss('esc');
          return;
        }
        if (event.key === 'Tab') {
          trapFocus(event, dialog);
          return;
        }
        if (event.key === 'Enter' && options.input !== 'textarea') {
          const tag = (event.target && event.target.tagName) || '';
          if (tag === 'TEXTAREA' || tag === 'BUTTON') return;
          if (options.showConfirm) {
            event.preventDefault();
            confirm();
          }
        }
      },
      { signal: signal }
    );
  }

  function trapFocus(event, dialog) {
    const nodes = dialog.querySelectorAll(FOCUSABLE);
    if (!nodes.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function focusInitial(dialog, options) {
    const field = dialog.querySelector('#ma-field');
    if (field) {
      field.focus();
      if (typeof field.select === 'function' && options.input !== 'select') field.select();
      return;
    }
    const confirmBtn = dialog.querySelector('[data-ma-action="confirm"]');
    if (confirmBtn) {
      confirmBtn.focus();
      return;
    }
    dialog.focus();
  }

  function getInputValue() {
    const field = state.dialog && state.dialog.querySelector('#ma-field');
    return field ? field.value : undefined;
  }

  function showInputError(message) {
    if (!state.dialog) return;
    const error = state.dialog.querySelector('.ma-error');
    const field = state.dialog.querySelector('#ma-field');
    if (error) {
      error.hidden = !message;
      error.textContent = message || '';
    }
    if (field) field.classList.toggle('ma-field--invalid', Boolean(message));
  }

  function confirm() {
    if (!state.options || state.closing) return;
    const options = state.options;
    const value = options.input ? getInputValue() : true;
    const btn = state.dialog && state.dialog.querySelector('[data-ma-action="confirm"]');

    function finishOk() {
      closeWith({ isConfirmed: true, isDismissed: false, value: value, dismiss: undefined });
    }

    if (!options.inputValidator) {
      finishOk();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.classList.add('ma-btn--busy');
    }

    Promise.resolve()
      .then(function () {
        return options.inputValidator(value);
      })
      .then(function (message) {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('ma-btn--busy');
        }
        if (message) {
          showInputError(String(message));
          const field = state.dialog && state.dialog.querySelector('#ma-field');
          if (field) field.focus();
          return;
        }
        showInputError('');
        finishOk();
      })
      .catch(function (err) {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('ma-btn--busy');
        }
        showInputError(err && err.message ? err.message : String(err || 'Error'));
      });
  }

  function dismiss(reason) {
    closeWith({ isConfirmed: false, isDismissed: true, value: undefined, dismiss: reason });
  }

  function closeWith(result) {
    if (!state.overlay || state.closing) return Promise.resolve(result);
    state.closing = true;
    clearTimer();
    if (state.abort) state.abort.abort();

    const overlay = state.overlay;
    const resolver = state.resolve;
    const previousFocus = state.previousFocus;
    state.resolve = null;
    overlay.classList.add('ma-overlay--out');

    return new Promise(function (resolveAnim) {
      let done = false;
      function finish() {
        if (done || overlay._maDone) return;
        done = true;
        overlay._maDone = true;
        overlay.removeEventListener('animationend', onEnd);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (state.overlay === overlay) {
          unlockScroll();
          state = emptyState();
          restoreFocus(previousFocus);
        }
        if (resolver) resolver(result);
        resolveAnim(result);
      }
      function onEnd(event) {
        if (event.target === overlay) finish();
      }
      overlay.addEventListener('animationend', onEnd);
      setTimeout(finish, 220);
    });
  }

  function forceRemoveOverlay() {
    const overlay = state.overlay;
    const previousFocus = state.previousFocus;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    unlockScroll();
    state = emptyState();
    restoreFocus(previousFocus);
  }

  function restoreFocus(prev) {
    if (prev && typeof prev.focus === 'function') {
      try { prev.focus(); } catch (e) { /* ignore */ }
    }
  }

  function settle(result) {
    const resolver = state.resolve;
    state.resolve = null;
    if (resolver) resolver(result);
  }

  function close() {
    if (!state.overlay) return Promise.resolve();
    return closeWith({ isConfirmed: false, isDismissed: true, value: undefined, dismiss: 'close' });
  }

  function startTimer(options) {
    if (!options.timer || options.type === 'loading') return;
    state.timerId = setTimeout(function () {
      dismiss('timer');
    }, options.timer);
  }

  function clearTimer() {
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
  }

  function lockScroll() {
    if (document.body.classList.contains('ma-lock')) return;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    state.scrollbarGap = gap;
    if (gap > 0) document.body.style.paddingRight = gap + 'px';
    document.body.classList.add('ma-lock');
  }

  function unlockScroll() {
    document.body.classList.remove('ma-lock');
    document.body.style.paddingRight = '';
  }

  function sanitizeHtml(dirty) {
    const doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = String(dirty || '');
    const forbidden = doc.body.querySelectorAll(
      'script,iframe,object,embed,link,meta,style,form,input,button,textarea,svg,math,video,audio,source'
    );
    Array.prototype.forEach.call(forbidden, function (el) {
      el.remove();
    });
    Array.prototype.forEach.call(doc.body.querySelectorAll('*'), function (el) {
      Array.prototype.slice.call(el.attributes).forEach(function (attr) {
        const name = attr.name.toLowerCase();
        const value = attr.value || '';
        if (name.indexOf('on') === 0 || name === 'srcdoc' || name === 'formaction' || name === 'xlink:href') {
          el.removeAttribute(attr.name);
          return;
        }
        if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(value)) {
          el.removeAttribute(attr.name);
        }
      });
      if (el.tagName === 'A') {
        el.setAttribute('rel', 'noopener noreferrer');
        el.setAttribute('target', '_blank');
      }
    });
    return doc.body.innerHTML;
  }

  function helper(type) {
    return function (title, text, extra) {
      const options = extra && typeof extra === 'object' ? extra : {};
      options.type = type;
      options.title = title;
      if (typeof text === 'string') options.text = text;
      return show(options);
    };
  }

  function loading(title, text) {
    return show({
      type: 'loading',
      title: typeof title === 'string' ? title : 'Loading',
      text: typeof text === 'string' ? text : ''
    });
  }

  function confirmDialog(title, text, extra) {
    const options = extra && typeof extra === 'object' ? extra : {};
    options.type = 'confirm';
    options.title = title;
    if (typeof text === 'string') options.text = text;
    return show(options);
  }

  const api = {
    show: show,
    close: close,
    isVisible: function () {
      return Boolean(state.overlay) && !state.closing;
    },
    loading: loading,
    success: helper('success'),
    error: helper('error'),
    warning: helper('warning'),
    info: helper('info'),
    question: helper('question'),
    confirm: confirmDialog
  };

  global.ModernAlert = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
