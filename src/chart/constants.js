export const axisDefaults = { vector: 'y', name: '1', side: 'right' };
export const chartTypeDefault = 'candlestick';
export const indicatorTypeDefault = 'line';
export const mainValueAccessor = d => d.close;
export const indicatorMainValueAccessor = d => d.value;
export const crossValueAccessor = d => d.date;
export const idSerializer = function() { return [].concat(...arguments).join("-"); }
export const extentPadding = [0.1, 0.1];
export const extentAccessors = [d => d.high, d => d.low, d => d.value];
