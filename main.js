//main.js

import * as BTSmod from "./BSTmod.js";

// ========================================== init ========================================== //

function makeRandArr(size) {
  let randArr = [];
  for (let i = 0; i < size; i++) {
    const randNum = Math.floor(Math.random() * 101);
    randArr.push(randNum);
  }

  return randArr;
}

function testCB(node) {
  console.log(node.data);
}

// ========================================== testing ========================================== //

console.log("=============== testArr ================");
const testArr = makeRandArr(7);
console.log(testArr);

const testTree = new BTSmod.Tree(testArr);

console.log("=============== prettyPrint ================");
BTSmod.prettyPrint(testTree.root);

console.log("=============== insert  ================");
testTree.insert(123);
BTSmod.prettyPrint(testTree.root);
testTree.insert(124);
testTree.insert(125);

console.log("=============== delete ================");
testTree.deleteItem(123);
BTSmod.prettyPrint(testTree.root);

console.log("=============== find ================");
console.log(testTree.find(testArr[5]));

console.log("=============== levelOrder(console log data) ================");
testTree.levelOrder(testCB);

console.log("=============== inOrder(console log data) ================");
testTree.inOrder(testCB);
console.log("=============== preOrder(console log data) ================");
testTree.preOrder(testCB);
console.log("=============== postOrder(console log data) ================");
testTree.postOrder(testCB);

console.log("=============== height ================");
console.log(testTree.height(testArr[5]));

console.log("=============== depth ================");
console.log(testTree.depth(testArr[5]));

console.log("=============== isBalanced ================");
console.log(testTree.isBalanced());

console.log("=============== rebalance ================");
testTree.rebalance();
BTSmod.prettyPrint(testTree.root);
console.log(testTree.isBalanced());

console.log("=============== levelOrder(console log data) ================");
testTree.levelOrder(testCB);
console.log("=============== inOrder(console log data) ================");
testTree.inOrder(testCB);
console.log("=============== preOrder(console log data) ================");
testTree.preOrder(testCB);
console.log("=============== postOrder(console log data) ================");
testTree.postOrder(testCB);
