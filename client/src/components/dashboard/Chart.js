import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
    getCenters,
    getNodePosition
} from './chartHelper.js';

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

function Chart({ selectedPlaylistTracks, chartKey }) {
    let chartRef = useRef(null);
    let nodes = useRef(selectedPlaylistTracks.map((element) => {
        element['radius'] = 5;
        return element;
    }));
    let labels = useRef(null);
    let showLabels = useRef(true);
    let labelPosition = useRef({});
    let tooltip = useRef(null);

    const height = 650;
    const width = 1400;

    useEffect(() => {
        if (selectedPlaylistTracks && chartRef) {
            d3.selectAll('g').remove();
            d3.selectAll('.label').remove();
            d3.selectAll('.axis').remove();

            const svg = d3.select(chartRef.current)
                .attr('viewBox', `0 0 ${width} ${height}`)
                .attr('preserverAspectiveRatio', 'xMidYMid meet');

            const svgContainer = d3.select('.chart-container');

            const node = svg.append('g')
                .attr('transform', `translate(${15}, ${15})`);

            const centers = getCenters(nodes.current, chartKey, chartType[chartKey]);

            const simulation = d3.forceSimulation()
                .velocityDecay(0.2)
                .force('charge', d3.forceManyBody().strength(7))
                .force('collide', d3.forceCollide().radius(function (node) { return node.radius }))
                .on('tick', tick);

            const circles = node.selectAll('.bubble')
                .data(nodes.current)
                .enter()
                .append('circle')
                .attr('r', (node) => node.radius)
                .attr('cx', (node) => node.x)
                .attr('cy', (node) => node.y)
                .attr('class', 'bubble')
                .on('mouseover', (node) => {
                    tooltip.current.html(`${node['target']['__data__']['name']}<br/>${node['target']['__data__']['artist']}`)
                        .style('visibility', 'visible')
                        .style('left', node.pageX + 'px')
                        .style('top', node.pageY + 'px')
                })
                .on('mouseleave', () => {
                    tooltip.current.style('visibility', 'hidden');
                });

            tooltip.current = svgContainer.append('div')
                .attr('className', 'tooltip')
                .style('position', 'absolute')
                .style('visibility', 'hidden')
                .style('color', 'black')
                .style('background-color', 'white')
                .style('border', '1px solid black')
                .style('border-radius', '5px')
                .style('padding', '2px');

            simulation.nodes(nodes.current);

            if (chartType[chartKey] === 'radial') {
                let min, max;
                showLabels.current = false;

                if (min === undefined) { min = d3.min(nodes.current, (element) => element[chartKey]) };
                if (max === undefined) { max = d3.max(nodes.current, (element) => element[chartKey]) };

                const scale = d3.scaleLinear()
                    .domain([min, max])
                    .range([50, 1100]);

                simulation.force('charge', d3.forceManyBody().strength(3))
                    .force('x', d3.forceX().strength(0.06).x((element) => scale(element[chartKey])))
                    .force('y', d3.forceY().strength(0.06).y(height / 2))
                    .force('collide', d3.forceCollide(6));

                simulation.alpha(1).restart();

                node.append('g')
                    .attr('transform', `translate(0, ${height / 2 + 50})`)
                    .call(d3.axisBottom(scale))
                    .attr('class', 'axis');
            } else if (chartType[chartKey] === 'treemap') {
                showLabels.current = true;

                simulation.force('charge', d3.forceManyBody().strength(3))
                    .force('x', d3.forceX().strength(0.06).x((element) => getNodePosition(element, centers, chartKey).x))
                    .force('y', d3.forceY().strength(0.06).y((element) => getNodePosition(element, centers, chartKey).y));

                simulation.alpha(1).restart();
            };

            function tick() {
                circles.attr('cx', (node) => { return node.x })
                    .attr('cy', (node) => { return node.y });

                const maxVelocity = d3.max(nodes.current, (node) => Math.max(node.vx, node.vy));
                if (showLabels.current && maxVelocity > 0 && maxVelocity < 0.2) {
                    appendLabels(chartKey, node);
                };
            };

            function appendLabels(chartKey, node) {
                updateLabelPosition(chartKey);

                labels.current = node.selectAll('.label')
                    .data(Object.keys(labelPosition.current))
                    .enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('x', (element) => labelPosition.current[element].x)
                    .attr('y', (element) => labelPosition.current[element].y)
                    .text((element) => element);
            };

            function updateLabelPosition(chartKey) {
                labelPosition.current = {};

                let agg = Array.from(d3.rollup(nodes.current,
                    (node) => {
                        return {
                            x: d3.mean(node, (element) => element.x) - 10,
                            y: d3.max(node, (element) => element.y) + 20,
                        }
                    },
                    (element) => element[chartKey]));

                for (const element of agg) {
                    labelPosition.current[element[0]] = {
                        x: element[1].x,
                        y: element[1].y
                    };
                };
            };
        };
    }, [selectedPlaylistTracks, chartKey]);

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