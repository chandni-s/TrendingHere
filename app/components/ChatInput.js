//example from https://github.com/kentandlime/react-instant-chat/blob/master/src/components/ChatInput.js
import React from 'react';

class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { chatInput: '' };

        // React ES6 does not bind 'this' to event handlers by default
        this.submitHandler = this.submitHandler.bind(this);
        this.textChangeHandler = this.textChangeHandler.bind(this);
    }

    submitHandler(event) {
        // Stop the form from refreshing the page on submit
        event.preventDefault();

        // Clear the input box
        this.setState({ chatInput: '' });

        // Call the onSend callback with the chatInput message
        this.props.onSend(this.state.chatInput);
    }

    textChangeHandler(event)  {
        this.setState({ chatInput: event.target.value });
        this.props.onTextChange("someone is typing");
    }

    render() {
        return (
            <div className="card-panel input-field">
                <div className="message-input-container">
                    <input id="message-input" type="text" placeholder="Enter message here..."/>
                    <button id="message-submit" onClick={this.submitHandler} className="btn waves-effect waves-light red lighten-2">
                        <i className="material-icons">send</i>
                    </button>
                </div>
            </div>
        );
    }
}

ChatInput.defaultProps = {
};

export default ChatInput;