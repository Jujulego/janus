import { makeStyles, Paper } from '@material-ui/core';
import { FC, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

import { IService } from '@jujulego/janus-common';

// Types
export interface ServiceGraphProps {
  service: IService;
}

interface IData {
  name: string;
  enabled: boolean;

  children?: IData[];
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
    strokeWidth: '1px',

    '&:not(.enabled)': {
      strokeDasharray: '5'
    }
  }
}));

// Component
export const ServiceGraph: FC<ServiceGraphProps> = ({ service }) => {
  const styles = useStyles();

  // Refs
  const graph = useRef<SVGSVGElement>(null);

  // Memos
  const hierarchy = useMemo(() => d3.hierarchy<IData>({
    name: service.name,
    enabled: true,

    children: service.gates
      .sort((a, b) => b.priority - a.priority)
      .map((gate) => ({
        name: gate.name,
        enabled: gate.enabled,
      }))
  }), [service]);

  // Effects
  useEffect(() => {
    if (!graph.current) return;

    // Build graph
    const h = graph.current.clientHeight - 10;
    const w = graph.current.clientWidth - 10;

    const layout = d3.tree<IData>()
      .size([h, w / 3]);

    // Render graph
    const svg = d3.select(graph.current);
    const root = layout(hierarchy);

    // - nodes
    svg.select('g.nodes').selectAll('circle')
      .data(root.descendants())
      .join('circle')
        .classed(styles.node, true)
        .attr('cx', (d) => d.y + w / 3)
        .attr('cy', (d) => d.x)
        .attr('r', 4);

    // - links
    svg.select('g.links').selectAll('path')
      .data(root.links())
      .join('path')
        .classed(styles.link, true)
        .classed('enabled', (d) => d.target.data.enabled)
        .attr('d', (d) => {
          // coords
          const { x: sx, y: sy } = d.source;
          const { x: tx, y: ty } = d.target;

          const my = (sy + ty) / 2;
          const r = 25;

          // path
          const ctx = d3.path();
          ctx.moveTo(sy + w / 3, sx);
          ctx.lineTo(my - r + w / 3, sx);
          ctx.arcTo(my + w / 3, sx, my + w / 3, sx + (sx > tx ? -r : r), r);
          ctx.lineTo(my + w / 3, tx - (sx > tx ? -r : r));
          ctx.arcTo(my + w / 3, tx, my + r + w / 3, tx, r);
          ctx.lineTo(ty + w / 3, tx);

          return ctx.toString();
        });
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
