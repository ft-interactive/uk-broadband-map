/**
 * @file
 * Histogram component
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as D3 from 'd3';
import * as D3Annotation from 'd3-svg-annotation';
import './styles.scss';

export default class Histogram extends React.Component {
  constructor() {
    super();
    this.node = React.createRef();
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update = () => {
    if (this.props.speeds.length === 0) return;
    D3.select(this.node.current)
      .selectAll('*')
      .remove();
    const width = D3.select(this.node.current)
      .node()
      .getBoundingClientRect().width;
    const height = matchMedia('(max-width: 46.24em)').matches ? width * 1.2 : width * 0.65;
    const margin = {
      top: 110,
      right: 20,
      bottom: 50,
      left: 5,
    };
    const regionID = (name) => {
      switch (name) {
        case 'London': return { code: 'london', phrasing: 'London' };
        case 'Scotland': return { code: 'scotland', phrasing: 'Scotland' };
        case 'South East': return { code: 'se', phrasing: 'the South East' };
        case 'Wales': return { code: 'wales', phrasing: 'Wales' };
        case 'South West': return { code: 'sw', phrasing: 'the South West' };
        case 'East of England': return { code: 'ee', phrasing: 'the East of England' };
        case 'East Midlands': return { code: 'em', phrasing: 'the East Midlands' };
        case 'West Midlands': return { code: 'wm', phrasing: 'the West Midlands' };
        case 'Yorkshire and The Humber': return { code: 'yh', phrasing: 'Yorkshire & the Humber' };
        case 'North West': return { code: 'nw', phrasing: 'the North West' };
        case 'North East': return { code: 'ne', phrasing: 'the North East' };
        default: throw new Error('Unknown area!');
      }
    };
    const region = this.props.geography && this.props.geography.region
      ? regionID(this.props.geography.region)
      : null;
    const bins = this.props.speeds.filter(d => d.megabit <= 150);
    const xScale = D3.scaleLinear()
      .domain([0, bins[bins.length - 1].megabit])
      .range([margin.left, width - margin.right]);
    const yScale = D3.scaleLinear()
      .domain([0, 5])
      .range([height - margin.bottom, margin.top]);
    const xAxis = D3.axisBottom(xScale)
      .tickValues([0, 10, 24, 30, 80, 150])
      .tickSize(12);
    const yAxis = D3.axisRight(yScale)
      .ticks(5)
      .tickFormat((d) => {
        if (d === 0) return null;
        else if (d === 5 && region) return `${d}% of postcodes in ${region.phrasing}`.toUpperCase();
        else if (d === 5) return `${d}% of all postcodes`.toUpperCase();
        return d;
      });
    const svg = D3.select(this.node.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const xAxisElement = svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .attr('font-family', null)
      .attr('font-size', null);
    xAxisElement.selectAll('line,path').attr('stroke', '#939394');
    xAxisElement
      .selectAll('text')
      .attr('fill', '#939394')
      .attr('font-family', 'MetricWeb, sans-serif')
      .attr('font-size', '16px');
    xAxisElement
      .append('text')
      .attr('dy', '-0.2em')
      .attr('x', margin.left + (width - margin.left - margin.right) / 2)
      .attr('y', margin.bottom)
      .attr('fill', '#939394')
      .attr('font-size', '16px')
      .attr('text-anchor', 'middle')
      .text('Average download speed (Mbit/s)'.toUpperCase());
    const yAxisElement = svg
      .append('g')
      .attr('transform', `translate(${margin.left + width - margin.right}, 0)`)
      .call(yAxis)
      .attr('text-anchor', 'end')
      .attr('font-family', null)
      .attr('font-size', null);
    yAxisElement.selectAll('line,path').remove();
    yAxisElement
      .selectAll('text')
      .attr('fill', '#939394')
      .attr('font-family', 'MetricWeb, sans-serif')
      .attr('font-size', '16px');
    svg
      .append('g')
      .attr('stroke', '#616468')
      .selectAll()
      .data(D3.range(5, 0, -1))
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('y1', yScale)
      .attr('x2', (d) => {
        const textWidth = yAxisElement.selectAll('text').nodes()[d].getBBox().width;
        if (d === 5) return width - margin.right - textWidth;
        return width - margin.right;
      })
      .attr('y2', yScale);
    const result = this.props.geography && Object.keys(this.props.geography).length > 0
      ? this.props.speeds.find(d => d.megabit > this.props.geography['Average_download_speed_(Mbit/s)'])
      : null;
    const colours = value => D3.interpolateRgbBasis(['#981626', '#ce0f35', '#ff1a66', '#ff7760', '#ffffcc'])(value / bins.length);
    if (result) {
      svg
        .append('g')
        .selectAll()
        .data(bins)
        .enter()
        .append('rect')
        .attr('fill', d => colours(d.megabit - 2))
        .attr('x', d => xScale(d.megabit - 2))
        .attr('y', d => yScale(d[`${region.code}-rural`] + d[`${region.code}-urban`]))
        .attr('width', (width - margin.left - margin.right) / bins.length)
        .attr('height', d => yScale(0) - yScale(d[`${region.code}-rural`] + d[`${region.code}-urban`]));
    } else if (!this.props.geography) {
      svg
        .append('g')
        .selectAll()
        .data(bins)
        .enter()
        .append('rect')
        .attr('fill', d => colours(d.megabit - 2))
        .attr('x', d => xScale(d.megabit - 2))
        .attr('y', d => yScale(d['national-rural'] + d['national-urban']))
        .attr('width', (width - margin.left - margin.right) / bins.length)
        .attr('height', d => yScale(0) - yScale(d['national-rural'] + d['national-urban']));
      const ruralLine = D3.line()
        .curve(D3.curveStepAfter)
        .x(d => xScale(d.megabit - 2))
        .y(d => yScale(d['national-rural']));
      svg
        .append('path')
        .datum(bins)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('d', ruralLine);
    }
    if (result || !this.props.geography) {
      const tickpoints = bins.filter(bin => [10, 24, 30, 80].includes(bin.megabit));
      svg
        .append('g')
        .attr('stroke', '#262a33')
        .attr('stroke-dasharray', '4, 4')
        .attr('stroke-width', 1)
        .selectAll()
        .data(tickpoints)
        .enter()
        .append('line')
        .attr('x1', d => xScale(d.megabit) + 0.5)
        .attr('y1', yScale(0))
        .attr('x2', d => xScale(d.megabit) + 0.5)
        .attr('y2', (d) => {
          const location = region ? region.code : 'national';
          return yScale(d[`${location}-rural`] + d[`${location}-urban`]);
        });
    }
    if (this.props.geography) {
      const line = D3.line()
        .x(d => xScale(d.megabit - 2) + (width - margin.left - margin.right) / bins.length / 2)
        .y(d => yScale(d['national-rural'] + d['national-urban']));
      svg
        .append('path')
        .datum(bins)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-dasharray', '6, 5')
        .attr('stroke-width', 2.5)
        .attr('d', line);
      const labelify = text => {
        const g = svg
          .append('g')
          .attr('transform', 'translate(30, 0)');
        g
          .append('line')
          .attr('stroke', 'black')
          .attr('x1', Number(text.attr('x')) - 5 + 1)
          .attr('y1', Number(text.attr('y')) - (text.node().getBBox().height / 4) + 1)
          .attr('x2', Number(text.attr('x')) - 25 + 1)
          .attr('y2', Number(text.attr('y')) - (text.node().getBBox().height / 4) + 1);
        g
          .append('line')
          .attr('stroke', 'white')
          .attr('x1', Number(text.attr('x')) - 5)
          .attr('y1', Number(text.attr('y')) - (text.node().getBBox().height / 4))
          .attr('x2', Number(text.attr('x')) - 25)
          .attr('y2', Number(text.attr('y')) - (text.node().getBBox().height / 4));
        g
          .append('text')
          .attr('font-size', text.attr('font-size'))
          .attr('letter-spacing', text.attr('letter-spacing'))
          .attr('fill', 'black')
          .attr('x', Number(text.attr('x')) + 1)
          .attr('y', Number(text.attr('y')) + 1)
          .text(text.text());
        g.append(() => text.remove().node());
      };
      svg
        .append('text')
        .datum(bins[37])
        .attr('x', d => xScale(d.megabit))
        .attr('y', d => yScale(d['national-rural'] + d['national-urban']))
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'start')
        .attr('letter-spacing', '0.3')
        .text('National comparison'.toUpperCase())
        .call(labelify);
    } else if (!this.props.geography) {
      const labelsNationally = svg.append('g');
      labelsNationally
        .append('text')
        .attr('x', xScale(27))
        .attr('y', yScale(2.3))
        .attr('fill', 'white')
        .attr('font-size', 16)
        .attr('text-anchor', 'middle')
        .attr('letter-spacing', 0.3)
        .text('Urban'.toUpperCase());
      labelsNationally
        .append('text')
        .attr('x', xScale(27))
        .attr('y', yScale(0.6))
        .attr('fill', 'white')
        .attr('font-size', 16)
        .attr('text-anchor', 'middle')
        .attr('letter-spacing', 0.3)
        .text('Rural'.toUpperCase());
    }
    const backgroundify = padding => text => {
      const g = svg.append('g');
      g
        .append('rect')
        .attr('x', text.node().getBBox().x - padding)
        .attr('y', text.node().getBBox().y - padding)
        .attr('width', text.node().getBBox().width + (padding * 2))
        .attr('height', text.node().getBBox().height + (padding * 2))
        .attr('fill', 'black')
        .attr('fill-opacity', 0.8)
        .attr('rx', 3)
        .attr('ry', 3);
      g.append(() => text.remove().node());
    };
    if (result && result.megabit <= 150) {
      svg
        .append('circle')
        .datum(result)
        .attr('cx', d => xScale(d.megabit - 1))
        .attr('cy', yScale(0))
        .attr('r', (width - margin.left - margin.right) / bins.length)
        .attr('fill', 'rgba(0, 0, 0, 0.8)')
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
      svg
        .append('text')
        .attr('x', result.megabit <= 60 ? xScale(result.megabit - 2) : xScale(result.megabit))
        .attr('y', yScale(0.35))
        .attr('fill', 'white')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('text-anchor', result.megabit <= 50 ? 'start' : result.megabit >= 100 ? 'end' : 'middle')
        .attr('letter-spacing', '0.3')
        .text(`${this.props.geography['postcode_space']} speed is ${Math.round(this.props.geography['Average_download_speed_(Mbit/s)'])} Mbit/s`)
        .call(backgroundify(5));
    } else if (result) {
      svg
        .append('text')
        .attr('x', xScale(150))
        .attr('y', yScale(0.45))
        .attr('fill', 'white')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('text-anchor', 'end')
        .attr('letter-spacing', '0.3')
        .text(`${this.props.geography['postcode_space']} speed is ${Math.round(this.props.geography['Average_download_speed_(Mbit/s)'])} Mbit/s →`)
        .call(backgroundify(5));
    }
  };

  render() {
    return (
      <div className="histogram">
        <h2>
          {this.props.geography
            ? 'Compare your broadband speed against your area and nationally'
            : 'Britain\'s broadband speeds: not just an urban/rural divide'}
        </h2>
        <div ref={this.node} />
      </div>
    );
  }
}

Histogram.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
  speeds: PropTypes.array.isRequired,
};
