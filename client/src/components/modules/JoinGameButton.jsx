import React, { Component } from 'react'

// Props: gameId

export class JoinGameButton extends Component {
    constructor(props) {
        super(props);
    }

    handleJoin = () => {
        // Join this.props.gameId
    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.handleJoin}>Join Game</button>
            </div>
        )
    }
}

export default JoinGameButton
