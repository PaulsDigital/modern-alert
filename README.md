# ModernAlert

A small dialog library for the browser. No npm dependencies, no framework.

Drop in two files. Call `ModernAlert.show()`. Get a promise back.

```js
const result = await ModernAlert.confirm(
  'Delete this project?',
  'Files stay in the trash for 30 days.'
)

if (result.isConfirmed) {
  await deleteProject()
}
```

The default card is left-aligned, with the type color as a thin top line. Light, dark, or follow the system. The circular icon is opt-in.

## What you get

- Dialog first, decoration second (`icon` is off by default)
- Semantic types: `success`, `error`, `warning`, `info`, `question`, `confirm`, `loading`
- Backdrop you can keep, drop, or keep invisible while still blocking the page
- Inputs, HTML, loading, and a timer — CSS plus one script, no bundler

## Setup

Icons ship inside the script. `window.ModernAlert` is set for CDN tags; bundlers should import the default export.

### npm

```bash
npm install modern-alert
```

```js
import ModernAlert from 'modern-alert'
import 'modern-alert/modern-alert.css'

await ModernAlert.success('Saved', 'The file is already in the library.')
```

Named import works too: `import { ModernAlert } from 'modern-alert'`.

Without a bundler, load CSS then the IIFE file:

```html
<link rel="stylesheet" href="node_modules/modern-alert/src/modern-alert.css">
<script src="node_modules/modern-alert/src/modern-alert.js"></script>
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/modern-alert@1.1.0/src/modern-alert.css">
<script src="https://cdn.jsdelivr.net/npm/modern-alert@1.1.0/src/modern-alert.js"></script>
```

Pin a version. `@latest` will follow new releases.

TypeScript types ship in the package (`src/modern-alert.d.ts`).

### Copy the files

Copy `src/modern-alert.css` and `src/modern-alert.js` into your project:

```html
<link rel="stylesheet" href="src/modern-alert.css">
<script src="src/modern-alert.js"></script>
```

## Usage

### A simple message

```js
await ModernAlert.success('Saved', 'The file is already in the library.')
await ModernAlert.error('Could not save', 'Check your connection and try again.')
```

### Confirm something destructive

```js
const { isConfirmed } = await ModernAlert.confirm(
  'Delete this project?',
  'You can restore it from the trash.'
)
```

`confirm` shows Cancel and a primary action. Other types show a single button unless you pass `cancelText`. With `icon: true`, `confirm` uses cyan swap arrows; `question` keeps the purple question mark.

### Ask for a value

```js
const result = await ModernAlert.show({
  type: 'question',
  title: 'What should we call it?',
  input: 'text',
  inputPlaceholder: 'Project name',
  inputValidator: (value) => !String(value).trim() && 'Give it a name'
})

if (result.isConfirmed) {
  createProject(result.value)
}
```

`input` can be `text`, `email`, `password`, `number`, `tel`, `url`, `search`, `date`, `time`, `month`, `week`, `datetime-local`, `textarea`, or `select` (`inputOptions` + `inputValue` for select). Pass `inputAttributes` for native field attrs such as `min`, `max`, `step`, and `autocomplete`.

```js
const result = await ModernAlert.show({
  type: 'question',
  title: 'How many seats?',
  input: 'number',
  inputAttributes: { min: 1, max: 12, step: 1 }
})
```

### Loading, then done

```js
ModernAlert.loading('Saving…')

await api.save()

await ModernAlert.success('Saved', 'You can keep working.')
```

A loading dialog does not close on backdrop click or Escape. Close it with `ModernAlert.close()`, or replace it with the next `show()` / `success()`.

### HTML inside the body

```js
await ModernAlert.show({
  title: "What's new",
  html: '<p>You can pass <strong>your own markup</strong>.</p>'
})
```

Markup is sanitized: scripts, event handlers, and `javascript:` URLs are stripped.

## Look

```js
await ModernAlert.show({
  title: 'Deployed',
  text: 'v2.4.1 is live.',
  theme: 'dark',     // auto | light | dark
  icon: true,        // circular SVG mascot
  backdrop: false    // no dim; the page still cannot be clicked
})
```

Shorthand helpers take an optional third argument for any option:

```js
ModernAlert.success('Saved', 'All set.', { theme: 'dark', timer: 2000 })
```

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `type` | `'info'` | `success` `error` `warning` `info` `question` `confirm` `loading` |
| `title` | `''` | Heading |
| `text` | `''` | Body text. Ignored if `html` is set |
| `html` | `''` | Sanitized markup for the body |
| `confirmText` | `'OK'` | Primary button label |
| `cancelText` | `''` | Secondary button label. Any non-empty value also shows Cancel |
| `showConfirm` | `true` | Show the primary button |
| `showCancel` | `false` | Show Cancel. `type: 'confirm'` turns this on |
| `input` | `''` | `text` `email` `password` `number` `tel` `url` `search` `date` `time` `month` `week` `datetime-local` `textarea` `select` |
| `inputPlaceholder` | `''` | Placeholder for text-like inputs |
| `inputValue` | `''` | Initial value, or the selected key for `select` |
| `inputLabel` | `''` | Label above the field |
| `inputOptions` | `null` | `{ value: 'Label' }` map for `select` |
| `inputValidator` | `null` | `(value) => errorMessage`. Return a string to block confirm |
| `inputAttributes` | `null` | Native field attrs: `min` `max` `step` `autocomplete`, or `type: 'date'` |
| `theme` | `'auto'` | Follows `prefers-color-scheme`, or `'light'` / `'dark'` |
| `icon` | `false` | `true` shows the animated 72px type icon. Forced on for `loading` |
| `backdrop` | `true` | `false` removes the dim and blur, not the click shield |
| `timer` | `0` | Auto-dismiss after N milliseconds. Ignored for `loading` |
| `allowOutsideClick` | `true` | Click outside the card to dismiss. Off for `loading` |
| `allowEscapeKey` | `true` | Escape to dismiss. Off for `loading` |

## The promise

Every call returns:

```ts
{
  isConfirmed: boolean
  isDismissed: boolean
  value: any        // true, or the input string
  dismiss: string   // 'cancel' | 'esc' | 'backdrop' | 'timer' | 'close' | 'replace'
}
```

`dismiss` is set only when the dialog was not confirmed.

```js
ModernAlert.show({ title: 'Ping' })
ModernAlert.isVisible() // true
ModernAlert.close()     // dismiss: 'close'
```

## API map

| Call | What it does |
| --- | --- |
| `show(options)` | Full dialog |
| `show(title, text, type)` | Same, positional |
| `success` `error` `warning` `info` `question` | Typed helpers |
| `confirm(title, text, options?)` | Two actions |
| `loading(title, text?)` | Spinner, no buttons |
| `close()` | Dismiss the open dialog |
| `isVisible()` | Whether a dialog is on screen |

## License

MIT
