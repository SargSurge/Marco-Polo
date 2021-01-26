import React, { Component } from 'react';
import { socket } from '../../client-socket';
import { drawCanvas } from '../../canvasManager';
import $ from 'jquery';

export class GameCanvas extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.processUpdate(this.props.update);
    }

    componentDidUpdate() {
        console.log(this.props.update)
        this.processUpdate(this.props.update);
    }

    processUpdate = (update) => {
       // drawCanvas(update);
    }

    // playerData = [{x: 0, y: 0}], a position object for each player on the map   
    // drawPlayers = (playerData) => {
    //     const canvas = this.canvasRef.current;
    //     const ctx = canvas.getContext('2d');
    //     for (let i; i < playerData.length; i++) {
    //         let circle = new Path2D();
    //         circle.arc(playerData[i].x, playerData[i].y, 25, 0, 2 * Math.PI);
    //         ctx.fillStyle = '#000000'
    //         ctx.fill(circle);
    //     }
    // }

    render() {
        return (
            <div>
                <canvas id="game-canvas" width="800px" height="800px" />
                <canvas id="fog-canvas" width="60px" height="60px" />
            </div>
        )
    }
}

export default GameCanvas
