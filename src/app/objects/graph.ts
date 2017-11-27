export class Node {
  id: string;
  group: Number;
}

export class Link {
  source: string;
  target: string;
  value: Number;
}

export class Graph {
  nodes: Node[];
  links: Link[];
}
