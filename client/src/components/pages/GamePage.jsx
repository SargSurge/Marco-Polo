import React, { Component } from 'react'
import { move } from '../../client-socket';
import { post } from '../../utilities';
import GameCanvas from '../modules/GameCanvas';

export class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movement: {
                up: false,
                down: false,
                left: false,
                right: false,
            },
            position: {
                x: 0,
                y: 0,
                color: 'white',
            }

        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleInput);
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
        post('/move', {dir: dir, user: this.props.user, gameId: this.props.gameId});
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
            <div>
                <h3>W: {`${this.state.movement.up}`}</h3>
                <h3>A: {`${this.state.movement.left}`}</h3>
                <h3>S: {`${this.state.movement.down}`}</h3>
                <h3>D: {`${this.state.movement.right}`}</h3>
                <h3>Position: x: {`${this.state.position.x}`} / y: {`${this.state.position.y}`}</h3>
            </div>
            <div>
                <GameCanvas update={{players: [this.state.position]}} />
            </div>
            </>
        )
    }
}

export default GamePage
