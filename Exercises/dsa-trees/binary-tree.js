/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    let depth = 0;
    let end = false;
    const sumQueue = [this.root];
    while(sumQueue.length && !end){
      const current = sumQueue.shift();
      if(current){
        if(!current.left && !current.right)end=true;
        if(current.left)sumQueue.push(current.left);
        if(current.right)sumQueue.push(current.right);
        depth++;
      }
    }
    return depth;   

  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    if(!this.root)return 0;
    let depth = 1;
    const sumQueue = [this.root];
    while(sumQueue.length){
      const current = sumQueue.shift();
      if(current){
        if(current.left)sumQueue.push(current.left);
        if(current.right)sumQueue.push(current.right);
        if(current.left || current.right)depth++;

      }
    }
    return depth;
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    let result = 0;

    function maxSumHelper(node) {
      if (node === null) return 0;
      const leftSum = maxSumHelper(node.left);
      const rightSum = maxSumHelper(node.right);
      result = Math.max(result, node.val + leftSum + rightSum);
      return Math.max(0, leftSum + node.val, rightSum + node.val);
    }

    maxSumHelper(this.root);
    return result;
    
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    let nextLargerVal = null;
    const sumStack = [this.root];
    while(sumStack.length){
      const current = sumStack.pop();
      if(current){
        current.val > lowerBound ? 
          (!nextLargerVal || current.val < nextLargerVal ? 
              nextLargerVal = current.val : null) 
          : null;
        sumStack.push(current.left);
        sumStack.push(current.right);

      }
    }
    return nextLargerVal;
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {
    const _isNode1Or2 = (val) => {
      return val === node1 || val === node2
    }

    const _areCousins = (nodesList) => {
      const nextNodeList = [];
      if(nodesList.includes(node1) && nodesList.includes(node2))return true;

      for(const node of nodesList){
        if(_isNode1Or2(node.left) && _isNode1Or2(node.right))return false;
        node.left ? nextNodeList.push(node.left): null;
        node.right ? nextNodeList.push(node.right): null;
      }
      return nextNodeList.length ? _areCousins(nextNodeList):false;      
    }

    return _areCousins([this.root]);
  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize(tree) {
    const values = [];

    function traverse(node) {
      if (node) {
        values.push(node.val);
        traverse(node.left);
        traverse(node.right);
      } else {
        values.push("#");
      }
    }

    traverse(tree.root);
    return values.join(" ");
  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */
  static deserialize(stringTree) {
    if (!stringTree) return null;

    const values = stringTree.split(" ");

    function buildTree() {
      // building a tree starting from the beginning of the array
      if (values.length) {
        const currentVal = values.shift();

        if (currentVal === "#") return null;

        // remember to convert values back into numbers
        let currentNode = new BinaryTreeNode(+currentVal);
        currentNode.left = buildTree();
        currentNode.right = buildTree();

        return currentNode;
      }
    }

    const root = buildTree();
    return new BinaryTree(root);
  }

  // static deserialize(stringTree) {
  //   let strArray = stringTree.split(/[{}]+/);
  //   strArray = strArray.filter(str=> str !== '' && str !== ' ' && str !== ' root: ');
  //   console.log(strArray);

  //   const _newBinaryNode = (array) => {
  //     let left;
  //     let val;
  //     let right;
  //     for(const key of array){
  //       if(key === ' left: '){
  //         left = _newBinaryNode(array.slice(1));
  //       }else if(key === ', right: '){
  //         right = _newBinaryNode(array.slice(1));
  //       }else if(key.includes('left') && key.includes('val') ){
  //         let newNodeArray = key.split(/[,leftrightval: ]+/).filter(str=> str !== '' && str !== ' ' && str !== ' root: ');
  //         return new BinaryTreeNode(parseInt(newNodeArray[2]),null,null);
  //       }else if(key.indexOf(', val:') === 0){
  //         val = key.split(' ');
  //         val = val[val.length-1];
  //       }
  
  //     } 
  //     return new BinaryTreeNode(val,left,right);
  //   }
  //   return new BinaryTree(_newBinaryNode(strArray));
  // }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2, currentNode=this.root) {
    if (!currentNode) return null;

    if (currentNode === node1 || currentNode === node2) return currentNode;

    const left = this.lowestCommonAncestor(node1, node2, currentNode.left);
    const right = this.lowestCommonAncestor(node1, node2, currentNode.right);

    if (left && right) return currentNode;    
    if (left || right) return left || right;
    
    if (left === null && right === null) return null;


  }
}

module.exports = { BinaryTree, BinaryTreeNode };
