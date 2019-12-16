// features of Array
// inefficient insertion & deletion
// has random access
// more memory waste, cause it has to create more than necessary storage space to store more data
// sometimes
// contiguous and faster sequential access. Everything is next to each other, unlike linked lists

class Array {
  constructor() {
    this.length = 0;
    this._capacity = 0;
    this.ptr = Memory.allocate(this.length);
  }

  push(value) {
    // is the length more than or equal to the capacity?
    if (this.length >= this._capacity) {
      // resize it
      this.resize((this.length + 1) * Array.SIZE_RATIO);
    }
    // arg: where & value. You get there where by adding the pointer to the length.
    Memory.set(this.ptr + this.length, value);
    // once added increase the length of the array
    // This doesn't increase the length of the memory, but just adds to length of data. The length is largely
    // a description of the data's length. not the memory length
    this.length++;
  }

  resize(size) {
    // need this so you can clear free up the old chunk of data
    const oldPtr = this.ptr;
    // this gets reassigned and implements news data size
    this.ptr = Memory.allocate(size);
    // Memory.allocate will check if the this.head + size is greater than its total array space. If so,
    // it returns null
    if (this.ptr === "null") {
      throw new Error("Out of Memory!");
    }
    Memory.copy(this.ptr, oldPtr, this.length);
    Memory.free(oldPtr);
  }

  get(index) {
    // can do index > this.length - 1
    if (index < 0 || index >= this.length) {
      throw new Error("Index Error");
    }
    return Memory.get(this.ptr + index);
  }
  // comes off at the pop just like normal array
  pop() {
    // Is there anything to pop?
    if (this.length == 0) {
      throw new Error("Index Error");
    }
    // remember the last item in the array is size of array - 1
    // this.ptr returns the start of the data array.
    const value = Memory.get(this.ptr + this.length - 1);
    // ensure length is shortened to describe data length
    this.length--;
    return value;
  }
  // inserting anywhere shifts everything else over 1 index
  insert(index, value) {
    // Ensuring this index does even exist
    // or you could do index > this.length - 1
    if (index < 0 || index >= this.length) {
      throw new Error("Index Error");
    }
    // Ensure if there is enough room
    if (this.length >= this._capacity) {
      // resize if not enough room
      // add 1 to length, cause inserting 1 item
      this.resize((this.length + 1) * Array.Size_Ratio);
    }
    // copy old data to new data chunk ***  WHY ARE ADDING 1?
    // fromIndex: Because the this.ptr is the head, which is 0, you need to add one to get the correct index.
    // the toIndex how far you want to go
    Memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index); // -index because you are taking that spot away by adding it?
    Memory.set(this.ptr + index, value);
    this.length++; // increase length of data
  }

  remove(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index Error");
    }
    Memory.copy(this.ptr + index, this.ptr + index + 1, this.length);

    this.length--;
  }
}
