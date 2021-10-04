import { IService } from '@jujulego/janus-types';
import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

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

// Component
export const ServiceGraph: FC<ServiceGraphProps> = ({ onSelect, selected, service }) => {
  const theme = useTheme();

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
      .classed('node', true)
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
      .classed('link', true)
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
  }, [selected, hierarchy, theme, onSelect]);

  // Render
  return (
    <Paper variant="outlined" sx={{ height: '100%', overflow: 'hidden' }}>
      <Box
        component="svg" ref={graph}
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: 'background.paper',

          '& .node': {
            cursor: 'pointer',

            '& text': {
              fill: ({ palette }) => palette.text.primary,
              dominantBaseline: 'central',
            },

            '& rect': {
              fill: ({ palette }) => palette.action.active,
              fillOpacity: 0,
              stroke: ({ palette }) => palette.warning.main,
              strokeWidth: 2,

              transition: ({ transitions }) => transitions.create('fill-opacity', {
                duration: transitions.duration.shortest,
              }),
            },

            '& circle': {
              fill: ({ palette }) => palette.warning.main,
              stroke: 'none',
            },

            '&:hover rect': {
              fillOpacity: ({ palette }) => palette.action.hoverOpacity,
            },

            '&.selected rect': {
              fillOpacity: ({ palette }) => palette.action.selectedOpacity,
            },

            '&.selected:hover rect': {
              fillOpacity: ({ palette }) => palette.action.hoverOpacity + palette.action.selectedOpacity,
            },

            '&.used': {
              '& rect': {
                stroke: ({ palette }) => palette.primary.main,
              },

              '& circle': {
                fill: ({ palette }) => palette.primary.main,
              },
            },

            '&.enabled': {
              '& rect': {
                stroke: ({ palette }) => palette.success.main,
              },

              '& circle': {
                fill: ({ palette }) => palette.success.main,
              },
            },
          },
          '& .link': {
            fill: 'none',
            stroke: ({ palette }) => palette.warning.main,
            strokeWidth: 2,
            strokeDasharray: '5',

            '&.enabled': {
              stroke: ({ palette }) => palette.success.main,
              strokeDasharray: '0',
            },

            '&.used': {
              stroke: ({ palette }) => palette.primary.main,
              strokeWidth: 3,
              strokeDasharray: '0',
            },
          },
        }}
      >
        <g className="root" transform="translate(5, 5)">
          <g className="links" />
          <g className="nodes" />
        </g>
      </Box>
    </Paper>
  );
};