const test = require("ava");
const calc = require("./index");

const bands = [
  // red
  [
    [255, 255, 255],
    [0, 24, 56],
    [45, 42, 95],
  ],

  // green
  [
    [37, 43, 54],
    [0, 12, 56],
    [53, 12, 65],
  ],

  // blue
  [
    [17, 89, 82],
    [0, 12, 56],
    [90, 74, 48],
  ],
];

test("calculating min, max and ranges", (t) => {
  const options = {
    interleaved: false,
    max: true,
    mean: false,
    median: true,
    mode: false,
    min: true,
    range: true,
    sum: false, // don't return the sum of each band
  };

  const stats = calc(bands, options);
  t.deepEqual(stats, {
    mins: [0, 0, 0],
    maxs: [255, 65, 90],
    ranges: [255, 65, 90],
  });
});

test("calculating min, max, means, modes, ranges, and sums", (t) => {
  const options = {
    debug: false,
    interleaved: false,
    max: true,
    mean: true,
    median: true,
    mode: true,
    min: true,
    range: false,
    sum: true, // don't return the sum of each band
  };

  const stats = calc(bands, options);
  t.deepEqual(stats, {
    means: [114.11111111111111, 36.888888888888886, 52],
    modes: [[255], [12], [0, 12, 17, 48, 56, 74, 82, 89, 90]],
    mins: [0, 0, 0],
    maxs: [255, 65, 90],
    sums: [1027, 332, 468],
  });
});

test("calculating histograms", (t) => {
  const options = {
    debug: false,
    interleaved: false,
    max: false,
    min: false,
    histogram: true,
  };

  const stats = calc(bands, options);
  t.deepEqual(stats, {
    histograms: [
      {
        0: 1,
        24: 1,
        255: 3,
        42: 1,
        45: 1,
        56: 1,
        95: 1,
      },
      {
        0: 1,
        12: 2,
        37: 1,
        43: 1,
        53: 1,
        54: 1,
        56: 1,
        65: 1,
      },
      {
        0: 1,
        12: 1,
        17: 1,
        48: 1,
        56: 1,
        74: 1,
        82: 1,
        89: 1,
        90: 1,
      },
    ],
  });
});
