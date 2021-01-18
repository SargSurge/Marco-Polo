import React, { Component } from 'react'
import { socket} from '../../client-socket';
import { get, post } from '../../utilities';
import GameCanvas from '../modules/GameCanvas';
import { drawCanvas } from '../../canvasManager';


export class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
        }
    }

    componentDidMount() {
        get('/api/whoami', {}).then((user) => {
            this.setState({user: user});
        })

        window.addEventListener('keydown', this.handleInput);
        socket.on("update", (gameState) => {
            this.processUpdate(gameState);
        })
    }
    
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleInput);
        socket.off("update");
    }

    handleInput = (event) => {
        switch (event.code) {
            case 'KeyA': // A
                this.move("left");
                break;
            case 'KeyW': // W
                this.move("up");
                break;
            case 'KeyD': // D
                this.move("right");
                break;
            case 'KeyS': // S
                this.move("down");
                break;
        }
    }

    move = (dir) => {
        //render movement for me
        post('/api/move', {dir: dir, userId: this.state.user._id, gameId: this.props.gameId}).then(() => {});
    }

    processUpdate = (gameState) => {
        drawCanvas(gameState);
    }

    // updatePosition() {
    //     let positionUpdate = {x: 0, y: 0};
    //     const SPEED = 20;
    //     const dirMap = {
    //         up: ['y',1],
    //         down: ['y',-1],
    //         right: ['x',1],
    //         left: ['x',-1],
    //     }
    //     Object.keys(this.state.movement).map((dir, index) => {
    //         if (this.state.movement[dir]) {
    //             positionUpdate[dirMap[dir][0]] += SPEED * dirMap[dir][1];
    //         }
    //     })
    //     this.setState({
    //         position: {
    //             ...this.state.position,
    //             x: this.state.position.x += positionUpdate.x,
    //             y: this.state.position.y += positionUpdate.y,
    //         }
    //     })
    // }

    render() {
        return (
            <>
            {/* <div>
                <h3>W: {`${this.state.movement.up}`}</h3>
                <h3>A: {`${this.state.movement.left}`}</h3>
                <h3>S: {`${this.state.movement.down}`}</h3>
                <h3>D: {`${this.state.movement.right}`}</h3>
                <h3>Position: x: {`${this.state.position.x}`} / y: {`${this.state.position.y}`}</h3>
            </div> */}
            <div>
                <canvas id="game-canvas" width="800px" height="800px" />
            </div>
            </>
        )
    }
}

export default GamePage
