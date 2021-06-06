import { makeStyles, Paper, useTheme } from '@material-ui/core';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as d3 from 'd3';

import { IService } from '@jujulego/janus-common';

// Types
interface IData {
  name: string;
  enabled: boolean;

  children?: IData[];
}

// Props
export interface ServiceGraphProps {
  service: IService;
  selected?: string;
  onSelect(selected: string): void;
}

// Styles
const useStyles = makeStyles(({ palette, transitions }) => ({
  graph: {
    height: '100%',
    width: '100%',

    background: palette.background.paper,
  },
  node: {
    cursor: 'pointer',

    '& text': {
      fill: palette.text.primary,
      dominantBaseline: 'central',
    },

    '& rect': {
      fill: palette.action.active,
      fillOpacity: 0,
      stroke: palette.warning.main,
      strokeWidth: 2,

      transition: transitions.create('fill-opacity', {
        duration: transitions.duration.shortest,
      }),
    },

    '& circle': {
      fill: palette.warning.main,
      stroke: 'none',
    },

    '&:hover rect': {
      fillOpacity: palette.action.hoverOpacity,
    },

    '&.selected rect': {
      fillOpacity: palette.action.selectedOpacity,
    },

    '&.selected:hover rect': {
      fillOpacity: palette.action.hoverOpacity + palette.action.selectedOpacity,
    },

    '&.used': {
      '& rect': {
        stroke: palette.primary.main,
      },

      '& circle': {
        fill: palette.primary.main,
      },
    },

    '&.enabled': {
      '& rect': {
        stroke: palette.success.main,
      },

      '& circle': {
        fill: palette.success.main,
      },
    },
  },
  link: {
    fill: 'none',
    stroke: palette.warning.main,
    strokeWidth: 2,
    strokeDasharray: '5',

    '&.enabled': {
      stroke: palette.success.main,
      strokeDasharray: '0',
    },

    '&.used': {
      stroke: palette.primary.main,
      strokeWidth: 3,
      strokeDasharray: '0',
    },
  },
}));

// Component
export const ServiceGraph: FC<ServiceGraphProps> = ({ onSelect, selected, service }) => {
  const theme = useTheme();
  const styles = useStyles();

  // State
  const [count, refresh] = useState(0);

  // Refs
  const graph = useRef<SVGSVGElement>(null);

  // Memos
  const hierarchy = useMemo(() => d3.hierarchy<IData>({
    name: service.name,
    enabled: service.gates.some((gate) => gate.enabled),

    children: [...service.gates]
      .sort((a, b) => a.priority - b.priority)
      .map((gate) => ({
        name: gate.name,
        enabled: gate.enabled,
      })),
  }), [service]);

  // Effects
  useEffect(() => {
    const obs = new ResizeObserver(() => {
      refresh((old) => old + 1);
    });

    if (graph.current?.parentElement) {
      obs.observe(graph.current.parentElement);
    }

    return () => {
      obs.disconnect();
    };
  }, [refresh]);

  useEffect(() => {
    if (!graph.current) return;

    // Used gate
    const used = hierarchy.children!.find((d) => d.data.enabled);

    // Build graph
    const h = graph.current.clientHeight - 10;
    const w = Math.max(graph.current.clientWidth - 10, 750);
    const rw = Math.min((graph.current.clientWidth - 10) / 750, 1);

    const nw = 200;   // node width
    const lw = w / 3; // link width => space between nodes
    const ml = Math.max((w - lw) / 2 - nw, 0); // left margin

    const layout = d3.tree<IData>()
      .size([h / rw, w - ml * 2]);

    // Render graph
    const svg = d3.select(graph.current);
    const root = layout(hierarchy);

    svg.select('g.root')
      .attr('transform', `translate(5, 5) scale(${rw})`);

    // - nodes
    const nodes = svg.select('g.nodes')
      .selectAll('g')
      .data(root.descendants())
      .join(
        (ent) => {
          const node = ent.append('g');

          node.append('rect');
          node.append('circle');
          node.append('text');

          return node;
        },
        (upd) => upd,
        (ext) => ext.remove(),
      )
        .classed(styles.node, true)
        .classed('enabled', (d) => d.data.enabled)
        .classed('used', (d) => used?.data?.name === d.data.name)
        .classed('selected', (d) => selected === d.data.name)
        .on('click', (e, d) => onSelect(d.data.name));

    nodes.select('circle')
      .classed('enabled', (d) => d.data.enabled)
      .attr('cx', (d) => ml + d.y + (d.depth === 0 ? nw : -nw))
      .attr('cy', (d) => d.x)
      .attr('r', 6);

    nodes.select('rect')
      .classed('enabled', (d) => d.data.enabled)
      .attr('x', (d) => ml + d.y + (d.depth === 0 ? 0 : -nw))
      .attr('y', (d) => d.x - 20)
      .attr('rx', 7.5)
      .attr('ry', 7.5)
      .attr('width', nw)
      .attr('height', 40);

    nodes.select('text')
      .attr('x', (d) => ml + d.y + (d.depth === 0 ? 0 : -nw) + 10)
      .attr('y', (d) => d.x)
      .text((d) => d.data.name);

    // - links
    svg.select('g.links')
      .selectAll('path')
      .data(root.links())
      .join('path')
        .classed(styles.link, true)
        .classed('enabled', (d) => d.target.data.enabled)
        .classed('used', (d) => used?.data?.name === d.target.data.name)
        .attr('d', (d) => {
          // coords
          const sx = d.source.x;
          const sy = d.source.y + nw;
          const tx = d.target.x;
          const ty = d.target.y - nw;

          const my = (sy + ty) / 2;
          const sw = (ty - sy) / 7; // width of strait line

          // path
          const ctx = d3.path();
          ctx.moveTo(ml + sy, sx);
          ctx.lineTo(ml + sy + sw, sx);
          ctx.bezierCurveTo(ml + my, sx, ml + my, tx, ml + ty - sw, tx);
          ctx.lineTo(ml + ty, tx);

          return ctx.toString();
        });
  }, [count, selected, hierarchy, styles, theme, onSelect]);

  // Render
  return (
    <Paper variant="outlined" sx={{ height: '100%', overflow: 'hidden' }}>
      <svg className={styles.graph} ref={graph}>
        <g className="root" transform="translate(5, 5)">
          <g className="links" />
          <g className="nodes" />
        </g>
      </svg>
    </Paper>
  );
};
