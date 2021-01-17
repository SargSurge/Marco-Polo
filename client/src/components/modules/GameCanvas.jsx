import React, { Component } from 'react'

export class GameCanvas extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        
        // Initial Draw
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }

    componentDidUpdate() {
        drawPlayer();
    }

    drawPlayer = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    }

    render() {
        return (
            <div>
                <canvas width="100%" ref={this.canvasRef} />
            </div>
        )
    }
}

export default GameCanvas
