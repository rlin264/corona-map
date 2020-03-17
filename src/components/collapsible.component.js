import React from 'react';

export default class Collapsible extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
        this.togglePanel = this.togglePanel.bind(this);
    }
    togglePanel(e) {
        this.setState({ open: !this.state.open })
    }
    render() {
        return (
            <div>
                <div onClick={(e) => this.togglePanel(e)} className='header'>
                {this.props.title}</div>
            {
                this.state.open ? (
                    <div>
                        {this.props.children}
                    </div>
                ) : null
            }
            </div >
        );
    }
}