import { default as Likhtar } from './components/App';
import { default as adapter } from './adapters/ohlcAdapter';
export default Likhtar;
window.Likhtar = {
  app: Likhtar,
  adapter: adapter,
  fc: require("d3fc"),
  d3: require("d3"),
  vue: require("vue")
}
