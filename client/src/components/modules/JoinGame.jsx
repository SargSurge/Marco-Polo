import React, { Component } from 'react'

export class JoinGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: null,
        }
    }

    inputGameId = (event) => {
        this.setState({gameId: event.target.value})
    }

    handleSubmit = (event) => {
        
    }

    render() {
        return (
            <div>
                <h5 style ={{color: "white"}}>Join Game</h5>    
                <form onSubmit={this.handleSubmit}>          
                    <input type="text" value={this.state.gameId} placeholder="#1234"/>
                </form>
            </div>
        )
    }
}

export default JoinGame
