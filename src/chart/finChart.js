import { axisDefaults,
         chartTypeDefault,
         crossValueAccessor,
         extentAccessors,
         extentPadding,
         idSerializer,
         indicatorMainValueAccessor,
         indicatorTypeDefault,
         mainValueAccessor } from './constants';
import { initAxies, mapChartsToAxies } from "./axis"
import { initSeries } from "./series"
import ohlcAdapter from '../adapters/ohlcAdapter'

const fc = require('d3fc');
const d3 = require('d3');
const _ = require('lodash')

const populateSymbols = (symbols = [], series = [], adapter) => {
  return symbols.map( ({venue, symbol, axis, type, id}) => {
    let symbolId = id || idSerializer(venue, symbol);
    let override = series.find(({id}) => id == symbolId) || {};

    return _.merge({
      id: symbolId,
      adapter: adapter || ohlcAdapter(),
      axis: {...axisDefaults, ...(axis) },
      type: type || chartTypeDefault,
      mainValueAccessor: mainValueAccessor,
      crossValueAccessor: crossValueAccessor,
      symbol: symbol,
      venue: venue
    }, override);
  })
}

const populateIndicators = (indicators = []) => {
  return indicators.map( (i) => {
    return _.merge(i, {
      id: i.id,
      axis: {...axisDefaults, ...(i.axis) },
      type: i.type || indicatorTypeDefault,
      mainValueAccessor: indicatorMainValueAccessor,
      crossValueAccessor: crossValueAccessor
    });
  })
}

export const initChartConfig = ({series, symbols, adapter, indicators}) => {
  let populated_symbols = populateSymbols(symbols, series, adapter);
  let populated_indicators = populateIndicators(indicators);

  // Setup axies
  let axies = initAxies([populated_symbols, populated_indicators].flat());

  // Setup series
  let symbols_charts = initSeries(populated_symbols, axies);
  let indicators_charts = initSeries(populated_indicators, axies);

  return {
    axies: axies,
    charts: symbols_charts,
    indicators: indicators_charts,
    zoom: d3.zoom()
  };
}

export function FinChart(config) {
  this.config = config;

  this.setupChart = function() {
    d3.select('#x-axis').on('draw', this.xAxisDrawHandler)

    d3.select('#y-axis-right')
      .on('measure', this.yAxisRightMeasureHandler)
      .on('draw', this.yAxisDrawHandler)

    d3.select('#y-axis-left')
      .on('measure', this.yAxisLeftMeasureHandler)
      .on('draw', this.yAxisDrawHandler)

    this.config.zoom
      .on('zoom', this.zoomHandler)

    d3.select('#plot-area')
      .on('measure', this.plotAreaMeasureHandler)
      .on('draw', this.plotAreaDrawHandler)
      .call(this.config.zoom)
      .call(this.config.zoom.transform, d3.zoomIdentity);

  }

  this.render = function(from, to, granularity) {
    const data_promises = this.config.charts.map(({symbol, venue, adapter}) => {
      return adapter.getData(venue,symbol,from,to,granularity)}
    );

    Promise.all(data_promises).then(datum => {
      return this.config.charts.map(({id}, i) => { return { data: datum[i].data, id: id }; });
    }).then(datum => {
      let datum_clone = _.cloneDeep(datum);
      let indicatorContext = this;
      let indicator_promises = this.config.indicators.map(({indicatorFunction}) => { return indicatorFunction.call(indicatorContext, datum_clone) })

      return Promise.all(indicator_promises).then(indicator_datum => {
        let mapped_indicator_datum = this.config.indicators.map(({id}, i) => { return { data: indicator_datum[i].data, id: id }; });
        return [datum, mapped_indicator_datum].flat();
      });
    }).then(datum => {
      this.datum = datum;
      this.requestRedraw()
    });

    return this;
  };

  this.requestRedraw = () => {
    if (!this.datum) { return }
    d3.select('#chart')
      .node()
      .requestRedraw();
  };

  this.findAxis = function(vector = "x", name = "1") {
    return this.config.axies.find((a) => { return a.vector === vector && a.name === name; });
  };

  this.xAxisDrawHandler = (d, i, nodes) => {
    d3.select(nodes[i]).select('svg').call(this.findAxis("x", "1").axis);
  };

  this.yAxisRightMeasureHandler = (d, i, nodes) => {
    const { width, height } = event.detail;
    d3.select(nodes[i])
      .select('svg')
      .attr('viewBox', `0 0 ${width} ${height}`);
  };

  this.yAxisLeftMeasureHandler = (d, i, nodes) => {
    const { width, height } = event.detail;
    d3.select(nodes[i])
      .select('svg')
      .attr('viewBox', `${-width} 0 ${width} ${height}`);
  };

  this.yAxisDrawHandler = (d, i, nodes) => {
    // TODO: avoid using ids in logic flow
    let sideIsRight = nodes[i].id == "y-axis-right"
    d3.select(nodes[i])
      .select('svg')
      .selectAll('g')
      .remove();

    const node = d3.select(nodes[i])
      .select('svg')
      .selectAll('g');

    var sel = node.data([0]).enter();

    this.config.axies.forEach( (a) => {
      if (a.vector != 'y') { return; }
      if ((a.side == 'right' && sideIsRight) || (a.side == 'left' && !sideIsRight)) {
        sel.append('g').call(a.axis);
      }
    });
  };

  this.plotAreaMeasureHandler = () => {
    const { width, height, resized } = event.detail;

    this.config.axies.forEach( ({scale, name, vector, zoomScale}, i) => {
      let extent = null;
      let aggregateDatum = [];
      switch (vector) {
        case 'x':

          // TODO: Avoid using external toggles
          if (this.requestRedrawHandleZoom) {
            // Reset zoom range
            let rangeParams = [0, width];
            zoomScale.range(rangeParams);

          } else {
            // handle axis draw
            extent = fc.extentDate()
              .accessors([d => d.date]);
            aggregateDatum = this.datum.map(({data}) => data).flat();

            scale.range([0, width])
              .domain(extent(aggregateDatum));

            zoomScale.domain(scale.domain());
          }

          break;
        case 'y':
          if (!this.requestRedrawHandleZoom) {
            scale.range([height, 0])
              .domain(this.yExtent(this.yData(vector, name)));
          }
          break;
      }
    })
    this.requestRedrawHandleZoom = false;
  };

  this.yExtent = fc.extentLinear().accessors(extentAccessors).pad(extentPadding);
  this.yData = (vector, name) => {
    let ids = [this.config.charts, this.config.indicators].flat()
      .filter(({axis}) => axis.vector === vector && axis.name === name)
      .map((c) => c.id)

    // aggregate all data under this
    return this.datum
      .filter(({id}) => ids.includes(id))
      .map(({data}) => data)
      .flat();
  }

  this.plotAreaDrawHandler = (d, i, nodes) => {
    // remove stale 'g' elements
    // TODO: Update nodes without removing
    d3.select(nodes[i]).select('svg').selectAll("g").remove()

    const node = d3.select(nodes[i]).select('svg').selectAll('g')
    this.datum.forEach(({data, id}) => {
      var sel = node.data([data])
        .enter();

      let chart = [this.config.charts, this.config.indicators].flat().find(s => s.id == id)
      if (!!chart) {
        let selection = sel.append('g');
        selection.call(chart.series);
        this.appendStyle(chart, selection)
      }
    });
  };

  this.appendStyle = (chart, selection) => {
    Object.entries(chart.styles || {}).forEach((style) => {
      selection.selectAll('path').style(...style);
    })
  }

  this.zoomHandler = (args) => {
    // skip if there is no data
    if (!this.datum) { return; }

    // use the rescaleX utility function to compute the new scale
    let xScale = this.findAxis("x")
    let rescaled = d3.event.transform.rescaleX(xScale.zoomScale);

    let [xDomainMin, xDomainMax] = xScale.scale.domain();

    this.config.axies.forEach( ({axis, scale, name, vector}, i) => {
      if (vector != 'y') { return; }

      let values = [this.config.charts, this.config.indicators].flat()
        .filter(({axis}) => axis.name === name)
        .map(({crossValueAccessor, id}) => {
          return this.datum
            .find(data => data.id == id).data
            .filter(d => {
              let date = crossValueAccessor(d);
              return date >= xDomainMin && date <= xDomainMax
            });
        })
        .flat();
      let domain = this.yExtent(values);
      scale.domain(domain);
    });

    xScale.scale.domain(rescaled.domain());
    this.requestRedrawHandleZoom = true;

    this.requestRedraw();
  };

  this.setupChart();
  return this;
}
