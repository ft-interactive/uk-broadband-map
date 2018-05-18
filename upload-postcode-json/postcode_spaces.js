/**
 * @file
 * Tests whether
 */

const { readFileSync } = require('fs');
const d3 = require('d3');
const Papa = require('papaparse');

const { data } = Papa.parse(readFileSync(`${__dirname}/truncated.csv`, 'utf-8'), {
  header: true,
});

const withSpace = data.map(d => d.postcode_space);
const withoutSpace = data.map(d => d.postcode);

console.log(
  `Lines: ${data.length} :: With spaces: ${new Set(withSpace).size} :: Without spaces: ${
    new Set(withoutSpace).size
  }`,
);

console.log(
  `Biggest prefix: ${d3.max([...withSpace].filter(Boolean).map(d => d.split(' ')[0].length))}`,
);
