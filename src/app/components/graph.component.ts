import { Component, Input, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Artist } from "../objects/artist";
import { Node, Link, Graph } from "../objects/graph";
import { ArtistService } from '../services/artist.service';
import * as d3 from "d3";

@Component({
  moduleId: module.id,
  selector: 'graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input() artist: Artist;
  graph: Graph;
  svg: any;
  color: any;
  simulation: any;
  width: any;
  height: any;

  constructor(private artistService: ArtistService, private router: Router) { }

  ngOnInit(): void {
    this.svg = d3.select("svg"),
      this.width = +this.svg.attr("width"),
      this.height = +this.svg.attr("height");

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d:Node) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    this.getGraph();
  }

  getGraph(): void {
    this.artistService.getArtistGraph(this.artist)
      .then(graph => {
        this.graph = graph;
        this.initialise();
      });
  }

  initialise(): void {
    var link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(this.graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return this.color(d.group); })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    this.simulation
        .nodes(this.graph.nodes)
        .on("tick", ticked);

    this.simulation.force("link")
        .links(this.graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }
  }
}

function dragstarted(d) {
  if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) this.simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
