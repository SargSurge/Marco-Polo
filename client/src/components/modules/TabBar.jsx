import React, { Component } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

export class TabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
        };
    };

    toggle = (tab) => {
        if(this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            <h1 style ={{color: "white"}}>Public</h1>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            <h1 style ={{color: "white"}}>Private</h1>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            <h1 style ={{color: "white"}}>Host</h1>
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab = {this.state.activeTab}>
                    <TabPane id="1">
                        <h5 style ={{color: "white"}}>Public Games</h5>
                    </TabPane>
                    <TabPane id="2">
                        <h5 style ={{color: "white"}}>Private Games</h5>
                    </TabPane>
                    <TabPane id="3">
                        <h5 style ={{color: "white"}}>Host Game</h5>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}

export default TabBar
