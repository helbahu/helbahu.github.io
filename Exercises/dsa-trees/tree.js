/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }


  /** _forEachNode (callback): this is a helper function that iterates 
   * over each node and executes a callback. The callback will have an
   * accumulator 'acc' the value of the current node 'val'. */

  _forEachNode (callback) {
    let acc = 0;
    const sumStack = [this.root];
    while(sumStack.length){
      const current = sumStack.pop();
      if(current){
        acc = callback(acc,current.val);
        for(const child of current.children){
          sumStack.push(child);
        }
      }
    }
    return acc;   
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues() {
    return this._forEachNode((acc,val)=>acc += val);
  }

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens() {
    return this._forEachNode((acc,val)=>val % 2 === 0 ? acc += 1 : acc);
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(lowerBound) {
    return this._forEachNode((acc,val)=>val > lowerBound ? acc += 1 : acc);
  }

}

const testNode = new TreeNode(12,[
  new TreeNode(2),
  new TreeNode(55,[new TreeNode(3),new TreeNode(7),new TreeNode(5,[new TreeNode(73)])]),
  new TreeNode(63),
  new TreeNode(1,[new TreeNode(34)])
]);
const testTree = new Tree(testNode);

module.exports = { Tree, TreeNode, testTree };
