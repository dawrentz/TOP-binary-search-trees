//BTSmod.js

import * as mergSortMod from "./mergSort.js";

// ========================================== init ========================================== //

// ========================================== Major Funcs ========================================== //

function Node(data, left = null, right = null) {
  return {
    data,
    left,
    right,
  };
}

export class Tree {
  constructor(arr) {
    //format arr once before build
    this.root = buildTree(formatArr(arr));
  }

  //only insert as a leaf, able to rebalance as neeed via rebalance()
  insert(value, node = this.root) {
    //if value is already in tree, do nothing
    if (value === node.data) return;

    //left insert
    if (value < node.data && !node.left) {
      node.left = Node(value);
      return;
    }
    //right insert
    if (value > node.data && !node.right) {
      node.right = Node(value);
      return;
    }

    //left continue
    if (value < node.data) this.insert(value, node.left);
    //right continue
    if (value > node.data) this.insert(value, node.right);
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
      //no match handled by continue cases
    }

    //case: is branch
    if (node.left !== null && node.right !== null) {
      //sub-case: match, replace value with next-greatest (and delete that leaf)
      if (value === node.data) {
        //next greatest value is the least of the right-sub-tree
        const nextGreatestVal = this.findSmallestVal(node.right);
        //nextGreatestVal is only either a leaf or has one child, and both are handled by the above cases. Delete it
        this.deleteItem(nextGreatestVal);
        //update node after the deletion, lest the updated value be the one deleted (matches the nextGreatestVal), creating an stack overflow
        node.data = nextGreatestVal;
        return;
      }
      //no match handled by continue cases
    }

    //left continue
    if (value < node.data) this.deleteItem(value, node.left, node);
    //right continue
    if (value > node.data) this.deleteItem(value, node.right, node);
  }

  //returns node of matching value, if exists
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
    if (!callback)
      throw new Error("Method requires a callback function argument");
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
    }

    //inOrder = left, root, right
    if (type === "in") {
      if (node.left) this.orderCall(callback, "in", node.left);
      callback(node);
      if (node.right) this.orderCall(callback, "in", node.right);
    }

    //postOrder = left, right, root
    if (type === "post") {
      if (node.left) this.orderCall(callback, "post", node.left);
      if (node.right) this.orderCall(callback, "post", node.right);
      callback(node);
    }
  }

  //wanted to input a value, not a node
  height(dataValue) {
    const node = this.find(dataValue);
    return this.countEdgesHeight(node);
  }

  //return # of edges along longest path to a leaf
  //did not think I'd be able to figure that one out
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
    //recursion is upside down; start at all the leafs, go up one node, compare left/right path sizes, repeat up to start point
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
    //this height() accepts a value, not a node
    const leftHeight = this.height(this.root.left.data);
    const rightHeight = this.height(this.root.right.data);
    const diffHeight = Math.abs(leftHeight - rightHeight);

    if (diffHeight <= 1) return true;
    //else, isnt needed, but sometimes I like to be descriptive
    else return false;
  }

  //for delete()
  findSmallestVal(node = this.root) {
    if (!node.left) return node.data;
    return this.findSmallestVal(node.left);
  }

  //rebuild entire tree
  rebalance() {
    const allValuesArr = this.grabAllValues();
    this.root = buildTree(formatArr(allValuesArr));
  }

  //reusing leverOrder
  //there's probably a better way, but I don't care
  //use something like array[0] and array[1...length]
  grabAllValues(allValues = [], queue = [this.root]) {
    //base case
    if (queue.length === 0) return allValues;

    //grab first and shift que for recursion
    const currentNode = queue.shift();

    //collect value, add to queue (if needed), and recursion
    allValues.push(currentNode.data);
    if (currentNode.left) queue.push(currentNode.left);
    if (currentNode.right) queue.push(currentNode.right);
    return this.grabAllValues(allValues, queue);
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

export const prettyPrint = (node, prefix = "", isLeft = true) => {
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
