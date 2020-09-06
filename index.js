function calc(values, options) {
  const debug = (options && options.debug) || false;
  const noDataValue =
    options && options.hasOwnProperty("noDataValue")
      ? options.noDataValue
      : undefined;

  const returnMin = (options && options.min) || false;
  const returnMax = (options && options.max) || false;
  const returnRange = (options && options.range) || false;
  const calcMin = returnMin || returnRange;
  const calcMax = returnMax || returnRange;
  const calcMean = (options && options.mean) || false;
  const calcMedian = (options && options.median) || false;
  const calcMode = (options && options.mode) || false;

  const calcRange = (options && options.range) || false;
  const calcSum = (options && options.sum) || calcMean;
  const returnHistogram = options && options.histogram;
  const calcHistogram = returnHistogram || calcMedian || calcMode;

  const numBands = values.length;
  const height = values[0].length;
  const width = values[0][0].length;
  const numPixelsPerBand = height * width;

  const maxs = [];
  const means = [];
  const medians = [];
  const mins = [];
  const modes = [];
  const ranges = [];
  const sums = [];
  const histograms = [];

  for (let bandIndex = 0; bandIndex < numBands; bandIndex++) {
    let max;
    let min;
    let sum = 0;
    const histogram = {};
    const rows = values[bandIndex];
    if (debug) console.log("[pixel-stats] rows:", rows);
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const row = rows[rowIndex];
      for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        const value = row[columnIndex];
        if (value != noDataValue && !isNaN(value)) {
          if (calcMin && (typeof min === "undefined" || value < min))
            min = value;
          else if (calcMax && (typeof max === "undefined" || value > max))
            max = value;
          if (calcSum) sum += value;
          if (calcHistogram) {
            if (histogram[value]) histogram[value]++;
            else histogram[value] = 1;
          }
        }
      }
    }

    if (calcMax) maxs.push(max);
    if (calcMin) mins.push(min);
    if (calcMean) means.push(sum / numPixelsPerBand);
    if (calcHistogram || calcMedian || calcMode) {
      const sorted = Object.entries(histogram).sort((a, b) =>
        Math.sign(a[1] - b[1])
      );
      if (debug) console.log({ sorted });
      if (calcMode) {
        const maxCount = sorted[sorted.length - 1][1];
        const band_modes = sorted
          .filter(([value, count]) => count === maxCount)
          .map(([value, count]) => parseFloat(value));
        if (debug) console.log("band_modes:", band_modes);
        modes.push(band_modes);
      }
      if (returnHistogram) histograms.push(histogram);
      if (calcMedian) {
        if (numPixelsPerBand % 2 === 0) {
          const halfway = numPixelsPerBand / 2;
          let pixnum = 0;
          for (let i = 0; i < sorted.length; i++) {
            const [value, count] = sorted[i];
            pixnum += count;
            if (pixnum >= halfway) {
              medians.push(value);
            }
          }
        } else {
        }
      }
    }
    if (calcRange) ranges.push(max - min);
    if (options && options.sum) sums.push(sum);
  }
  const results = {};
  if (calcMean) results.means = means;
  if (calcMode) results.modes = modes;
  if (calcRange) results.ranges = ranges;
  if (returnHistogram) results.histograms = histograms;
  if (returnMax) results.maxs = maxs;
  if (returnMin) results.mins = mins;
  if (options && options.sum) results.sums = sums;
  return results;
}

module.exports = calc;
