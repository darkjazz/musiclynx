import { Component, Input, OnInit, ViewChild, ElementRef, Renderer } from "@angular/core";
import { Router } from '@angular/router';
import { Artist } from "../objects/artist";
import { Node, Link, Graph } from "../objects/graph";
import { ArtistService } from '../services/artist.service';
import * as d3 from "d3";

const TRNS = 200;

@Component({
  moduleId: module.id,
  selector: 'artist-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css']
})
export class GraphComponent implements OnInit {
  @ViewChild('graph') private element: ElementRef;
  showSpinner: boolean;
  artist: Artist;
  graph: Graph;
  groupName: string;
  groupTop: string;
  groupLeft: string;
  groupColor: string;
  svg;
  simulation;
  width;
  height;
  link;
  node;
  color;
  radius;
  label;

  constructor(private artistService: ArtistService, private router: Router, public renderer: Renderer) { }

  @Input()
  set setArtist(artist: Artist) {
    this.artist = artist;
  }

  ngOnInit(): void {
    this.hijackGroupLabel();
    this.getGraph();
  }

  getId(node) { return node["id"] }

  getName(node) { return node["name"] }

  getURI(node) { return node["uri"] }

  getGroup(node) { return node["group"] }

  getRadius(node) { return (20 + (parseInt(node["ranking"]) * 2)); }

  getGraph() {
    this.artistService.getArtistGraph(this.artist)
      .then(graph => {
        this.hideGroupLabel();
        this.graph = graph;
        if (!("error" in graph)) this.initialise();
        else d3.select(this.element.nativeElement).attr("height", 0);
      });
  }

  initialise() {
    this.svg = d3.select(this.element.nativeElement);

    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id( (d) => this.getName(d) ))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide().radius( d => this.getRadius(d) + 7.0).iterations(2))
        .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    this.link = this.svg.append("g")
      .attr("stroke", "#aaa")
      .selectAll("line")
      .data(this.graph.links)
      .enter().append("line")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", "2px");

    this.node = this.svg.append("g")
      .selectAll("circle")
      .data(this.graph.nodes)
      .enter().append("circle")
      .attr("r", d => this.getRadius(d) )
      .attr("fill", d => this.color(d.group))
      .attr("stroke", "#666")
      .attr("stroke-width", "1.5px")
      .attr("cursor", "pointer")
      .on("mouseover", d => this.highlightGroup(d) )
      .on("mouseout", d => this.restoreGroup(d) )
      .on("click", d => this.navigate(d) )
      .call(d3.drag()
        .on("start", d => this.dragstarted(d))
        .on("drag", d => this.dragged(d))
        .on("end", d => this.dragended(d))
      );

    // this.node.append("title")
    //   .style("background-color", "#333")
    //   .style("font-family", "Nunito")
    //   .style("font-size", "10pt")
    //   .attr("opacity", 0.75)
    //   .text( d => this.getGroup(d) );

    this.label = this.svg.selectAll(".label")
			.data(this.graph.nodes)
			.enter().append("text")
	    .text( d => this.getName(d) )
	    .style("text-anchor", "middle")
	    .style("fill", "#000")
	    .style("font-family", "Nunito")
      .style("font-size", "6pt")
      .style("pointer-events", "none")
      .attr("opacity", 0.35)
      .attr("cursor", "pointer")
      // .on("mouseover", d => this.showLabel(d3.select(d3.event.currentTarget)) )
      // .on("mouseout", d => this.hideLabel(d3.select(d3.event.currentTarget)) )
      .on("click", d => this.navigate(d) );

    this.simulation
        .nodes(this.graph.nodes)
        .on("tick", () => this.ticked());

    this.simulation.force("link")
        .links(this.graph.links);

  }

  ticked() {
    this.link
      .attr("x1", d => d.source.x )
      .attr("y1", d => d.source.y )
      .attr("x2", d => d.target.x )
      .attr("y2", d => d.target.y );

    this.node
      .attr("cx", d => this.getX(d) )
      .attr("cy", d => this.getY(d) );

    this.label
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
  }

  getX(d) {
    d.x = Math.max(this.getRadius(d), Math.min(this.width - this.getRadius(d), d.x));
    return d.x;
  }

  getY(d) {
    d.y = Math.max(this.getRadius(d), Math.min(this.height - this.getRadius(d), d.y))
    return d.y;
  }

  showLabel(selected, node) {
    selected.transition().duration(TRNS)
      .style("font-size", "16pt")
      .style("fill", "#ddd")
      .style("-webkit-text-stroke-width", "1px")
      .style("-webkit-text-stroke-color", "#000")
      .attr("opacity", 0.9);
  }

  hideLabel(selected, node) {
    selected.transition().duration(TRNS)
      .style("font-size", "6pt")
      .style("fill", "#555")
      .style("-webkit-text-stroke-width", "0px")
      .style("-webkit-text-stroke-color", "#000")
      .attr("opacity", 0.35);
  }

  highlightGroup(selected) {
    var label = this.svg.selectAll("text").filter(node => {
      return (node["name"] == selected.name)
    });
    this.showLabel(label, selected);
    this.showGroupLabel(selected);
    this.svg.selectAll("circle").filter(node => {
      return (node.group !== selected.group)
    }).transition().duration(TRNS).attr("opacity", 0.3);
    this.svg.selectAll("circle").filter(node => {
      return (node.group == selected.group)
    }).transition().duration(TRNS)
      .attr("stroke", "#fff")
      .attr("stroke-width", "3px");
    this.svg.selectAll("line").transition().duration(TRNS)
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", "1px");
  }

  restoreGroup(unselected) {
    var label = this.svg.selectAll("text").filter(node => {
      return (node["name"] == unselected.name)
    });
    this.hideLabel(label, unselected);
    this.hideGroupLabel()
    this.svg.selectAll("circle")
      .attr("stroke", "#666")
      .attr("stroke-width", "1.5px")
      .attr("opacity", 1.0);
    this.svg.selectAll("line")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", "2px");
  }

  showGroupLabel(node) {
    this.groupName = node.group;
    this.groupColor = this.color(node.group);
  }

  hideGroupLabel() {
    this.groupName = "";
  }

  hijackGroupLabel() {
    this.groupName = "Loading graph...";
    this.groupColor = "#dddddd";
  }

  // moveGroupLabel(node) {
  //   this.groupTop = (this.getY(node)+20)+"px";
  //   this.groupLeft = (this.getX(node)+20)+"px";
  // }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  navigate(artist): void {
    var link;
    if ("id" in artist) {
      let link = ['/artist', artist.id, artist.name ];
      this.router.navigate(link);
    }
    else
    {
      let link = ['/artist', artist.uri, artist.name ];
      this.router.navigate(link);
    }
  }
}
