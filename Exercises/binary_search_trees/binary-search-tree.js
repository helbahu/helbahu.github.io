class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(val) {
    let node = this.root ? this.root : null;

    while(node){
      if(val === node.val)return this;

      let side = val < node.val ? 'left' : 'right';
      if(!node[side])node[side] = new Node(val);
      
      node = node[side];
    }

    if(!this.root)this.root = new Node(val);
    return this;
  }

  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(val) {
    const _insert = (node) => {
      if(val < node.val){
        node.left ? _insert(node.left) : node.left = new Node(val);
      }else if(val > node.val){
        node.right ? _insert(node.right) : node.right = new Node(val);
      }
    }

    if(this.root){
      _insert(this.root);
    }else{
      this.root = new Node(val);      
    }
    return this;

  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  find(val) {
    let node = this.root;
    while(node){
      if(val === node.val)return node;
      let side = val < node.val ? 'left' : 'right';
      node = node[side];
    }
    return;
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(val) {
    const _findRecursively = (node) => {
      if(!node)return;
      if(val === node.val)return node;
      let side = val < node.val ? 'left' : 'right';
      return _findRecursively(node[side]);
    }

    return _findRecursively(this.root);
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    let nodes = [];
    const traverse = (node) => {
      nodes.push(node.val);
      if(node.left) traverse(node.left);
      if(node.right) traverse(node.right);
    }
    if(this.root) traverse(this.root);
    return nodes;

  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    let nodes = [];
    const traverse = (node) => {
      if(node.left) traverse(node.left);
      nodes.push(node.val);
      if(node.right) traverse(node.right);
    }
    if(this.root) traverse(this.root);
    return nodes;

  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    let nodes = [];
    const traverse = (node) => {
      if(node.left) traverse(node.left);
      if(node.right) traverse(node.right);
      nodes.push(node.val);
    }
    if(this.root) traverse(this.root);
    return nodes;

  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    let nodes = [];
    if(!this.root) return nodes;
    let nodesQueue = [this.root];
    while(nodesQueue.length){
      let node = nodesQueue.shift();
      if(node.left) nodesQueue.push(node.left);
      if(node.right) nodesQueue.push(node.right);
      nodes.push(node.val);
    }
    return nodes;

  }



  /** _insertNode(node): inserts a node into the BST in the right place.
   * Returns the tree. This is a helper function for the remove function. */

  _insertNode(node) {
    const _insert = (currentNode) => {
      if(node.val < currentNode.val){
        currentNode.left ? _insert(currentNode.left) : currentNode.left = node;
      }else if(node.val > currentNode.val){
        currentNode.right ? _insert(currentNode.right) : currentNode.right = node;
      }
    }

    if(node || node === 0) _insert(this.root);
    return this;

  }

  // This is a helper function for the remove(val). It ensures that a random child of the removed node will be the
  // child of the parent of the removed node.
  _randomRemove(node){
    // let randomNum = Math.floor(Math.random()*2);
    // return randomNum ? [node.left,node.right] : [node.right,node.left];
    return [node.right,node.left];
  }


  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {
    let deletedNode;
    let parent;
    const _remove = (node) => {
      if(!node) return;

      let side = val < node.val ? 'left' : 'right';
      if(node[side]){
        if(node[side].val === val){
          parent = node;
          deletedNode = node[side];
          let [child1,child2] = this._randomRemove(deletedNode);

          if(child1){
            parent[side] = child1;
            this._insertNode(child2);
          }else{
            parent[side] = child2; 
          }
          return deletedNode;
        }else{
          _remove(node[side]);
        }        
      }
      return deletedNode;

    }

    if(this.root && this.root.val === val){
      // Note: this is the for the edge case where the root is the value we are looking for.
      deletedNode = this.root;
      let [newRoot,child] = this._randomRemove(this.root);
      if(newRoot){
        this.root = newRoot;
        this._insertNode(child);
      }else{
        this.root = child;
      }
    }else{
      _remove(this.root);
    }

    return deletedNode;
  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. 
   * NOTE: This does deep balance, meaning, it will see if any node has unbalanced branches, not just the root. 
   */

  isBalanced() {
    let balanced = true;
    const _isBalanced = (node) => {
      if(!node)return 0;
      if(!node.left && !node.right)return 0;
      if(!node.left || !node.right) return 1 + (node.left ? _isBalanced(node.left) : _isBalanced(node.right));
      if(node.left && node.right){
        let leftHeight = _isBalanced(node.left);
        let rightHeight = _isBalanced(node.right);
        let delta = Math.abs(leftHeight - rightHeight);
        delta > 1 ? balanced = false : null;
        return delta;
      }

    } 

    let res = _isBalanced(this.root);
    res > 1 ? balanced = false : null;
    return balanced;
  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {
    let secondHighest;
    let nodes = [];
    const traverse = (node) => {
      if(!node)return;
      let parent = node;
      let currentNode = node;
      while(currentNode.right){
        currentNode = currentNode.right;
        currentNode.right ? parent = currentNode : null;
      }
      return currentNode.left ? currentNode.left.val : parent.val; 

    }
    if(this.root) return traverse(this.root);
    return secondHighest;
    
  }
}

module.exports = BinarySearchTree;
