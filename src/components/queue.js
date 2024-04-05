class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(element) {
      this.items.push(element);
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return "Underflow"; 
      }
      return this.items.shift(); 
    }
  
    peek() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items[0];
    }
  
   
    isEmpty() {
      return this.items.length === 0;
    }
  

    size() {
      return this.items.length;
    }
  

    printQueue() {
      let str = "Front -> ";
      for (let i = 0; i < this.items.length; i++) {
        str += this.items[i] + " ";
      }
      str += "<- Rear";
      console.log(str);
    }

    getQueue(){
        return this.items
    }
  }

export {Queue}
