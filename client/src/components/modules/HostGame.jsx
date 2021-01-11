import React, { Component } from 'react'
import Slider from '@material-ui/core/Slider';

// marks for material-ui slider
// currently disabled, can enable in props of slider
// marks = {marks}
const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 10,
        label: '10',
    },
];

export class HostGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            capacity: 3,
            public: false,
        }
    }

    inputName = (event) => {
        this.setState({name: event.target.value});
    }

    changeCapacity = (event, value) => {
        this.setState({capacity: value})
    }

    togglePrivacy = () => {
        this.setState({public: !this.state.public}, () => console.log(this.state.public))
    }

    handleSubmit = (event) => {

    }

    render() {
        return (
            <div>
                <h5 style ={{color: "white"}}>Host Game</h5>    
                <form onSubmit={this.handleSubmit}>          
                    <input type="text" value={this.state.name} placeholder="Game Name" onChange={this.inputName} />
                    <h5 style={{color: 'white'}} >Public?</h5>
                    <input type="checkbox" onChange={this.togglePrivacy} />
                </form>
                <h5 style ={{color: "white"}}>Capacity</h5>    
                <Slider 
                    defaultValue={3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={3}
                    max={10}
                    onChange={this.changeCapacity}
                />
            </div>
        )
    }
}

export default HostGame
