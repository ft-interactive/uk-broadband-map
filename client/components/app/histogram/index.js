/**
 * @file
 * Histogram component
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as D3 from 'd3';

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
    D3.select(this.node.current).selectAll('*').remove();
    const width = 960;
    const height = 500;
    const margin = {
      top: 5,
      right: 40,
      bottom: 45,
      left: 10,
    };
    const bins = this.props.speeds.filter(d => d.megabit <= 150);
    const xScale = D3.scaleLinear()
      .domain([0, bins[bins.length - 1].megabit])
      .range([margin.left, width - margin.right]);
    const yScale = D3.scaleLinear()
      .domain([0, 5])
      .range([height - margin.bottom, margin.top])
    const xAxis = D3.axisBottom(xScale)
      .tickValues([0, 10, 24, 30, 150])
    const yAxis = D3.axisRight(yScale)
      .ticks(5);
    const svg = D3.select('svg')
      .attr('width', width)
      .attr('height', height);
    const xAxisElement = svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .attr('font-family', null)
      .attr('font-size', null);
    xAxisElement.selectAll('line,path')
      .attr('stroke', '#a8aaad');
    xAxisElement.selectAll('text')
      .attr('fill', '#a8aaad');
    xAxisElement.append('text')
      .attr('x', 10)
      .attr('y', 40)
      .attr('text-anchor', 'start')
      .attr('fill', 'white')
      .text('Broadband speed');
    const yAxisElement = svg.append('g')
      .attr('transform', `translate(${width - margin.right}, 0)`)
      .call(yAxis)
      .attr('font-family', null)
      .attr('font-size', null);
    yAxisElement.selectAll('line,path')
      .attr('stroke', '#a8aaad');
    yAxisElement.selectAll('text')
      .attr('fill', '#a8aaad');
    yAxisElement.append('text')
      .attr('x', 5)
      .attr('y', -25)
      .attr('text-anchor', 'start')
      .attr('fill', 'white')
      .attr('transform', 'rotate(90)')
      .text('Percent of postcodes');
    if (Object.keys(this.props.geography).length > 0) {
      svg.append('text')
        .attr('x', 10)
        .attr('y', 15)
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .text(this.props.geography.region);
      const yourSpeed = this.props.geography['Average_download_speed_(Mbit/s)'];
      const regionID = name => {
        switch (name) {
          case 'London': return 'London';
          case 'Scotland': return 'Scotland';
          case 'Wales': return 'Wales';
          case 'South East': return 'SE';
          case 'South West': return 'SW';
          case 'East of England': return 'EE';
          case 'West Midlands': return 'WM';
          case 'Yorkshire and The Humber': return 'YH';
          case 'North West': return 'NW';
          case 'North East': return 'NE';
        }
      }
      const region = regionID(this.props.geography.region);
      const columns = svg.append('g')
        .selectAll()
        .data(bins)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${xScale(d.megabit - 2)}, 0)`);
      columns.append('rect')
        .attr('fill', d => D3.interpolateBlues((d.megabit - 2) / bins.length))
        .attr('y', d => yScale(d[`${region}_rural`]))
        .attr('width', (width - margin.left - margin.right) / bins.length)
        .attr('height', d => yScale(0) - yScale(d[`${region}_rural`]));
      columns.append('rect')
        .attr('fill', d => D3.interpolateReds((d.megabit - 2) / bins.length))
        .attr('y', d => yScale(d[`${region}_urban`]) - (yScale(0) - yScale(d[`${region}_rural`])))
        .attr('width', (width - margin.left - margin.right) / bins.length)
        .attr('height', d => yScale(0) - yScale(d[`${region}_urban`]));
      const yourColumn = columns.filter(d => d.megabit > yourSpeed).filter((_, i) => i === 0);
      yourColumn.append('path')
        .attr('d', D3.symbol().type(D3.symbolTriangle))
        .attr('fill', 'white')
        .attr('transform', d => {
          const x = -((width - margin.left - margin.right) / bins.length) / 2;
          const y = -yScale(d[`${region}_rural`] + d[`${region}_urban`]) + 15;
          return `rotate(180) translate(${x}, ${y})`
        })
        .attr('width', ((width - margin.left - margin.right) / bins.length) / 2)
        .attr('height', 10)
    }
    const line = D3.line()
      .x(d => xScale(d.megabit - 2))
      .y(d => yScale(d['national_pct']));
    svg.append('path')
      .datum(bins)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-dasharray', '4, 4')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }

  render() {
    return <svg ref={this.node}/>;
  }
}

Histogram.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
  speeds: PropTypes.array.isRequired,
};
