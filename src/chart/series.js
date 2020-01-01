const fc = require('d3fc');

const initLine = (chart, xAxis, yAxis) => {
  chart.series = fc.seriesSvgLine()
    .mainValue(chart.mainValueAccessor)
    .crossValue(chart.crossValueAccessor)
    .xScale(xAxis.scale)
    .yScale(yAxis.scale);

  return chart
}
const initCandleStick = (chart, xAxis, yAxis) => {
  chart.series = fc.autoBandwidth(fc.seriesSvgCandlestick())
    .xScale(xAxis.scale)
    .yScale(yAxis.scale);
  return chart;
};

const initOhlc = (chart, xAxis, yAxis) => {
  chart.series = fc.autoBandwidth(fc.seriesSvgOhlc())
    .xScale(xAxis.scale)
    .yScale(yAxis.scale);
  return chart;
};

// const initVolume = (chart, xAxis, yAxis) => {
//   chart.series = fc.autoBandwidth(fc.seriesSvgBar())
//     .mainValue(d => d.volume)
//     .crossValue(d => d.date)
//     .xScale(xAxis.scale)
//     .yScale(yAxis.scale);
//   return chart;
// };

const initSeries = (charts, axies) => {
  const xAxis = axies.find(a =>  a.vector === 'x');

  return charts.map((chart) => {
    let yAxis = axies.find(a => a.vector === chart.axis.vector && a.name === chart.axis.name)
    switch (chart.type) {
      case 'line':
        return initLine(chart, xAxis, yAxis);
      case 'candlestick':
        return initCandleStick(chart, xAxis, yAxis);
      case 'ohlc':
        return initOhlc(chart, xAxis, yAxis);
      // case 'volume':
      //   return initVolume(chart, xAxis, yAxis);
      default:
        return initCandleStick(chart, xAxis, yAxis);
    }
  });
};

export { initSeries };
