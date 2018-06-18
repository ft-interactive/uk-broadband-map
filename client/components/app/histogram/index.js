/**
 * @file
 * Histogram component
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as D3 from 'd3';
import { propTypeActiveGeography, propTypeSpeed } from '../../../helpers/proptypes';
import './styles.scss';

export default class Histogram extends React.Component {
  constructor() {
    super();
    this.node = React.createRef();
  }

  componentDidMount() {
    addEventListener('resize', this.draw);
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    removeEventListener('resize', this.draw);
  }

  draw = () => {
    if (this.props.speeds.length === 0) return;
    D3.select(this.node.current)
      .selectAll('*')
      .remove();
    const breakpoint = 735;
    const width = D3.select(this.node.current)
      .node()
      .getBoundingClientRect().width;
    const multiplier = width * (width < breakpoint ? 1.05 : 0.6);
    const height = this.props.geography ? multiplier : multiplier - multiplier / 5;
    const margin = {
      top: this.props.geography ? 34 : 5,
      right: 20,
      bottom: 50,
      left: 5,
    };
    const regionID = (name) => {
      switch (name) {
        case 'London':
          return { code: 'london', phrasing: 'London' };
        case 'Scotland':
          return { code: 'scotland', phrasing: 'Scotland' };
        case 'South East':
          return { code: 'se', phrasing: 'the South East' };
        case 'Wales':
          return { code: 'wales', phrasing: 'Wales' };
        case 'South West':
          return { code: 'sw', phrasing: 'the South West' };
        case 'East of England':
          return { code: 'ee', phrasing: 'the East of England' };
        case 'East Midlands':
          return { code: 'em', phrasing: 'the East Midlands' };
        case 'West Midlands':
          return { code: 'wm', phrasing: 'the West Midlands' };
        case 'Yorkshire and The Humber':
          return { code: 'yh', phrasing: 'Yorkshire & the Humber' };
        case 'North West':
          return { code: 'nw', phrasing: 'the North West' };
        case 'North East':
          return { code: 'ne', phrasing: 'the North East' };
        default:
          throw new Error('Unknown area!');
      }
    };
    const region =
      this.props.geography && this.props.geography.region
        ? regionID(this.props.geography.region)
        : null;
    const bins = this.props.speeds.filter(d => d.megabit <= 150);
    const xTicks = [0, 10, 24, 30, 80, 150];
    const yTicks = this.props.geography ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
    const xScale = D3.scaleLinear()
      .domain([0, bins[bins.length - 1].megabit])
      .range([margin.left, width - margin.right]);
    const yScale = D3.scaleLinear()
      .domain([0, yTicks.length])
      .range([height - margin.bottom, margin.top]);
    const xAxis = D3.axisBottom(xScale)
      .tickValues(xTicks)
      .tickSize(12);
    const yAxis = D3.axisRight(yScale)
      .ticks(yTicks.length)
      .tickFormat((d) => {
        if (d === 0 || d > 5) return null;
        else if (d === 5 && !this.props.geography) return `${d}% of all postcodes`.toUpperCase();
        else if (d === 5) return `${d}%`;
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
      .attr('font-size', width < breakpoint ? 14 : 16);
    xAxisElement
      .append('text')
      .attr('dy', '-0.2em')
      .attr('x', margin.left + (width - margin.left - margin.right) / 2)
      .attr('y', margin.bottom)
      .attr('fill', '#939394')
      .attr('font-size', width < breakpoint ? 14 : 16)
      .attr('text-anchor', 'middle')
      .attr('letter-spacing', 0.6)
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
      .attr('font-size', width < breakpoint ? 14 : 16);
    if (this.props.geography) {
      yAxisElement
        .append('text')
        .attr('y', yScale(6))
        .attr('dx', '0.5em')
        .attr('dy', '0.35em')
        .attr('fill', '#939394')
        .attr('font-size', width < breakpoint ? 14 : 16)
        .attr('text-anchor', 'end')
        .text(() => {
          if (region) return `Postcodes in ${region.phrasing}`.toUpperCase();
          return 'All postcodes'.toUpperCase();
        });
    }
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
        const textWidth = yAxisElement
          .selectAll('text')
          .nodes()[d].getBBox().width; // prettier-ignore
        if (d === 5) return width - margin.left - 6 - textWidth;
        return width - margin.right;
      })
      .attr('y2', yScale);
    const result =
      this.props.geography && Object.keys(this.props.geography).length > 0
        ? this.props.speeds.find(
          d => d.megabit > this.props.geography['Average_download_speed_(Mbit/s)'],
        )
        : null;
    const colours = value =>
      D3.interpolateRgbBasis([
        '#981626',
        '#c41439',
        '#ef1757',
        '#ff5a5f',
        '#ff8d67',
        '#ffb67f',
        '#ffdca2',
        '#ffffcc',
      ])(value / bins.length);
    if (this.props.geography && Object.keys(this.props.geography).length > 0) {
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
        .attr(
          'height',
          d => yScale(0) - yScale(d[`${region.code}-rural`] + d[`${region.code}-urban`]),
        );
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
    }
    if (result || !this.props.geography) {
      const tickpoints = bins.filter(bin =>
        xTicks.slice(1, xTicks.length - 1).includes(bin.megabit),
      );
      svg
        .append('g')
        .attr('stroke', '#262a33')
        .attr('stroke-dasharray', '4, 4')
        .attr('stroke-opacity', 0.65)
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
    if (!this.props.geography) {
      const ruralLine = D3.line()
        .curve(D3.curveStepAfter)
        .x(d => xScale(d.megabit - 2))
        .y(d => yScale(d['national-rural']));
      svg
        .append('path')
        .datum(bins)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-dasharray', '4, 3')
        .attr('stroke-opacity', 0.9)
        .attr('d', ruralLine);
    }
    if (this.props.geography) {
      const line = D3.line()
        .x(d => xScale(d.megabit - 2) + (width - margin.left - margin.right) / bins.length / 2)
        .y(d => yScale(d['national-rural'] + d['national-urban']));
      svg
        .append('defs')
        .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
        .attr('stdDeviation', 1);
      svg
        .append('path')
        .datum(bins)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-dasharray', '6, 5')
        .attr('stroke-width', 2.5)
        .attr('filter', 'url(#blur)')
        .attr('d', line);
      svg
        .append('path')
        .datum(bins)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-dasharray', '6, 5')
        .attr('stroke-width', 2.5)
        .attr('d', line);
      const labelify = (text) => {
        const g = svg.append('g').attr('transform', 'translate(20, 0)');
        g
          .append('line')
          .attr('x1', Number(text.attr('x')) - 5 + 1)
          .attr('y1', Number(text.attr('y')) - text.node().getBBox().height / 4 + 1)
          .attr('x2', Number(text.attr('x')) - 20 + 1)
          .attr('y2', Number(text.attr('y')) - text.node().getBBox().height / 4 + 1)
          .attr('stroke', 'black');
        g
          .append('line')
          .attr('x1', Number(text.attr('x')) - 5)
          .attr('y1', Number(text.attr('y')) - text.node().getBBox().height / 4)
          .attr('x2', Number(text.attr('x')) - 20)
          .attr('y2', Number(text.attr('y')) - text.node().getBBox().height / 4)
          .attr('stroke', 'white');
        g
          .append('text')
          .attr('x', Number(text.attr('x')) + 1)
          .attr('y', Number(text.attr('y')) + 1)
          .attr('fill', 'black')
          .attr('font-size', text.attr('font-size'))
          .attr('letter-spacing', text.attr('letter-spacing'))
          .text(text.text());
        g.append(() => text.remove().node());
      };
      svg
        .append('text')
        .datum(bins[36])
        .attr('x', d => xScale(d.megabit))
        .attr('y', d => yScale(d['national-rural'] + d['national-urban']))
        .attr('fill', 'white')
        .attr('font-size', width < breakpoint ? 12 : 14)
        .attr('text-anchor', 'start')
        .attr('letter-spacing', width < breakpoint ? 0.2 : 0.3)
        .text('National comparison'.toUpperCase())
        .call(labelify);
    } else if (!this.props.geography) {
      const labelsNationally = svg.append('g');
      labelsNationally
        .append('text')
        .attr('x', xScale(27))
        .attr('y', yScale(2.2))
        .attr('fill', 'white')
        .attr('font-size', width < breakpoint ? 14 : 16)
        .attr('text-anchor', 'middle')
        .attr('letter-spacing', 0.3)
        .text('Urban'.toUpperCase());
      labelsNationally
        .append('text')
        .attr('x', xScale(27))
        .attr('y', yScale(0.5))
        .attr('fill', 'white')
        .attr('font-size', width < breakpoint ? 14 : 16)
        .attr('text-anchor', 'middle')
        .attr('letter-spacing', 0.3)
        .text('Rural'.toUpperCase());
      const labelify = g =>
        g.datum().forEach((item) => {
          const label = g.append('g');
          label
            .append('text')
            .attr('x', xScale(item.target.megabit - 2))
            .attr('y', yScale(item.offset))
            .attr('dx', '0.25em')
            .attr('dy', '0.65em')
            .attr('font-size', width < breakpoint ? 14 : 16)
            .attr('font-weight', 600)
            .attr('fill', 'white')
            .text(item.label);
          label
            .append('line')
            .attr('x1', xScale(item.target.megabit - 2))
            .attr('y1', yScale(0))
            .attr('x2', xScale(item.target.megabit - 2))
            .attr('y2', yScale(item.offset))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.4);
          label
            .append('line')
            .attr('x1', xScale(item.target.megabit - 2))
            .attr('y1', yScale(0))
            .attr('x2', xScale(item.target.megabit - 2))
            .attr('y2', yScale(item.offset))
            .attr('stroke', 'white');
        });
      const labels = [
        {
          label: 'Knightsbridge', // SW7 1BX
          target: bins[4],
          offset: 4.75,
        },
        {
          label: 'Rural Shropshire', // TF11 8AE
          target: bins[31],
          offset: 2.5,
        },
      ];
      svg
        .append('g')
        .datum(labels)
        .call(labelify);
    }
    const backgroundify = padding => (text) => {
      const g = svg.append('g');
      g
        .append('rect')
        .attr('x', text.node().getBBox().x - padding * 2)
        .attr('y', text.node().getBBox().y - padding)
        .attr('width', text.node().getBBox().width + padding * 4)
        .attr('height', text.node().getBBox().height + padding * 2)
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
        .attr(
          'x',
          result.megabit <= 50
            ? xScale(result.megabit - 2)
            : result.megabit >= 80
              ? xScale(result.megabit)
              : xScale(result.megabit - 1),
        )
        .attr('y', width < breakpoint ? yScale(0.3) : yScale(0.4))
        .attr('fill', 'white')
        .attr('font-size', width < breakpoint ? 14 : 16)
        .attr('font-weight', 600)
        .attr(
          'text-anchor',
          result.megabit <= 50 ? 'start' : result.megabit >= 80 ? 'end' : 'middle',
        )
        .attr('letter-spacing', 0.3)
        .text(
          `${this.props.geography.postcode_space} speed is ${Math.round(
            this.props.geography['Average_download_speed_(Mbit/s)'],
          )} Mbit/s`,
        )
        .call(backgroundify(width < breakpoint ? 3 : 5));
    } else if (result) {
      svg
        .append('text')
        .attr('x', xScale(150) - 10)
        .attr('y', width < breakpoint ? yScale(0.3) : yScale(0.4))
        .attr('fill', 'white')
        .attr('font-size', width < breakpoint ? 14 : 16)
        .attr('font-weight', 600)
        .attr('text-anchor', 'end')
        .attr('letter-spacing', 0.3)
        .text(
          `${this.props.geography.postcode_space} speed is ${Math.round(
            this.props.geography['Average_download_speed_(Mbit/s)'],
          )} Mbit/s →`,
        )
        .call(backgroundify(width < breakpoint ? 3 : 5));
    }
  };

  render() {
    return <div className="histogram" ref={this.node} />;
  }
}

Histogram.propTypes = {
  geography: propTypeActiveGeography,
  speeds: PropTypes.arrayOf(propTypeSpeed).isRequired,
};

Histogram.defaultProps = {
  geography: undefined,
};
