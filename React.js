import React, { Component } from "react";

class React extends Component{
    constructor(props){
        super(props);
        this.count = 0;
    }
    increment(){
        return this.count++;
    }
    descrement(){
        return this.count--;
    }
    render(){
        <>
         <h1>Count: {this.count}</h1>
         <button onClick={this.increment}>Increment</button>
         <button onClick={this.descrement}>Decrement</button>
        </>
    }
}

export default React;