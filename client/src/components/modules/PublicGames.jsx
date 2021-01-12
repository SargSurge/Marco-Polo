import React, { Component } from 'react'
import JoinGameButton from './JoinGameButton'

export class PublicGames extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: null,
        }
    }

    changeGameId = (value) => {
        this.setState({
            gameId: value,
        })
    }

    render() {
        return (
            <>
                <div>
                    <h5 style ={{color: "white"}}>Public Games</h5>
                </div>
                <div>
                    {/* Lobby List */}
                    <JoinGameButton gameId={this.state.gameId} />
                </div>

            </>
        )
    }
}

export default PublicGames
