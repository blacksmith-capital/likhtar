import { default as Likhtar } from './components/App';
import { default as adapter } from './adapters/ohlcAdapter';
window.Likhtar = {
  app: Likhtar,
  adapter: adapter,
  fc: require("d3fc"),
  d3: require("d3"),
  vue: require("vue"),
  moment: require("moment"),
  lodash: require("lodash")
}
