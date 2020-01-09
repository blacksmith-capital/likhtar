# Likhtar - Lantern

[![Build Status](https://github.com/blacksmith-capital/likhtar/workflows/Test/badge.svg)](https://github.com/blacksmith-capital/likhtar/actions?query=workflow%3ATest)

Likhtar is an open source OHLC charting tool with support for technical analysis.

You can use a backend data collection tools such as [Oliya](https://github.com/blacksmith-capital/oliya) as API provider, or supply your own data with a custom adapter. (see [example](https://blacksmith-capital.github.io/likhtar/customAdapter.html)).

Likhtar lets you analyse your data with custom indicators and annotation tools.

![Likhtar Example](https://blacksmith-capital.github.io/likhtar/screenshot.jpg)

### Demo

https://blacksmith-capital.github.io/likhtar/

## Getting Started

Likhtar is a standalone component application intended for embedding in a webpage.

### Dependencies

Likhtar is wrapped in Vue.js for user input management, and ships with Vue.

## Installation

First, `npm install likhtar`

Then, add an anchor so it knows where to embed itself:

```html
<div id="app">
  <app />
</div>
```
Then, instantiate the graph:

```JavaScript
let Vue = Likhtar.vue;
Vue.component(Likhtar.app.name, Likhtar.app);

let chartApp = new Vue({
  el: '#app',
  data: { symbols: "MyExchange:BTCUSD" }
});
```

See [customAdapter](https://blacksmith-capital.github.io/likhtar/customAdapter.html) if you haven't set up the data provider yet.

## Development

`npm run build -- --watch`

This will compile new assets under `dist` directory.

## Contributing

See [Kanban](https://github.com/blacksmith-capital/likhtar/projects/1) board for what is planned and what is being worked on.

In general, we follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

## Authors

- Yuri Koval'ov - [contact@yurikoval.com](contact:hello@yurikoval.com)

## License

This project is licensed under the [MIT License](LICENSE)

Copyright (c) 2020 Yuri Koval'ov
