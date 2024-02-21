/** Node: node for a singly linked list. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

/** LinkedList: chained together nodes. */

class LinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.push(val);
  }

  /** push(val): add new value to end of list. */

  push(val) {
    let newNode = new Node(val);
    if(this.head === null){
      this.head = newNode;
    }else if(this.head.next === null){
      this.head.next = newNode;
    }else{
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length ++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    if(this.head === null) return this.push(val);
    let newNode = new Node(val);
    newNode.next = this.head;
    this.head = newNode;
    this.length ++;
  }

  /** pop(): return & remove last item. */

  pop() {
    let node = this.head;
    let removedNode = this.tail;

    if(node && (node.next === null)){
      this.head = null;
      this.tail = null;
      this.length = 0;  
      return removedNode.val;
    }

    while(node.next !== this.tail){
      node = node.next;
    }
    node.next = null;
    this.tail = node;
    this.length --;
    return removedNode.val;
  }

  /** shift(): return & remove first item. */

  shift() {
    let node = this.head;

    if(node && (node.next === null)){
      this.head = null;
      this.tail = null;
      this.length = 0;  
      return node.val;
    }
    this.head = node.next;
    this.length --;
    return node.val;
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    if(idx < 0) throw 'Invalid Index';
    let node = this.head;
    for(let i = 0;i<idx;i++){
      node = node.next;
    }
    return node.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    if(idx < 0) throw 'Invalid Index';
    let node = this.head;
    for(let i = 0;i<idx;i++){
      node = node.next;
    }
    node.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    if(idx < 0) throw 'Invalid Index';
    if(this.length === 0) throw 'Empty List';

    if((idx === 0)&&(this.length>0)){
      return this.unshift(val);      
    }
    let node = this.head;
    for(let i = 0;i<idx-1;i++){
      node = node.next;
    }

    let newNode = new Node(val);
    newNode.next = node.next;
    node.next = newNode;
    this.length ++;
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {
    if(idx < 0) throw 'Invalid Index';
    if(this.length === 0) throw 'Empty List';

    if((idx === 0)&&(this.length>0)){
      return this.shift();      
    }
 
    let beforenode = this.head;
    for(let i = 0;i<idx-1;i++){
      beforenode = beforenode.next;
    }
    let removednode = beforenode.next;
    if(removednode === this.tail){
      return this.pop();
    }
    let afternode = removednode.next;
    beforenode.next = afternode;
    this.length --;
    return removednode.val;
  }

  /** average(): return an average of all values in the list */

  average() {
    let sum = 0;
    let node = this.head;
    while(node !== null){
      sum += node.val;
      node = node.next;
    }
    return sum/this.length;    
  }

  /** reverse(): reverses the order of the array */

  reverse() {
    let node = this.head;
    let nxt = null;
    while(node !== null){
      let nextNode = node.next;
      node.next = nxt;
      nxt = node;
      node = nextNode;
    }
    [this.tail,this.head] = [this.head,this.tail];
  }

  /** pivot(val) accepts a value, and it will sort the linkedlist such that the values less than the value given
      will be before the values equal to or greater than that value.  
   */
  pivot(val) {
    let node = this.head;
    let head1 = null;
    let tail1 = null;
    let head2 = null; 
    let tail2 = null;
    while(node !== null){
      if(node.val < val){
        if(head1 === null){
          head1 = node;
        }else if(head1.next === null){
          head1.next = node;
        }else{
          tail1.next = node;
        }  
        tail1 = node;

      }else{
        if(head2 === null){
          head2 = node;
        }else if(head2.next === null){
          head2.next = node;
        }else{
          tail2.next = node;
        }  
        tail2 = node;

      }
      node = node.next;
    }

    this.head = head1;
    tail1.next = head2;
    this.tail = tail2;

  }


  list() {
    let l = [];
    let node = this.head;
    while(node !== null){
      l.push(node.val);
      node = node.next;
    }
    return l;
  }

}


/** DoublyLinkedList: chained together nodes. */

class DoublyLinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.push(val);
  }

  /** push(val): add new value to end of list. */

  push(val) {
    let newNode = new Node(val);
    if(this.head === null){
      this.head = newNode;
      this.tail = newNode;
    }else if(this.head.next === null){
      this.head.next = newNode;
      this.tail = newNode;
      this.tail.prev = this.head;
    }else{
      this.tail.next = newNode;
      let prevNode = this.tail;
      this.tail = newNode;
      this.tail.prev = prevNode;
    }
    this.length ++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    if(this.head === null) return this.push(val);
    let newNode = new Node(val);
    this.head.prev = newNode;
    newNode.next = this.head;
    this.head = newNode;
    this.length ++;
  }

  /** pop(): return & remove last item. */

  pop() {
    let node = this.head;
    let removedNode = this.tail;

    if(node && (node.next === null)){
      this.head = null;
      this.tail = null;
      this.length = 0;  
      return removedNode.val;
    }

    let newTail = this.tail.prev;
    newTail.next = null;
    this.tail = newTail;
    this.length --;
    return removedNode.val;
  }

  /** shift(): return & remove first item. */

  shift() {
    let node = this.head;

    if(node && (node.next === null)){
      this.head = null;
      this.tail = null;
      this.length = 0;  
      return node.val;
    }
    this.head = node.next;
    this.head.prev = null;
    this.length --;
    return node.val;
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    if(idx < 0) throw 'Invalid Index';
    let node = this.head;
    for(let i = 0;i<idx;i++){
      node = node.next;
    }
    return node.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    if(idx < 0) throw 'Invalid Index';
    let node = this.head;
    for(let i = 0;i<idx;i++){
      node = node.next;
    }
    node.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    if(idx < 0) throw 'Invalid Index';
    if(this.length === 0) throw 'Empty List';

    if((idx === 0)&&(this.length>0)){
      return this.unshift(val);      
    }
    let node = this.head;
    for(let i = 0;i<idx-1;i++){
      node = node.next;
    }

    let newNode = new Node(val);
    newNode.next = node.next;
    newNode.prev = node;

    node.next.perv = newNode;
    node.next = newNode;
    this.length ++;
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {
    if(idx < 0) throw 'Invalid Index';
    if(this.length === 0) throw 'Empty List';

    if((idx === 0)&&(this.length>0)){
      return this.shift();      
    }
 
    let beforenode = this.head;
    for(let i = 0;i<idx-1;i++){
      beforenode = beforenode.next;
    }
    let removednode = beforenode.next;
    if(removednode === this.tail){
      return this.pop();
    }
    let afternode = removednode.next;
    beforenode.next = afternode;
    afternode.prev = beforenode;
    this.length --;
    return removednode.val;
  }

  /** average(): return an average of all values in the list */

  average() {
    let sum = 0;
    let node = this.head;
    while(node !== null){
      sum += node.val;
      node = node.next;
    }
    return sum/this.length;    
  }

  /** reverse(): reverses the order of the array */

  reverse() {
    let node = this.head;
    let nxt = null;
    while(node !== null){
      let nextNode = node.next;
      node.next = nxt;
      nxt = node;
      node.prev = nextNode;
      node = nextNode;
    }
    [this.tail,this.head] = [this.head,this.tail];
  }

  // list() {
  //   let l = [];
  //   let node = this.head;
  //   while(node !== null){
  //     l.push(node.val);
  //     node = node.next;
  //   }
  //   return l;
  // }


}

//Sort Sorted Linked Lists
function sortSortedLinkedLists(listA,listB){
  let lst = [];
  let nodeA = listA.head;
  let nodeB = listB.head;
  while((nodeA !== null)||(nodeB !== null)){
    if(nodeA === null){
      lst.push(nodeB.val);
      nodeB = nodeB.next;
    }else if(nodeB === null){
      lst.push(nodeA.val);
      nodeA = nodeA.next;
    }else{
      if(nodeA.val < nodeB.val){
        lst.push(nodeA.val);
        nodeA = nodeA.next;
      }else{
        lst.push(nodeB.val);
        nodeB = nodeB.next;  
      }

    }

  }
  return new LinkedList(lst);

}

// Cicrular Arrays

class CircularArray {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.addItem(val);
  }

  /** printArray(): will print every value in the circular array. */
  printArray(){
    let node = this.head;
    for(let i = 0; i < this.length;i++){
      console.log(node.val);
      node = node.next;
    }
  }

  // printArrayVal(val){
  //   let node = this.head;
  //   for(let i = 0; i < val;i++){
  //     console.log(node.val);
  //     node = node.next;
  //   }
  // }


  /** push(val): add new value to end of list. */

  addItem(val) {
    let newNode = new Node(val);
    if(this.head === null){
      this.head = newNode;
      this.head.prev = newNode;
      this.head.next = newNode;
      this.tail = newNode;
      this.tail.prev = newNode;
      this.tail.next = newNode;
    }else if(this.length === 1){
      this.head.next = newNode;
      this.head.prev = newNode;
      this.tail = newNode;
      this.tail.prev = this.head;
      this.tail.next = this.head;
    }else{
      this.head.prev = newNode;
      this.tail.next = newNode;
      let prevNode = this.tail;
      this.tail = newNode;
      this.tail.prev = prevNode;
      this.tail.next = this.head;
    }
    this.length ++;
  }

  getByIndex(val){
    let l = this.length
    let idx = val%l;
    let node = this.head;
    if(idx >= 0){
      for(let i = 0;i<idx;i++){
        node = node.next;
      }  
    }else if (idx < 0){
      for(let i = 0;i>idx;i--){
        node = node.prev;
      }  
    }
    return node.val;
  }

  rotate(val){
    let l = this.length
    let idx = val%l;
    let node = this.head;
    if(idx >= 0){
      for(let i = 0;i<idx;i++){
        node = node.next;
      }  
    }else if (idx < 0){
      for(let i = 0;i>idx;i--){
        node = node.prev;
      }  
    }
    this.head = node;
    this.tail = node.prev;

  }



// -0-----------------------------------------------------


  /** unshift(val): add new value to start of list. */

  unshift(val) {
    if(this.head === null) return this.push(val);
    let newNode = new Node(val);
    this.head.prev = newNode;
    newNode.next = this.head;
    this.head = newNode;
    this.length ++;
  }

  /** pop(): return & remove last item. */

  pop() {
    let node = this.head;
    let removedNode = this.tail;

    if(node && (node.next === null)){
      this.head = null;
      this.tail = null;
      this.length = 0;  
      return removedNode.val;
    }

    let newTail = this.tail.prev;
    newTail.next = null;
    this.tail = newTail;
    this.length --;
    return removedNode.val;
  }

  /** shift(): return & remove first item. */

  shift() {
    let node = this.head;

    if(node && (node.next === null)){
      this.head = null;
      this.tail = null;
      this.length = 0;  
      return node.val;
    }
    this.head = node.next;
    this.head.prev = null;
    this.length --;
    return node.val;
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    if(idx < 0) throw 'Invalid Index';
    let node = this.head;
    for(let i = 0;i<idx;i++){
      node = node.next;
    }
    return node.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    if(idx < 0) throw 'Invalid Index';
    let node = this.head;
    for(let i = 0;i<idx;i++){
      node = node.next;
    }
    node.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    if(idx < 0) throw 'Invalid Index';
    if(this.length === 0) throw 'Empty List';

    if((idx === 0)&&(this.length>0)){
      return this.unshift(val);      
    }
    let node = this.head;
    for(let i = 0;i<idx-1;i++){
      node = node.next;
    }

    let newNode = new Node(val);
    newNode.next = node.next;
    newNode.prev = node;

    node.next.perv = newNode;
    node.next = newNode;
    this.length ++;
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {
    if(idx < 0) throw 'Invalid Index';
    if(this.length === 0) throw 'Empty List';

    if((idx === 0)&&(this.length>0)){
      return this.shift();      
    }
 
    let beforenode = this.head;
    for(let i = 0;i<idx-1;i++){
      beforenode = beforenode.next;
    }
    let removednode = beforenode.next;
    if(removednode === this.tail){
      return this.pop();
    }
    let afternode = removednode.next;
    beforenode.next = afternode;
    afternode.prev = beforenode;
    this.length --;
    return removednode.val;
  }

  /** average(): return an average of all values in the list */

  average() {
    let sum = 0;
    let node = this.head;
    while(node !== null){
      sum += node.val;
      node = node.next;
    }
    return sum/this.length;    
  }

  /** reverse(): reverses the order of the array */

  reverse() {
    let node = this.head;
    let nxt = null;
    while(node !== null){
      let nextNode = node.next;
      node.next = nxt;
      nxt = node;
      node.prev = nextNode;
      node = nextNode;
    }
    [this.tail,this.head] = [this.head,this.tail];
  }

  // list() {
  //   let l = [];
  //   let node = this.head;
  //   while(node !== null){
  //     l.push(node.val);
  //     node = node.next;
  //   }
  //   return l;
  // }


}



module.exports = LinkedList;
