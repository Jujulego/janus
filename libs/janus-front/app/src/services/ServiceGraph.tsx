import { makeStyles, Paper } from '@material-ui/core';
import { FC, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

import { IService } from '@jujulego/janus-common';

// Types
export interface ServiceGraphProps {
  service: IService;
}

// Styles
const useStyles = makeStyles(({ palette }) => ({
  graph: {
    height: '100%',
    width: '100%',
  },
  node: {
    fill: palette.primary.main,
    stoke: 'none',
  },
  link: {
    fill: 'none',
    stroke: palette.primary.dark,
    strokeWidth: '1px'
  }
}));

// Component
export const ServiceGraph: FC<ServiceGraphProps> = ({ service }) => {
  const styles = useStyles();

  // Refs
  const graph = useRef<SVGSVGElement>(null);

  // Memos
  const hierarchy = useMemo(() => d3.hierarchy({
    name: service.name,
    children: service.gates.map((gate) => ({
      name: gate.name
    }))
  }), [service]);

  // Effects
  useEffect(() => {
    if (!graph.current) return;

    // Build graph
    const layout = d3.tree()
      .size([graph.current.clientWidth - 10, graph.current.clientHeight - 10]);

    // Render graph
    const svg = d3.select(graph.current);
    const root = layout(hierarchy);

    // - nodes
    const nodes = svg.select('g.nodes')
      .selectAll('circle')
      .data(root.descendants());

    nodes.enter()
      .append('circle')
      .classed(styles.node, true)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 4);

    nodes.exit()
      .remove();

    // - links
    const links = svg.select('g.links')
      .selectAll('line')
      .data(root.links());

    links.enter()
      .append('line')
      .classed(styles.link, true)
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    links.exit()
      .remove();
  }, [hierarchy, styles]);

  // Render
  return (
    <Paper variant="outlined" sx={{ height: '100%' }}>
      <svg className={styles.graph} ref={graph}>
        <g transform="translate(5, 5)">
          <g className="links" />
          <g className="nodes" />
        </g>
      </svg>
    </Paper>
  );
};
