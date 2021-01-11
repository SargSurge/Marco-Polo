import React, { Component } from 'react'

export class HostGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
        }
    }

    inputName = (event) => {
        this.setState({name: event.target.value});
    }

    handleSubmit = (event) => {

    }

    render() {
        return (
            <div>
                <h5 style ={{color: "white"}}>Host Game</h5>    
                <form onSubmit={this.handleSubmit}>          
                    <input type="text" value={this.state.name} placeholder="Game Name" onChange={this.inputName} />
                </form>
            </div>
        )
    }
}

export default HostGame
