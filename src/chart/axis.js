const fc = require('d3fc');
const d3 = require('d3');

const initAxies = (charts) => {
  const scales = charts.map(c => c.axis)
    .reduce((acc, axis, _i, _arr) => {
      const currentAxis = axis.vector.concat(axis.name);
      const exists = !!acc.find(el => el.vector.concat(el.name) == currentAxis);
      if (!exists) { acc.push(initAxis(axis)); }
      return acc;
    }, []);

  let xAxis = initAxis({ vector: 'x', name: '1'});
  scales.unshift(xAxis);
  return scales;
};


const initAxis = (json) => {
  let scale = null;
  let axis = null;
  switch (json.vector) {
    case 'x':
      scale = fc.scaleDiscontinuous(d3.scaleTime()).discontinuityProvider(fc.discontinuityIdentity());
      axis = d3.axisBottom().scale(scale);
      break;
    default:
      scale = d3.scaleLinear();
      if (json.side == 'left') {
        axis = d3.axisLeft().scale(scale);
      } else {
        axis = d3.axisRight().scale(scale);
      }
      break;
  }

  return {
    vector: json.vector,
    name: json.name,
    side: json.side,
    scale: scale,
    axis: axis,
    zoomScale: scale.copy()
  };
};

export { initAxies };
