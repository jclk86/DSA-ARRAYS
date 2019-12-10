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

copy(fromIndex, toIndex, size) {
  // check for a useless request here. 
  if(fromIndex === toIndex) return;

  if(fromIndex > toIndex) {
    // iterate forward 
    for(let i = 0; i < size; i++) {
      this.set(toIndex + i, this.get(fromIndex + i))
    }
  } else {
    // iterate backward 
    for(let i = size - 1; i >= 0; i--) {
      this.set(toIndex + i, this.get(fromIndex + i))
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

