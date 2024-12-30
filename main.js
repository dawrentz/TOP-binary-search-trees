//main.js

import * as BTSmod from "./BSTmod.js";

// ========================================== init ========================================== //

console.clear();

// ========================================== functions ========================================== //

function makeRandArr(size) {
  let randArr = [];
  for (let i = 0; i < size; i++) {
    //# 1 - 100
    const randNum = Math.ceil(Math.random() * 100);
    randArr.push(randNum);
  }

  return randArr;
}

//callback for method call
function testCB(node) {
  console.log(node.data);
}

// ========================================== testing ========================================== //

console.log("=============== testArr ================");
// const testArr = makeRandArr(7);
const testArr = [87, 76, 79, 64, 77, 33, 28];
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
