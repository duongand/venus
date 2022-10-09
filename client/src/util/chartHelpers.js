import * as d3 from 'd3';

export const height = 600;
export const width = 1300;

export function setNodePositions(data, chartKey, centerMethod) {
  if (centerMethod === 'radial') {
    const children = groupRadialNodes(data, chartKey);
    return extractRadialPosition(children);
  } else if (centerMethod === 'treemap') {
    const children = groupTreemapChildren(data, chartKey);
    return extractTreemapPosition(children);
  };
}

export function getNodePosition(node, centers, chartKey) {
  return centers[node[chartKey]];
}

function groupRadialNodes(data, chartKey) {
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
}

function extractRadialPosition(children) {
  const centers = {};
  for (const child of children) {
    centers[child.id] = {
      x: child.x,
      y: child.y,
    };
  };
  return centers;
}

function groupTreemapChildren(data, chartKey) {
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
}

function extractTreemapPosition(children) {
  const centers = {};
  for (const child of children) {
    centers[child.id] = {
      x: (child.x0 + child.x1) / 2,
      y: (child.y0 + child.y1) / 2,
    };
  };

  return centers;
}