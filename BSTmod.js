//BTSmod.js

import * as mergSortMod from "./mergSort.js";

// ========================================== init ========================================== //

console.clear();

// ========================================== Major Funcs ========================================== //

function Node(data, left, right) {
  return {
    data,
    left,
    right,
  };
}

class Tree {
  constructor(arr) {
    // this.arr = arr;
    // this.root = buildTree(arr);
  }
}

function buildTree(arr) {
  if (arr.length === 0) return null;

  const formatedArr = formatArr(arr);

  //find mid, run left until null, then right all the way back up to root

  //-1 to convert to index
  const midIndex = Math.ceil(formatedArr.length / 2 - 1);
  const rootValue = formatedArr[midIndex];
  const leftArr = formatedArr.slice(0, midIndex);
  const rightArr = formatedArr.slice(midIndex + 1, formatedArr.length);
  const leftNode = buildTree(leftArr);
  const rightNode = buildTree(rightArr);
  const root = Node(rootValue, leftNode, rightNode);

  //test
  console.log("===============================");
  console.log("origArr");
  console.log(arr);
  console.log("formatedArr");
  console.log(formatedArr);
  console.log("midValue");
  console.log(formatedArr[midIndex]);
  console.log("left");
  console.log(formatedArr.slice(0, midIndex));
  console.log("right");
  console.log(formatedArr.slice(midIndex + 1, formatedArr.length));

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
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

const x = buildTree(testArr);

console.log("=============== x ================");
prettyPrint(x);
