# Actors

## Install

```bash
npm install @nuware/actors --save
```

or

```html
<script defer src="https://unpkg.com/@nuware/actors@latest/dist/actors.umd.js"></script>
```

or

```html
<script defer src="https://unpkg.com/@nuware/actors@latest/dist/actors.umd.min.js"></script>
```


## Usage

Browser

```javascript
const { hookup, lookup } = window.nuware.Actors
```

Node

```javascript
const { hookup, lookup } = require('@nuware/actors')
```

or

```javascript
import { hookup, lookup } from '@nuware/actors'
```

## Exmaple

```javascript
hookup('a', {
  init: () => Promise.resolve(null),
  onMessage: (data) => console.log('Data', data)
})

lookup('a').send({ text: 'text' })
```

## License

MIT License

## Author

Dmitry Dudin <dima@nuware.ru>
