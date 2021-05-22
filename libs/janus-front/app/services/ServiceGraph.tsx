import { gql, useSubscription } from '@apollo/client';
import { makeStyles, Paper } from '@material-ui/core';
import { FC, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

import { GateFragment, IService, ServiceFragment } from '@jujulego/janus-common';

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
    minWidth: 500
  },
  node: {
    '& text': {
      fill: palette.text.primary,
      dominantBaseline: 'central'
    },
    '& rect': {
      fill: palette.background.paper,
      stroke: palette.warning.main,
      strokeWidth: 1,

      '&.enabled': {
        stroke: palette.success.main
      }
    },
    '& circle': {
      fill: palette.warning.main,
      stoke: 'none',

      '&.enabled': {
        fill: palette.success.main
      }
    }
  },
  link: {
    fill: 'none',
    stroke: palette.warning.main,
    strokeWidth: 1,

    '&:not(.enabled)': {
      strokeDasharray: '5'
    },

    '&.enabled': {
      stroke: palette.success.main,
      strokeWidth: 2,
    }
  }
}));

// Component
export const ServiceGraph: FC<ServiceGraphProps> = (props) => {
  const styles = useStyles();

  // GraphQL
  const { data: { service } = props } = useSubscription<ServiceGraphProps>(
    gql`
        subscription ServiceGraph($service: String!) {
            service(name: $service) {
                ...Service
                
                gates {
                    ...Gate
                }
            }
        }

        ${ServiceFragment}
        ${GateFragment}
    `,
    {
      variables: { service: props.service.name },
    }
  );

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
      }))
  }), [service]);

  // Effects
  useEffect(() => {
    if (!graph.current) return;

    // Build graph
    const h = graph.current.clientHeight - 10;
    const w = graph.current.clientWidth - 10;

    const nw = Math.max(w / 5, 200);
    const lw = Math.min(w - nw * 2, 300);
    const ml = Math.max((w - lw) / 2 - nw, 0);

    const layout = d3.tree<IData>()
      .size([h, w - ml * 2]);

    // Render graph
    const svg = d3.select(graph.current);
    const root = layout(hierarchy);

    // - nodes
    const nodes = svg.select('g.nodes').selectAll('g')
      .data(root.descendants())
      .join(
        (ent) => {
          const node = ent.append('g');

          node.append('circle');
          node.append('rect');
          node.append('text');

          return node;
        },
        (upd) => upd,
        (ext) => ext.remove()
      )
        .classed(styles.node, true);

    nodes.select('circle')
      .classed('enabled', (d) => d.data.enabled)
      .attr('cx', (d) => ml + d.y + (d.depth === 0 ? nw : -nw))
      .attr('cy', (d) => d.x)
      .attr('r', 4);

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
    svg.select('g.links').selectAll('path')
      .data(root.links())
      .join('path')
        .classed(styles.link, true)
        .classed('enabled', (d) => d.target.data.enabled)
        .attr('d', (d) => {
          // coords
          const sx = d.source.x;
          const sy = d.source.y + nw;
          const tx = d.target.x;
          const ty = d.target.y - nw;

          const my = (sy + ty) / 2;
          const r = (ty - sy) / 3;

          // path
          const ctx = d3.path();
          ctx.moveTo(ml + sy, sx);
          ctx.lineTo(ml + my - r, sx);
          ctx.bezierCurveTo(ml + my, sx, ml + my, tx, ml + my + r, tx);
          ctx.lineTo(ml + ty, tx);

          return ctx.toString();
        });
  }, [hierarchy, styles, graph.current]);

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
