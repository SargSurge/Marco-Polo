import React, { Component } from 'react'

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
            }

        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown = (event) => {
        switch (event.code) {
            case 'KeyA': // A
                this.setState({movement: {...this.state.movement, left: true}});
                break;
            case 'KeyW': // W
                this.setState({movement: {...this.state.movement, up: true}});
                break;
            case 'KeyD': // D
                this.setState({movement: {...this.state.movement, right: true}});
                break;
            case 'KeyS': // S
                this.setState({movement: {...this.state.movement, down: true}});
                break;
        }
        this.updatePosition();
    }

    handleKeyUp = (event) => {
        switch (event.code) {
            case 'KeyA': // A
                this.setState({movement: {...this.state.movement, left: false}});
                break;
            case 'KeyW': // W
                this.setState({movement: {...this.state.movement, up: false}});
                break;
            case 'KeyD': // D
                this.setState({movement: {...this.state.movement, right: false}});
                break;
            case 'KeyS': // S
                this.setState({movement: {...this.state.movement, down: false}});
                break;
        }
        this.updatePosition();
    }

    updatePosition() {
        let positionUpdate = {x: 0, y: 0};
        const SPEED = 1;
        const dirMap = {
            up: ['y',1],
            down: ['y',-1],
            right: ['x',1],
            left: ['x',-1],
        }
        Object.keys(this.state.movement).map((dir, index) => {
            if (this.state.movement[dir]) {
                positionUpdate[dirMap[dir][0]] += dirMap[dir][1];
            }
        })
        this.setState({
            position: {
                x: this.state.position.x += positionUpdate.x,
                y: this.state.position.y += positionUpdate.y,
            }
        })
    }

    render() {
        return (
            <div>
                <h3>W: {`${this.state.movement.up}`}</h3>
                <h3>A: {`${this.state.movement.left}`}</h3>
                <h3>S: {`${this.state.movement.down}`}</h3>
                <h3>D: {`${this.state.movement.right}`}</h3>
                <h3>Position: x: {`${this.state.position.x}`} / y: {`${this.state.position.y}`}</h3>
            </div>
        )
    }
}

export default GamePage
