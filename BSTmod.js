//BTSmod.js

import * as mergSortMod from "./mergSort.js";

// ========================================== init ========================================== //

console.clear();

// ========================================== Major Funcs ========================================== //

function Node(data, left = null, right = null) {
  return {
    data,
    left,
    right,
  };
}

class Tree {
  constructor(arr) {
    // this.arr = arr;
    //run formatting once before build
    this.root = buildTree(formatArr(arr));
  }

  //only insert as a leaf, able to rebalance as neeed via rebalance()
  insert(value, node = this.root) {
    //if value is already in tree, do nothing
    if (value === node.data) return;

    //left insert
    if (value < node.data && node.left === null) {
      node.left = Node(value);
      return;
    }
    //right insert
    if (value > node.data && node.right === null) {
      node.right = Node(value);
      return;
    }

    //left continue
    if (value < node.data && node.left !== null) {
      this.insert(value, node.left);
    }
    //right continue
    if (value > node.data && node.right !== null) {
      this.insert(value, node.right);
    }
  }

  deleteItem(value, node = this.root, prevNode = null) {
    //cases: is leaf (end)
    if (node.left === null && node.right === null) {
      //sub-case: if match, prevNode points to null
      if (value === node.data) {
        //test if need update left or right node
        //left
        if (value < prevNode.data) {
          prevNode.left = null;
          return;
        }
        //right
        if (value > prevNode.data) {
          prevNode.right = null;
          return;
        }
      }
      //sub-case: if no match, value is not in tree, do nothing
      if (value !== node.data) return;
    }

    //case: has one child
    if (
      (node.left !== null && node.right === null) ||
      (node.left === null && node.right !== null)
    ) {
      //sub case: match
      if (value === node.data) {
        //grab non-null child node
        let childNode;
        if (node.left !== null && node.right === null) childNode = node.left;
        if (node.left === null && node.right !== null) childNode = node.right;

        //test if need update left or right node
        //left
        if (value < prevNode.data) {
          prevNode.left = childNode;
          return;
        }
        //right
        if (value > prevNode.data) {
          prevNode.right = childNode;
          return;
        }
      }
      //no match handled by continue
    }

    //case: is branch
    if (node.left !== null && node.right !== null) {
      //sub-case: match, replace value with next-greatest (delete that leaf)
      if (value === node.data) {
        //next greatest vaue is the smallest of the right-sub-tree
        const nextGreatestVal = this.findSmallestVal(node.right);
        //value is only either a leaf or has one child, and both are handled by the above cases
        this.deleteItem(nextGreatestVal);
        //update node after the deletion, lest the updated value be the one deleted, creating an infinite loop of branch deletion
        node.data = nextGreatestVal;
        return;
      }
      //no match handled by continue
    }

    //left continue
    if (value < node.data) {
      this.deleteItem(value, node.left, node);
    }
    //right continue
    if (value > node.data) {
      this.deleteItem(value, node.right, node);
    }
  }

  find(value, node = this.root) {
    //if value not in tree
    if (node === null) return null;
    //base case: found value
    if (value === node.data) return node;

    //else continue
    if (value < node.data) return this.find(value, node.left);
    if (value > node.data) return this.find(value, node.right);
  }

  levelOrder(callback, queue = [this.root]) {
    //error handle
    if (!callback) {
      throw new Error("Method requires a callback function argument");
    }
    //base case
    if (queue.length === 0) return;

    //grab first and shift que for recursion
    const currentNode = queue.shift();

    //run callback, add to queue (if needed), and recursion
    callback(currentNode);
    if (currentNode.left) queue.push(currentNode.left);
    if (currentNode.right) queue.push(currentNode.right);
    return this.levelOrder(callback, queue);
  }

  //inOrder = left, root, right
  inOrder(callback) {
    this.orderCall(callback, "in");
  }

  //preOrder = root, left, right
  preOrder(callback) {
    this.orderCall(callback, "pre");
  }

  //postOrder = left, right, root
  postOrder(callback) {
    this.orderCall(callback, "post");
  }

  orderCall(callback, type, node = this.root) {
    //error handle
    if (!callback) {
      throw new Error("Method requires a callback function argument");
    }

    //preOrder = root, left, right
    if (type === "pre") {
      callback(node);
      if (node.left) this.orderCall(callback, "pre", node.left);
      if (node.right) this.orderCall(callback, "pre", node.right);
      return;
    }

    //inOrder = left, root, right
    if (type === "in") {
      if (node.left) this.orderCall(callback, "in", node.left);
      callback(node);
      if (node.right) this.orderCall(callback, "in", node.right);
      return;
    }

    //postOrder = left, right, root
    if (type === "post") {
      if (node.left) this.orderCall(callback, "post", node.left);
      if (node.right) this.orderCall(callback, "post", node.right);
      callback(node);
      return;
    }
  }

  height(dataValue) {
    const node = this.find(dataValue);
    return this.countEdgesHeight(node);
  }

  //return # of edges along longest path to a leaf
  //did not think I'd be able to figure that out
  countEdgesHeight(node) {
    let edgeCount = 0;
    let leftEdgeCount = 0;
    let rightEdgeCount = 0;

    //no need base-case/return 0 because edgeCount is init to 0.
    //If node is null, then no recursion, and edgeCount remains as 0 and is returned/passed up to the prev left/right edge count
    //If node is not null, repeat down to null node, counting with "1 + " along the way
    if (node.left) leftEdgeCount = 1 + this.countEdgesHeight(node.left);
    if (node.right) rightEdgeCount = 1 + this.countEdgesHeight(node.right);

    //return the larger sub-path
    //recursion is upside down, start at all the leafs, go up one node, compare left/right path sizes, repeat up to start point
    if (leftEdgeCount >= rightEdgeCount) edgeCount += leftEdgeCount;
    else edgeCount += rightEdgeCount;

    return edgeCount;
  }

  //return # of edges to root
  depth(dataValue, node = this.root, counter = 0) {
    //if searchValue is not in this node, update counter and move to next appropriate node
    if (dataValue !== node.data) {
      if (dataValue < node.data)
        return this.depth(dataValue, node.left, ++counter);
      if (dataValue > node.data)
        return this.depth(dataValue, node.right, ++counter);
    }

    //else, value is found, return counter
    else return counter;
  }

  isBalanced() {
    //my height() accepts a value, not a node
    const leftHeight = this.height(this.root.left.data);
    const rightHeight = this.height(this.root.right.data);
    const diffHeight = Math.abs(leftHeight - rightHeight);

    if (diffHeight <= 1) return true;
    else return false;
  }

  findSmallestVal(node = this.root) {
    if (!node.left) return node.data;
    return this.findSmallestVal(node.left);
  }
}

function buildTree(arr) {
  //base case
  if (arr.length === 0) return null;

  //-1 to convert to index
  const midIndex = Math.ceil(arr.length / 2 - 1);
  //declaring all for readability sake
  const rootValue = arr[midIndex];
  const leftArr = arr.slice(0, midIndex);
  const rightArr = arr.slice(midIndex + 1, arr.length);
  const leftNode = buildTree(leftArr);
  const rightNode = buildTree(rightArr);
  const root = Node(rootValue, leftNode, rightNode);

  //test
  // console.log("===============================");
  // console.log("origArr");
  // console.log(arr);
  // console.log("arr");
  // console.log(arr);
  // console.log("midValue");
  // console.log(arr[midIndex]);
  // console.log("leftArr");
  // console.log(arr.slice(0, midIndex));
  // console.log("rightArr");
  // console.log(arr.slice(midIndex + 1, arr.length));
  // console.log("leftNode");
  // console.log(leftNode);
  // console.log("rightNode");
  // console.log(rightNode);

  return root;
}

// ========================================== Lessor Funcs ========================================== //

function formatArr(arr) {
  const sortedArr = mergSortMod.mergeSort(arr);
  const formatArr = removeDuplicates(sortedArr);

  return formatArr;
}

function removeDuplicates(arr) {
  let formatArr = [];

  arr.forEach((num, index) => {
    if (arr[index] !== arr[index + 1]) formatArr.push(num);
  });

  return formatArr;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// ========================================== testing ========================================== //

console.log("=============== new ================");

const testArr = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 222, 333, 444, 555, 666, 777, 888,
  999, 1000,
];
// const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testTree = new Tree(testArr);

console.log("=============== prettyPrint ================");
prettyPrint(testTree.root);

console.log("=============== insert (123) ================");
testTree.insert(123);
prettyPrint(testTree.root);
testTree.insert(124);
testTree.insert(125);
testTree.insert(126);
testTree.insert(127);
testTree.insert(128);
testTree.insert(129);
testTree.insert(130);

console.log("=============== delete (123) ================");
testTree.deleteItem(123);
prettyPrint(testTree.root);

console.log("=============== find (1) ================");
console.log(testTree.find(1));

console.log("=============== levelOrder(console log data) ================");
function testCB(node) {
  console.log(node.data);
}
testTree.levelOrder(testCB);

console.log("=============== inOrder(console log data) ================");
testTree.inOrder(testCB);
console.log("=============== preOrder(console log data) ================");
testTree.preOrder(testCB);
console.log("=============== postOrder(console log data) ================");
testTree.postOrder(testCB);

console.log("=============== height (67) ================");
console.log(testTree.height(67));

console.log("=============== depth(23) ================");
console.log(testTree.depth(23));

console.log("=============== isBalanced ================");
console.log(testTree.isBalanced());
