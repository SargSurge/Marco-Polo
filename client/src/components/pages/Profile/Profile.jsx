import React, { Component } from 'react'
import { get, post } from '../../../utilities';
import MatchTable from './MatchTable';
import NavBar from '../../modules/NavBar/NavBar'
import './Profile.css'

const matchHistory = [
    {
        name: 'Game1',
        creator: 'sabiyyah',
        win: true,
        gameId: 1,
    },
    {
        name: 'Game2',
        creator: 'sabiyyah',
        win: true,
        gameId: 2,

    },
    {
        name: 'Game3',
        creator: 'sabiyyah',
        win: false,
        gameId: 3,

    },
    {
        name: 'Game4',
        creator: 'sabiyyah',
        win: true,
        gameId: 4,

    },
    {
        name: 'Game5',
        creator: 'sabiyyah',
        win: true,
        gameId: 5,
    },
]

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            avatar: undefined,
            matches: [],
            winLoss: .84,
        }
    }

    componentDidMount() {

        get('/api/matchHistory', {userId: this.props.userId}).then((res) => {
            this.setState({user: res.user, matches: res.matches})
        }).catch((e) => console.log(e))

        this.setState({
            winLoss: this.calculateWinLoss(matchHistory),
        });
    }

    calculateWinLoss = (matches) => {
        const wins = matches.filter((match) => match.win === true);
        return wins.length / matches.length;
    }

    render() {
        return (
            <>
            <div className="profile-base">
                <div className="profile-container">
                    <NavBar logoutButton={this.props.logoutButton}/>
                    <div className="profile-content">
                        <div className="profile-top">
                            <div className="profile-header">
                                {this.state.user ? this.state.user.name : 'Name'}
                            </div>
                            <div className="profile-header">
                                Win / Loss : {this.state.winLoss}
                            </div>
                        </div>
                        <div className="profile-bottom">
                            <div className="profile-table">
                                <MatchTable matches={this.state.matches} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default Profile
