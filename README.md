
:warning: This library is a work in progress.

# pixel-stats
Calculate Statistics for Imagery Pixels

# known limitations
This package currently supports the following statistics: histogram, min, max, mean, mode, and sum.
Support for standard deviation and median is forthcoming.

# install
```bash
npm install pixel-stats
```

# usage
```javascript
const calc = require('pixel-stats');

const pixels = [band1array, band2array, band3array];

const options = {
    interleaved: false,
    max: true,
    mean: true,
    median: true,
    mode: true,
    min: true,
    sum: false // don't return the sum of each band
};

const stats = calc(pixels, options);
```

# cloud optimized geotiffs
If you are looking to calculate statistics for a geotiff, consider using [geotiff-stats](https://github.com/geotiff/geotiff-stats).