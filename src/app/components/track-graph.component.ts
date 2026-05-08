import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TrackService } from '../services/track.service';
import * as d3 from 'd3';

const TRNS = 200;
const GROUP_COLOR: any = {
  timbre:   '#1565c0',
  rhythm:   '#2e7d32',
  tonal:    '#e65100',
  combined: '#6a1b9a',
};

@Component({
  moduleId: module.id,
  selector: 'track-graph',
  templateUrl: 'track-graph.component.html',
  styleUrls: ['track-graph.component.css']
})
export class TrackGraphComponent implements OnInit {
  @ViewChild('graph') private element: ElementRef;
  @Input() mbid: string;

  groupName: string;
  groupColor: string;
  graphLoaded = false;
  svg: any;
  simulation: any;
  link: any;
  node: any;
  label: any;
  width: number;
  height: number;

  constructor(private trackService: TrackService, private router: Router) {}

  ngOnInit() {
    this.groupName = 'Loading graph...';
    this.groupColor = '#dddddd';
    this.trackService.getTrackGraph(this.mbid).then(graph => {
      this.groupName = '';
      if (graph.nodes && graph.nodes.length > 1) { this.initialise(graph); this.graphLoaded = true; }
    });
  }

  initialise(graph: any) {
    this.svg = d3.select(this.element.nativeElement);
    this.width = +this.svg.attr('width');
    this.height = +this.svg.attr('height');

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id)
        .distance((l: any) => l.value === 0.5 ? 130 : 45)
        .strength(0.8))
      .force('charge', d3.forceManyBody().strength(-40))
      .force('collide', d3.forceCollide().radius((d: any) => this.getRadius(d) + 8).iterations(2))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    this.link = this.svg.append('g')
      .attr('stroke', '#aaa')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', '2px');

    this.node = this.svg.append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('r', (d: any) => this.getRadius(d))
      .attr('fill', (d: any) => d.seed ? '#e91e63' : GROUP_COLOR[d.group])
      .attr('stroke', '#666')
      .attr('stroke-width', '1.5px')
      .attr('cursor', 'pointer')
      .on('mouseover', (d: any) => this.highlightGroup(d))
      .on('mouseout', (d: any) => this.restoreGroup(d))
      .on('click', (d: any) => this.navigate(d))
      .call(d3.drag()
        .on('start', (d: any) => this.dragstarted(d))
        .on('drag', (d: any) => this.dragged(d))
        .on('end', (d: any) => this.dragended(d))
      );

    this.label = this.svg.selectAll('.label')
      .data(graph.nodes)
      .enter().append('text')
      .text((d: any) => d.name)
      .style('text-anchor', 'middle')
      .style('fill', '#444')
      .style('font-family', 'Nunito')
      .style('font-size', '10pt')
      .style('pointer-events', 'none')
      .attr('opacity', 0.45);

    this.simulation.nodes(graph.nodes).on('tick', () => this.ticked());
    this.simulation.force('link').links(graph.links);
  }

  getRadius(d: any) {
    if (d.seed) return 22;
    return 18 + (d.dims ? d.dims.length - 1 : 0) * 5;
  }

  ticked() {
    this.link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    this.node
      .attr('cx', (d: any) => this.clamp(d, 'x'))
      .attr('cy', (d: any) => this.clamp(d, 'y'));

    this.label
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y);
  }

  clamp(d: any, axis: string) {
    const r = this.getRadius(d);
    const dim = axis === 'x' ? this.width : this.height;
    d[axis] = Math.max(r, Math.min(dim - r, d[axis]));
    return d[axis];
  }

  highlightGroup(d: any) {
    const group = d.group;
    this.groupName = d.seed ? d.name : `${d.name} — ${d.artist}`;
    this.groupColor = d.seed ? '#e91e63' : GROUP_COLOR[group];

    const label = this.svg.selectAll('text').filter((n: any) => n.id === d.id);
    label.transition().duration(TRNS)
      .style('font-size', '14pt').style('fill', '#ddd')
      .style('-webkit-text-stroke-width', '1px').attr('opacity', 0.9);

    this.svg.selectAll('circle').filter((n: any) => n.group !== group)
      .transition().duration(TRNS).attr('opacity', 0.2);
    this.svg.selectAll('circle').filter((n: any) => n.group === group)
      .transition().duration(TRNS).attr('stroke', '#fff').attr('stroke-width', '3px');
    this.svg.selectAll('line').transition().duration(TRNS)
      .attr('stroke-opacity', 0.1).attr('stroke-width', '1px');
  }

  restoreGroup(d: any) {
    this.groupName = '';
    const label = this.svg.selectAll('text').filter((n: any) => n.id === d.id);
    label.transition().duration(TRNS)
      .style('font-size', '10pt').style('fill', '#444')
      .style('-webkit-text-stroke-width', '0px').attr('opacity', 0.45);
    this.svg.selectAll('circle')
      .attr('stroke', '#666').attr('stroke-width', '1.5px').attr('opacity', 1.0);
    this.svg.selectAll('line')
      .attr('stroke-opacity', 0.4).attr('stroke-width', '2px');
  }

  navigate(d: any) {
    if (!d.seed) {
      this.router.navigate(['/track', d.id, d.name]);
    }
  }

  dragstarted(d: any) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }

  dragged(d: any) {
    d.fx = d3.event.x; d.fy = d3.event.y;
  }

  dragended(d: any) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }
}
