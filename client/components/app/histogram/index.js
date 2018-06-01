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
    const height = width * 0.65;
    const margin = {
      top: 110,
      right: 20,
      bottom: 48,
      left: 5,
    };
    const regionID = name => {
      switch (name) {
        case 'London': return { code: 'London', phrasing: 'London' };
        case 'Scotland': return { code: 'Scotland', phrasing: 'Scotland' };
        case 'South East': return { code: 'SE', phrasing: 'the South East' };
        case 'Wales': return { code: 'Wales', phrasing: 'Wales' };
        case 'South West': return { code: 'SW', phrasing: 'the South West' };
        case 'East of England': return { code: 'EE', phrasing: 'the East of England' };
        case 'East Midlands': return { code: 'EM', phrasing: 'the East Midlands' };
        case 'West Midlands': return { code: 'WM', phrasing: 'the West Midlands' };
        case 'Yorkshire and The Humber': return { code: 'YH', phrasing: 'Yorkshire & the Humber' };
        case 'North West': return { code: 'NW', phrasing: 'the North West' };
        case 'North East': return { code: 'NE', phrasing: 'the North East' };
        default: throw new Error('Unknown area!');
      }
    };
    const region = this.props.geography.region ? regionID(this.props.geography.region) : null;
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
      .tickFormat(d => {
        if (d === 0) return null;
        else if (d === 5 && region) return `${d}% of all postcodes in ${region.phrasing}`.toUpperCase();
        else if (d === 5) return '% of all national postcodes'.toUpperCase();
        else return d;
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
    xAxisElement.selectAll('text')
      .attr('fill', '#939394')
      .attr('font-family', 'MetricWeb, sans-serif')
      .attr('font-size', '16px');
    xAxisElement
      .append('text')
      .attr('dy', '-0.2em')
      .attr('x', margin.left + ((width - margin.left - margin.right) / 2))
      .attr('y', margin.bottom)
      .attr('fill', '#939394')
      .attr('font-size', '14px')
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
    yAxisElement.selectAll('text')
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
      .attr('x2', d => {
        if (d === 5) return width - margin.right - yAxisElement.selectAll('text').nodes()[d].getBBox().width;
        else return width - margin.right;
      })
      .attr('y2', yScale);
    if (Object.keys(this.props.geography).length > 0) {
      const yourSpeed = this.props.geography['Average_download_speed_(Mbit/s)'];
      const colours = value => D3.interpolateRgbBasis(['#981626', '#ce0f35', '#ff1a66', '#ff7760', '#ffffcc'])(value / bins.length);
      const columns = svg
        .append('g')
        .selectAll()
        .data(bins)
        .enter()
        .append('rect')
        .attr('fill', d => colours(d.megabit - 2))
        .attr('x', d => xScale(d.megabit - 2))
        .attr('y', d => yScale(d[`${region.code}_rural`] + d[`${region.code}_urban`]))
        .attr('width', (width - margin.left - margin.right) / bins.length)
        .attr('height', d => yScale(0) - yScale(d[`${region.code}_rural`] + d[`${region.code}_urban`]));
      columns
        .filter(d => d.megabit > yourSpeed)
        .filter((_, i) => i === 0)
        .attr('stroke', d => d.megabit > 60 ? 'black' : 'white')
        .raise();
    }
    const line = D3.line()
      .x(d => xScale(d.megabit - 2) + (((width - margin.left - margin.right) / bins.length) / 2))
      .y(d => yScale(d.national_pct));
    svg
      .append('path')
      .datum(bins)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-dasharray', '6, 5')
      .attr('stroke-width', 2.5)
      .attr('d', line);
  };

  render() {
    return <div className="histogram">
      <h2>Compare your broadband speed against your area and nationally</h2>
      <div ref={this.node}/>
    </div>
  }
}

Histogram.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
  speeds: PropTypes.array.isRequired,
};
