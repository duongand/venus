import * as d3 from 'd3';

const height = 650;
const width = 1400;

function getCenters(data, chartKey, centerMethod) {
    const centers = {};
    if (centerMethod === 'radial') {
        const children = getRadialChildren(data, chartKey);
        children.forEach((element) => {
            centers[element.id] = {
                x: element.x,
                y: element.y
            };
        });
    } else if (centerMethod === 'treemap') {
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

    count.push({ name: 'root' });

    const stratify = d3.stratify()
        .parentId((element) => {
            if (element.name === 'root') return null;
            return 'root';
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

function getTreemapChildren(data, chartKey) {
    let count = Array.from(d3.rollup(data, v => v.length, d => d[chartKey]));
    count = count.map((element) => {
        return {
            name: element[0],
            size: element[1]
        };
    });

    count.push({ name: 'root' });

    const stratify = d3.stratify()
        .id(function (d) { return d.name })
        .parentId(function (d) {
            if (d.name === 'root') return null;
            return 'root';
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

export { getCenters, getNodePosition }