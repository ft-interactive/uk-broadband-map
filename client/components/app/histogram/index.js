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
    svg
      .append('g')
      .attr('stroke', '#262a33')
      .attr('stroke-dasharray', '4, 4')
      .attr('stroke-width', 1)
      .selectAll()
      .data([10, 24, 30, 80])
      .enter()
      .append('line')
      .attr('x1', d => xScale(d) + 0.5)
      .attr('y1', 0)
      .attr('x2', d => xScale(d) + 0.5)
      .attr('y2', height - margin.bottom);
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
      const labelsNational = D3Annotation.annotation()
        .accessors({
          x: d => xScale(d.megabit),
          y: d => yScale(d['national-rural'] + d['national-urban']),
        })
        .annotations([
          {
            type: D3Annotation.annotationLabel,
            dx: 20,
            dy: 0,
            data: bins[37],
            note: {
              type: 'line',
              align: 'middle',
              orientation: 'leftRight',
              label: 'National comparison'.toUpperCase(),
            },
          },
        ]);
      const labelsNationalElements = svg
        .append('g')
        .attr('font-size', '14px')
        .call(labelsNational);
      labelsNationalElements.selectAll('.annotation-note-title, .annotation-note-bg').remove();
      labelsNationalElements.selectAll('.connector').attr('stroke', 'white');
      labelsNationalElements
        .selectAll('.annotation-note-label')
        .attr('fill', 'white')
        .attr('letter-spacing', '0.3');
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
      const labelsRegional = D3Annotation.annotation()
        .accessors({
          x: d => (result.megabit <= 60 ? xScale(d.megabit - 2) : xScale(d.megabit)),
          y: d => yScale(0) - 40,
        })
        .annotations([
          {
            type: D3Annotation.annotationLabel,
            data: result,
            note: {
              type: 'line',
              align: result.megabit <= 50 ? 'left' : result.megabit >= 100 ? 'right' : 'middle',
              orientation: 'topBottom',
              wrap: width - margin.left - margin.right,
              padding: 0,
              label: `${this.props.geography['postcode_space']} speed is ${Math.round(this.props.geography['Average_download_speed_(Mbit/s)'])} Mbit/s`,
            },
          },
        ]);
      const labelsRegionalElements = svg
        .append('g')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.3')
        .call(labelsRegional);
      labelsRegionalElements.selectAll('.annotation-note-title, .annotation-connector').remove();
      labelsRegionalElements
        .selectAll('.annotation-note-bg')
        .attr('fill', 'black')
        .attr('fill-opacity', 0.8)
        .attr('rx', 3)
        .attr('ry', 3);
      labelsRegionalElements.selectAll('.annotation-note-label').attr('fill', 'white');
    } else if (result) {
      const labelsRegionalElements = svg
        .append('g')
        .attr('transform', `translate(${xScale(150) - 200}, ${yScale(0) - 20 - 20})`);
      labelsRegionalElements
        .append('rect')
        .attr('width', 200)
        .attr('height', 20)
        .attr('fill', 'black')
        .attr('fill-opacity', 0.8)
        .attr('rx', 3)
        .attr('ry', 3);
      labelsRegionalElements
        .append('text')
        .attr('dy', '1em')
        .attr('fill', 'white')
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.3')
        .text(`${this.props.geography['postcode_space']} speed is ${Math.round(this.props.geography['Average_download_speed_(Mbit/s)'])} Mbit/s`);
    }
  };

  render() {
    return (
      <div className="histogram">
        <h2>
          {this.props.geography
            ? 'Compare your broadband speed against your area and nationally'
            : 'Static national broadband speed title here'}
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
