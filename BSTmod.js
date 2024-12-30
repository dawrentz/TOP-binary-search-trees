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
      throw new Error(
        "levelOrder() method requires a callback function argument"
      );
    }
    //base case
    if (queue.length === 0) return;

    //grab first and shift que for recursion
    const currentNode = queue.shift();

    callback(currentNode);
    if (currentNode.left) queue.push(currentNode.left);
    if (currentNode.right) queue.push(currentNode.right);
    return this.levelOrder(callback, queue);
  }

  findSmallestVal(node = this.root) {
    if (node.left === null) return node.data;
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
  console.log("===============================");
  console.log("origArr");
  console.log(arr);
  console.log("arr");
  console.log(arr);
  console.log("midValue");
  console.log(arr[midIndex]);
  console.log("leftArr");
  console.log(arr.slice(0, midIndex));
  console.log("rightArr");
  console.log(arr.slice(midIndex + 1, arr.length));
  console.log("leftNode");
  console.log(leftNode);
  console.log("rightNode");
  console.log(rightNode);

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

console.log("=============== x ================");
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testTree = new Tree(testArr);

prettyPrint(testTree.root);

testTree.deleteItem(8);
prettyPrint(testTree.root);

console.log(testTree.find(1));

testTree.levelOrder(testCB);

function testCB(node) {
  console.log("from CB");
  console.log(node.data);
}
