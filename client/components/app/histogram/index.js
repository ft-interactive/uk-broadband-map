/**
 * @file
 * Histogram component
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as D3 from 'd3';
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
      top: 100,
      right: 15,
      bottom: 50,
      left: 40,
    };
    const bins = this.props.speeds.filter(d => d.megabit <= 150);
    const xScale = D3.scaleLinear()
      .domain([0, bins[bins.length - 1].megabit])
      .range([margin.left, width - margin.right]);
    const yScale = D3.scaleLinear()
      .domain([0, 5])
      .range([height - margin.bottom, margin.top]);
    const xAxis = D3.axisBottom(xScale).tickValues([0, 10, 24, 30, 80, 150]).tickSize(12);
    const yAxis = D3.axisLeft(yScale).ticks(5);
    const svg = D3.select(this.node.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', 25)
      .attr('fill', 'white')
      .attr('font-family', 'FinancierDisplayWeb, serif')
      .attr('font-size', '37px')
      .text('Compare your broadband speed against your area and nationally');
    svg
      .append('g')
      .attr('stroke', '#616468')
      .selectAll()
      .data(D3.range(5, 0, -1))
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('y1', yScale)
      .attr('x2', width - margin.right)
      .attr('y2', yScale);
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
      .attr('x', width - margin.right)
      .attr('y', 45)
      .attr('fill', '#939394')
      .attr('font-size', '14px')
      .attr('text-anchor', 'end')
      .text('Average download speed (Mbit/s)'.toUpperCase());
    const yAxisElement = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .attr('font-family', null)
      .attr('font-size', null);
    yAxisElement.selectAll('line,path').attr('stroke', 'none');
    yAxisElement.selectAll('text')
      .attr('fill', '#939394')
      .attr('font-family', 'MetricWeb, sans-serif')
      .attr('font-size', '16px');
    yAxisElement
      .append('text')
      .attr('x', -200)
      .attr('y', -25)
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#939394')
      .attr('font-size', '14px')
      .attr('text-anchor', 'start')
      .text('% of postcodes'.toUpperCase());
    if (Object.keys(this.props.geography).length > 0) {
      const yourSpeed = this.props.geography['Average_download_speed_(Mbit/s)'];
      const regionID = (name) => {
        switch (name) {
          case 'London':
            return 'London';
          case 'Scotland':
            return 'Scotland';
          case 'Wales':
            return 'Wales';
          case 'South East':
            return 'SE';
          case 'South West':
            return 'SW';
          case 'East of England':
            return 'EE';
          case 'East Midlands':
            return 'EM';
          case 'West Midlands':
            return 'WM';
          case 'Yorkshire and The Humber':
            return 'YH';
          case 'North West':
            return 'NW';
          case 'North East':
            return 'NE';
        }
      };
      const region = regionID(this.props.geography.region);
      const colours = value => D3.interpolateRgbBasis(['#981626', '#ce0f35', '#ff1a66', '#ff7760', '#ffffcc'])(value / bins.length);
      const columns = svg
        .append('g')
        .selectAll()
        .data(bins)
        .enter()
        .append('rect')
        .attr('fill', d => colours(d.megabit - 2))
        .attr('x', d => xScale(d.megabit - 2))
        .attr('y', d => yScale(d[`${region}_rural`] + d[`${region}_urban`]))
        .attr('width', (width - margin.left - margin.right) / bins.length)
        .attr('height', d => yScale(0) - yScale(d[`${region}_rural`] + d[`${region}_urban`]));
      columns
        .filter(d => d.megabit > yourSpeed)
        .filter((_, i) => i === 0)
        .attr('stroke', 'white');
    }
    const line = D3.line()
      .x(d => xScale(d.megabit - 2) + ((width - margin.left - margin.right) / bins.length))
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
    return <div className="histogram" ref={this.node} />;
  }
}

Histogram.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
  speeds: PropTypes.array.isRequired,
};
