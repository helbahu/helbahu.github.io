class Node {
  constructor(value, adjacent = new Set()) {
    this.value = value;
    this.adjacent = adjacent;
  }
}

class Graph {
  constructor() {
    this.nodes = new Set();
  }

  // this function accepts a Node instance and adds it to the nodes property on the graph
  addVertex(vertex) {
    this.nodes.add(vertex);
  }

  // this function accepts an array of Node instances and adds them to the nodes property on the graph
  addVertices(vertexArray) {
    for(const vertex of vertexArray){
      this.addVertex(vertex);
    } 

  }

  // this function accepts two vertices and updates their adjacent values to include the other vertex
  addEdge(v1, v2) {
    v1.adjacent.add(v2);
    v2.adjacent.add(v1);
  }

  // this function accepts two vertices and updates their adjacent values to remove the other vertex
  removeEdge(v1, v2) {
    v1.adjacent.delete(v2);
    v2.adjacent.delete(v1);
  }

  // this function accepts a vertex and removes it from the nodes property, it also updates any adjacency lists that include that vertex
  removeVertex(vertex) {
    for(const adjacentVertex of vertex.adjacent){
      this.removeEdge(vertex,adjacentVertex);
    };
    this.nodes.delete(vertex);
  }

  // this function returns an array of Node values using DFS
  depthFirstSearch(start) {
    const stack = [start];
    // visitedVertices keeps track of which vertices were added to the stack and will be visited.
    const visitedVertices = [start.value];
    // seen keeps track of which vertices were visited in order from the stack.
    const seen = [];

    while(stack.length > 0){
      const vertex = stack.pop();
      seen.push(vertex.value);
      
      for(const adjacentVertex of vertex.adjacent){
        if(!visitedVertices.includes(adjacentVertex.value)){
          stack.push(adjacentVertex);
          visitedVertices.push(adjacentVertex.value);
        }

      }
      
    }

    return seen;

  }

  // this function returns an array of Node values using BFS
  breadthFirstSearch(start) {
    const queue = [start];

    // visitedVertices keeps track of which vertices were added to the stack and will be visited. 
    // In the case of BFS this is the same as the order of visiting (unlike DFS).
    const visitedVertices = [start.value];

    while(queue.length > 0){
      const vertex = queue.shift();
      
      for(const adjacentVertex of vertex.adjacent){
        if(!visitedVertices.includes(adjacentVertex.value)){
          queue.push(adjacentVertex);
          visitedVertices.push(adjacentVertex.value);
        }

      }
      
    }

    return visitedVertices;

  }

//Write a function which accepts a graph, a source vertex and target vertex and returns the shortest path. You can assume your graph is unweighted and undirected.
  shortestPath(start,target){
    let _shortestPaths = [];

    const _shortestPath = (vertex,path=[start.value],visitedVertices=[start]) => {
      if(vertex === target){ 
        _shortestPaths.length === 0 || _shortestPaths.length > path.length ? _shortestPaths = path : null;
        return;
      }

      for(const adjacentVertex of vertex.adjacent){
        if(!visitedVertices.includes(adjacentVertex)){
          _shortestPath(adjacentVertex,[...path,adjacentVertex.value],[...visitedVertices,adjacentVertex]);
        }
      }

    }

    _shortestPath(start);
    console.log(_shortestPaths);
    return _shortestPaths;

  }




  hasCycle() {

    const notVisitedVertices = new Set([...this.nodes]);

    const queue = [];
    while(notVisitedVertices.size > 0 || queue.length > 0){
      if(queue.length === 0){
        const vertex = notVisitedVertices.values().next().value; 
        queue.push(vertex);
        notVisitedVertices.delete(vertex);
      }

      const vertex = queue.shift();

      let adjVisitedCount = 0;
      for(const adjacentVertex of vertex.adjacent){
        if(notVisitedVertices.has(adjacentVertex)){
          queue.push(adjacentVertex);
          notVisitedVertices.delete(adjacentVertex);
        }else{
          adjVisitedCount += 1;
          if(adjVisitedCount > 1) return true;
        }
      }
      
    }

    return false;

  }




}

module.exports = {Graph, Node}