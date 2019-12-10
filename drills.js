class Memory {
  constructor() {
    this.memory = new Float64Array(1024)
    this.head = 0
  }
allocate(size) {
  // check if enough space
  if(this.head + size > this.memory.length) {
    return null;
  }
  // need to save this to return b/c this.head will soon be added upon with size 
  let start = this.head 

  this.head += size
  return start;  
}



copy(toIdx, fromIdx, size) {
  // check for a useless request here. 
  if(fromIdx === toIdx) {
    return;
  }

  if(fromIdx > toIdx) {
    // iterate forward 
    for(let i = 0; i < size; i++) {
      this.set(toIdx + i, this.get(fromIdx + i))
    }
  } else {
    // iterate backward 
    for(let i = size - 1; i >= 0; i--) {
      this.set(toIdx + i, this.get(fromIdx + i))
    }
  }

}

free(ptr) {}

get(ptr) {
  return this.memory[ptr]
}

set(ptr, value) {
  this.memory[ptr] = value;
}

}

let memory = new Memory()

class Array {
  constructor(){ 
    this.length = 0;
    this._capacity = 0;
    this.ptr = memory.allocate(this.length)
  }

  push(value) {
    // is the length more than or equal to the capacity? 
    if(this.length >= this._capacity) {
      // _resize it 
      this._resize((this.length + 1) * Array.SIZE_RATIO)
    } 
    // arg: where & value. You get there where by adding the pointer to the length. 
    memory.set(this.ptr + this.length, value)
    // once added increase the length of the array
    // This doesn't increase the length of the memory, but just adds to length of data. The length is largely
    // a description of the data's length. not the memory length
    this.length++; 
    
  }

  _resize(size) {
    // need this so you can clear free up the old chunk of data 
    const oldPtr = this.ptr
    // this gets reassigned and implements news data size 
    this.ptr = memory.allocate(size);
    // memory.allocate will check if the this.head + size is greater than its total array space. If so, 
    // it returns null 
    if(this.ptr === null) {
      throw new Error("Out of memory!")
    } 
    memory.copy(this.ptr, oldPtr, this.length)
    memory.free(oldPtr)
    this._capacity = size;
  }

  get(index) {
    // can do index > this.length - 1
    if(index < 0 || index >= this.length) {
      throw new Error("Index Error")
    }
    return memory.get(this.ptr + index)
  }
  // comes off at the pop just like normal array
  pop() {
    // Is there anything to pop? 
    if(this.length == 0) {
      throw new Error("Index Error")
    }
    // remember the last item in the array is size of array - 1
    // this.ptr returns the start of the data array. 
    const value = memory.get(this.ptr + this.length - 1)
    // ensure length is shortened to describe data length 
    this.length--;
    return value;
  }
  // inserting anywhere shifts everything else over 1 index 
  insert(index, value) {
    // Ensuring this index does even exist
    // or you could do index > this.length - 1
    if(index < 0 || index >= this.length) {
      throw new Error("Index Error")
    }
    // Ensure if there is enough room
    if(this.length >= this._capacity ) {
      // _resize if not enough room
      // add 1 to length, cause inserting 1 item 
      this._resize((this.length + 1) * Array.SIZE_RATIO)
    }
    // copy old data to new data chunk ***  WHY ARE ADDING 1? 
    // fromIndex: Because the this.ptr is the head, which is 0, you need to add one to get the correct index. 
    // the toIdx how far you want to go
    memory.copy(this.ptr + index +  1, this.ptr + index, this.length - index) // -index because you are taking that spot away by adding it? 
    memory.set(this.ptr + index , value)
    this.length++; // increase length of data
  }

  remove(index) {
    if(index < 0 || index >= this.length) {
      throw new Error("Index Error")
    }
    memory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1)

    this.length--;
  }
}




function main() {
  Array.SIZE_RATIO = 3; 
  let arr =  new Array()
  arr.push(3)
  // console.log(arr)
  // length is length of data, the capacity is how much room in memory
  // 1. length: 1, capacity: 3, ptr: 0
  arr.push(5);
  arr.push(15);
  arr.push(19);
  arr.push(45);
  arr.push(10);
  // console.log(arr)
  // 2. length = 6, capacity = 12, ptr = 3


  arr.pop()
  arr.pop()
  arr.pop()
  // console.log(arr)
  // 3. length = 3 capacity = 12, ptr = 3. 


  // 4. Gets first item in array
  // console.log(arr.get(0))

  // 5. Empty array and add "tauhida"
  arr.pop()
  arr.pop()
  arr.pop()

  // console.log(arr)

  arr.push("tauhida")
  console.log(arr)
  // 5. Length = 1. Capacity = 12. ptr = 3 *** 
  // the length is of the data, which is currently only 1. 
  // The capacity has not been readjusted as after resize as there is no reason to resize.
    // the index exists and it is within bounds. 
  // As for the ptr, it retains the oldPtr position
}

// main();

// 6. Urlify 

function urlify(string) {
  // trim beginning and end 
  let url = string.trim().replace(/\s/g, '%20');
 console.log(url)
}

// urlify("tauhida parveen");
// urlify("www.thinkful.com /tauh ida parv een");

// 7. divide and conquer 
function removeBelowNum(arr, num) {
  let sorted = arr.sort((a,b) => {return a-b})
  let result; 
  if(!arr.length || arr[0] > num) {
    return `No number below ${num}`
  }

  let lowIndex = 0;
  let highIndex = arr.length; 

  while(lowIndex < highIndex) {
    let midIndex = Math.floor((lowIndex + highIndex)) / 2
    if(arr[midIndex] >= num) {
      highIndex = midIndex
    } else if(arr[midIndex] < num) {
      lowIndex = midIndex
    } else {
      return {
        result: arr.slice(0, midIndex)
      }
    }
  }
}

// console.log(removeBelowNum([3, 17, 46, 5, 1, 66, 23, 4], 5))

// 8. 

// function maxSum(arr){
//   let maxSum = 0;
//   let sum=0;
//   for(let i=0; i<arr.length;i++){
//     sum = 0;  
//     sum = arr[i];
//     for(let j=i+1; j<arr.length;j++){
//       sum += arr[j];
//       if(sum>maxSum){
//         maxSum = sum;
//       }
//     }
//   }
//   return maxSum;
// }

// const answer = maxSum([4,6,-3,5,-2,1]);

const ints = [4, 6, -3, 5, -2, 1];

// we basically sum up WINDOWS in the array. Start from 0 --> end 
// then we do 0 --> end - 1
// 0 - end - 2...
// when finished, we do 1 --> end 
// 1 --> end - 1 (decrementing)
// 1 --> end - 2
// saves a max sum and compares 
const findSubArrayWithLargestSum = arr => {
  let largest = { sub: [], sum: 0 };
  arr.forEach((int, index) => {
    let lastIndex = arr.length;
    for (let i = index; i < lastIndex; lastIndex--) {
      // from i to last index, slice
      let sub = arr.slice(i, lastIndex);
      let sum = sub.reduce((a, b) => a + b, 0); // 0 is current value 
      if (sum > largest.sum) { largest = { sub, sum } }
    }
  });
  return largest;
}

// console.log(findSubArrayWithLargestSum(ints));

// 8. Merge Arrays 
function mergeArrays(arr1, arr2) {
  let mergedArray = [...arr1, ...arr2].sort((a,b) => {
    console.log("a: ", a, "b :", b)
    return a-b
    })
  console.log(mergedArray)
}

// mergeArrays([1,2,3], [1,2,5]);


// 9. Remove characters
// Write an algorithm that deletes given characters from a string. For example, given a string of "Battle of the Vowels: Hawaii vs. Grozny" and the characters to be removed are "aeiou", the algorithm should transform the original string to "Bttl f th Vwls: Hw vs. Grzny". Do not use Javascript's filter, split, or join methods.

// Input:'Battle of the Vowels: Hawaii vs. Grozny', 'aeiou'
// Output: 'Bttl f th Vwls: Hw vs. Grzny'

// Remove all listed letters while maintaining spaces. 
// save vowel to a variable before replacing vowel with "" 
// Upon reaching a letter we want to delete, we replace it with "" 
// If we happen upon a space, we add that space into the list
// we then return the variable that has stored our remaining string

// str.substring(indexStart[, indexEnd]) start is included. End is omitted
function removeLetters(string, exp) {
  let letters = "[" + exp + "]"
  let re = RegExp(letters, "ig")
  return string.replace(re, "")

}

// console.log(removeLetters('Battle of the Vowels: Hawaii vs. Grozny', "aeiou"))

// 10. Products

// Given an array of numbers, write an algorithm to find out the products of every other number except the number at each index.

// Input:[1, 3, 9, 4]
// Output:[108, 36, 12, 27]

// what does this mean? basically, if on int 1 of [1,2,3,4] = 2 * 3 * 4
// Going through list: 
  // when on a number, make it = 1 and then multiple all the following numbers with it. 
function productOfArrayExceptSelf(array) {
  // make array. This is also to keep track of index. We need this index to match up with the current index
    // in reduce(). The 3rd arg in reduce is current Index. Compare the two, and if they match, turn to 1. 
    // if not, turn to value.  
  // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
  return array.map(function(_, i) {
    return array.reduce(function(product, val, j) {
      return product * (i === j ? 1 : val);
    }, 1);
  });
}

let array = [1, 2, 3, 4];
// console.log(productOfArrayExceptSelf(array));


// 11. Set Zeroes 
let m =
  [[1, 0, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1]]
// setZeroes(m);
// console.log(m);

let setZeroesAlt = function(matrix) {
  let rLen = matrix.length,
    cLen,
    i,
    j,
    firstRowZero,
    firstColumnZero;

  if (rLen === 0) {
    return;
  }
  // col length. Maze is even? 
  // rLen is row length
  cLen = matrix[0].length;
  // if first value is 0, set first row and column to zero. 
  // matrix[col][row]
  // think of it like along the column or row. A row is actually a column and a column is actually
  // a row because we're dealing with array
  if (matrix[0][0] === 0) {
    firstRowZero = true;
    firstColumnZero = true;
  } else {
    // if not, begin going along the first row. Sets true/false value
    for (i = 1; i < cLen; i++) {
      if (matrix[0][i] === 0) {
        firstRowZero = true;
        break;
      }
    }
    // if items along the column have a zero. Sets true/false value 
    for (i = 1; i < rLen; i++) {
      if (matrix[i][0] === 0) {
        firstColumnZero = true;
        break;
      }
    }
  }
  // sets a ptr 
  for (i = 1; i < rLen; i++) {
    for (j = 1; j < cLen; j++) {
      if (matrix[i][j] === 0) {
        matrix[0][j] = 0; // sets first row values to zero
        matrix[i][0] = 0; // sets first col values to zero
      }
    }
  }

  for (i = 1; i < cLen; i++) {
    if (matrix[0][i] === 0) {
      for (j = 1; j < rLen; j++) {
        matrix[j][i] = 0;
      }
    }
  }

  for (i = 1; i < rLen; i++) {
    if (matrix[i][0] === 0) {
      for (j = 1; j < cLen; j++) {
        matrix[i][j] = 0;
      }
    }
  }

  // these sort of go back and checks

  if (firstRowZero) {
    for (i = 0; i < cLen; i++) {
      matrix[0][i] = 0;
    }
  }

  if (firstColumnZero) {
    for (j = 0; j < rLen; j++) {
      matrix[j][0] = 0;
    }
  }
  return matrix
};

///////
var setZeroes = function (matrix) {
    let original = JSON.parse(JSON.stringify(matrix)),
      columns = [];
    
    for (let i = 0; i < original.length; i++) {
        for (let j = 0; j < original[i].length; j++) {
            if (original[i][j] === 0) {
                columns.push(j);
                matrix[i].fill(0);
            }
        }
    }

    columns.forEach(elem => {
        for (let k = 0; k < matrix.length; k++) {
            for (let l = 0; l < matrix[k].length; l++) {
                if (l === elem) {
                    matrix[k][l] = 0;
                }
            }
        }
    });

};

setZeroes(m)

console.log(m)

// 12. String rotation
// Given 2 strings, str1 and str2, write a program that checks if str2 is a rotation of str1.

// Input: amazon, azonma

// Output: False

// Input: amazon, azonam

// Output: true

const isSubstring = (s1, s2) => {
  if (!s1 || !s2) {
    return false;
  }
  if (s1.length !== s2.length) {
    return false;
  }

  return (s1 + s1).includes(s2);
}

var a = 'john';
var b = 'hnjo';
var c = 'jhno';
// console.log(isSubstring(a,b)); // placing two strings next to each checks all substrings and rotations johnjohn
// console.log(isSubstring(a,c));