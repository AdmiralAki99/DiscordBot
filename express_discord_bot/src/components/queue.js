import { atRule } from "postcss";

class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(element) {
      this.items.push(element);
    }

    insertAtIndex(element, index){
        this.items.splice(index, 0, element)
    }

    removeAtIndex(index){
        this.items.splice(index, 1)
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

    getQueueAPI(){
      let queue = []
      this.items.forEach((item,index)=>{
          queue.push({index:index, title:item.title, artist: item.artist,url:item.url,thumbnail:item.thumbnail,requester:item.requester})
      })
        return queue
    }

    clearQueue(){
        this.items = []
    }
  }

export {Queue}
