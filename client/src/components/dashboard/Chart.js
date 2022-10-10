import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import {
  height,
  width,
  setNodePositions,
  getNodePosition,
  showLabel,
} from '../../util/chartHelpers.js';

const chartType = {
  'name': 'treemap',
  'artist': 'treemap',
  'album': 'treemap',
  'danceability': 'radial',
  'energy': 'radial',
  'liveness': 'radial',
  'loudness': 'radial',
  'popularity': 'radial',
  'speechiness': 'radial',
  'tempo': 'radial'
};

function Chart({ playlistTracks, chartKey }) {
  const chartRef = useRef(undefined);
  const nodes = useRef(playlistTracks.map((element) => {
    element['radius'] = 6;
    return element;
  }));
  const tooltip = useRef(undefined);

  useEffect(() => {
    if (playlistTracks && chartRef) {
      d3.selectAll('g').remove();
      d3.selectAll('.label').remove();
      d3.selectAll('.axis').remove();

      const svg = d3.select(chartRef.current)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserverAspectiveRatio', 'xMidYMid meet');

      const centers = setNodePositions(nodes.current, chartKey, chartType[chartKey]);
      const node_container = svg.append('g');

      const circles = node_container.selectAll('.circle')
        .data(nodes.current)
        .enter()
        .append('circle')
        .attr('r', (node) => { return node.radius; })
        .attr('cx', (node) => { return node.x; })
        .attr('cy', (node) => { return node.y; })
        .attr('class', 'circle')
        .on('mouseover', (selected, node) => {
          const xPosition = selected.layerX;
          const yPosition = selected.layerY - 40;

          tooltip.current.html(`${node['name']}<br/>${node['artist']}`)
            .style('visibility', 'visible')
            .style('left',`${xPosition}px`)
            .style('top', `${yPosition}px`)
        })
        .on('mouseleave', () => {
          tooltip.current.style('visibility', 'hidden');
        });

      tooltip.current = d3.select('.chart-container').append('div')
        .attr('className', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('color', 'black')
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('border-radius', '5px')
        .style('padding', '2px');

      const simulation = d3.forceSimulation()
        .velocityDecay(0.3)
        .force('charge', d3.forceManyBody().strength(7))
        .force('collide', d3.forceCollide().radius((node) => { return node.radius }))
        .on('tick', tick);

      simulation.nodes(nodes.current);

      if (chartType[chartKey] === 'radial') {
        let min, max;

        min = d3.min(nodes.current, (element) => { return element[chartKey]; });
        max = d3.max(nodes.current, (element) => { return element[chartKey]; });

        const beeSwarmScale = d3.scaleLinear()
          .domain([min, max])
          .range([width * 0.11, width - (width * 0.11)]);

        simulation.force('charge', d3.forceManyBody().strength(3))
          .force('x', d3.forceX().strength(0.06).x((element) => { return beeSwarmScale(element[chartKey]); }))
          .force('y', d3.forceY().strength(0.08).y(height / 2))
          .force('collide', d3.forceCollide(6));

        node_container.append('g')
          .attr('transform', `translate(0, ${height / 2 + 50})`)
          .call(d3.axisBottom(beeSwarmScale))
          .attr('class', 'axis');
      } else if (chartType[chartKey] === 'treemap') {
        simulation.force('charge', d3.forceManyBody().strength(3))
          .force('x', d3.forceX().strength(0.07).x((element) => { return getNodePosition(element, centers, chartKey).x; }))
          .force('y', d3.forceY().strength(0.08).y((element) => { return getNodePosition(element, centers, chartKey).y; }));
      };

      simulation.alpha(1).restart();

      function tick() {
        circles.attr('cx', (node) => { return node.x; })
          .attr('cy', (node) => { return node.y; });

        let maxVelocity = d3.max(nodes.current, function (d) { return Math.max(d.vx, d.vy); });
        if (chartType[chartKey] === 'treemap' && d3.selectAll('.label').empty() && maxVelocity < 0.07) {
          showLabel(node_container, nodes.current, chartKey);
        }
      };
    };
  }, [playlistTracks, chartKey]);

  return (
    <div className='chart-container'>
      <svg
        className='chart'
        ref={chartRef}
      />
    </div>
  );
};

export default Chart;