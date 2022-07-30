import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Chart({ selectedPlaylistTracks, chartKey }) {
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

    let chartRef = useRef(null);
    let nodes = useRef(null);
    let circles = useRef(null);
    let labels = useRef(null);
    let showLabels = useRef(true);
    let labelPosition = useRef({});

    const height = 650;
    const width = 1400;

    useEffect(() => {
        if (selectedPlaylistTracks && chartRef) {
            d3.selectAll("g").remove();
            d3.selectAll(".label").remove();
            d3.selectAll(".axis").remove();

            const svg = d3.select(chartRef.current)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserverAspectiveRatio", "xMidYMid meet");

            const node = svg.append("g")
                .attr("transform", `translate(${15}, ${15})`);

            circles.current = node.selectAll(".bubble");
            labels.current = node.selectAll(".label");

            nodes = selectedPlaylistTracks.map((element) => {
                element['radius'] = 5;
                return element;
            });

            const centers = getCenters(nodes, chartKey, chartType[chartKey]);

            const simulation = d3.forceSimulation()
                .velocityDecay(0.2)
                .force("charge", d3.forceManyBody().strength(7))
                .force("collide", d3.forceCollide().radius(function (d) { return d.radius }))
                .on("tick", tick);

            circles = node.selectAll(".bubble")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("r", (node) => node.radius)
                .attr("cx", (node) => node.x)
                .attr("cy", (node) => node.y)
                .attr("class", "bubble");

            simulation.nodes(nodes);

            if (chartType[chartKey] === "radial") {
                let min, max;
                showLabels.current = false;

                if (min === undefined) { min = d3.min(nodes, (element) => element[chartKey]) };
                if (max === undefined) { max = d3.max(nodes, (element) => element[chartKey]) };

                const scale = d3.scaleLinear()
                    .domain([min, max])
                    .range([50, 1100]);

                simulation.force("charge", d3.forceManyBody().strength(3))
                    .force("x", d3.forceX().strength(0.06).x((element) => scale(element[chartKey])))
                    .force("y", d3.forceY().strength(0.06).y(height / 2))
                    .force("collide", d3.forceCollide(6));

                simulation.alpha(1).restart();

                node.append("g")
                    .attr("transform", `translate(0, ${height / 2 + 50})`)
                    .call(d3.axisBottom(scale))
                    .attr("class", "axis");
            } else if (chartType[chartKey] === "treemap") {
                showLabels.current = true;

                simulation.force("charge", d3.forceManyBody().strength(3))
                    .force("x", d3.forceX().strength(0.06).x((element) => getNodePosition(element, centers, chartKey).x))
                    .force("y", d3.forceY().strength(0.06).y((element) => getNodePosition(element, centers, chartKey).y));

                simulation.alpha(1).restart();
            };


            function tick() {
                circles.attr("cx", (node) => { return node.x })
                    .attr("cy", (node) => { return node.y });

                const maxVelocity = d3.max(nodes, (node) => Math.max(node.vx, node.vy));
                if (showLabels.current && maxVelocity > 0 && maxVelocity < 0.2) {
                    appendLabels(chartKey, node);
                };
            };

            function getCenters(data, chartKey, centerMethod) {
                const centers = {};

                if (centerMethod === "radial") {
                    const children = getRadialChildren(data, chartKey);
                    children.forEach((element) => {
                        centers[element.id] = {
                            x: element.x,
                            y: element.y
                        };
                    });
                } else if (centerMethod === "treemap") {
                    const children = getTreemapChildren(data, chartKey);
                    children.forEach((element) => {
                        centers[element.id] = {
                            x: (element.x0 + element.x1) / 2,
                            y: (element.y0 + element.y1) / 2,
                        };
                    });
                };

                return centers;
            };

            function getNodePosition(node, centers, chartKey) {
                return centers[node[chartKey]];
            };

            function getRadialChildren(data, chartKey) {
                let count = Array.from(d3.rollup(data, v => v.length, d => d[chartKey]));

                count = count.map((element) => {
                    return {
                        name: element[0],
                        size: element[1],
                    };
                });

                count.push({ name: "root" });

                const stratify = d3.stratify()
                    .parentId((element) => {
                        if (element.name === "root") return null;

                        return "root";
                    })
                    .id((element) => element.name);

                const root = stratify(count)
                    .sum((element) => Math.sqrt(element.size))
                    .sort((a, b) => {
                        return b.size - a.size;
                    });

                const pack = d3.pack().size([width, height])
                    .padding(20);

                return pack(root).descendants();
            };
        };

        function getTreemapChildren(data, chartKey) {
            let count = Array.from(d3.rollup(data, v => v.length, d => d[chartKey]));

            count = count.map((element) => {
                return {
                    name: element[0],
                    size: element[1]
                };
            });

            count.push({ name: "root" });

            const stratify = d3.stratify()
                .id(function (d) { return d.name })
                .parentId(function (d) {
                    if (d.name === "root") return null;
                    else return "root";
                });

            const root = stratify(count)
                .sum((element) => Math.sqrt(element.size))
                .sort((a, b) => {
                    return b.size - a.size;
                });

            const treemap = d3.treemap()
                .size([width, height])
                .tile(d3.treemapSquarify.ratio(1))
                .paddingOuter(50);

            treemap(root);
            return root.children;
        };

        function appendLabels(chartKey, node) {
            updateLabelPosition(chartKey);

            labels.current = node.selectAll(".label")
                .data(Object.keys(labelPosition.current))
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", (element) => labelPosition.current[element].x)
                .attr("y", (element) => labelPosition.current[element].y)
                .text((element) => element);
        };

        function updateLabelPosition(chartKey) {
            labelPosition.current = {};

            let agg = Array.from(d3.rollup(nodes,
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

    }, [chartKey]);

    return (
        <svg
            className="chart"
            ref={chartRef}
        />
    );
};

export default Chart;