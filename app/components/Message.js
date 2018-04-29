//example from https://github.com/kentandlime/react-instant-chat/blob/master/src/components/
import React from 'react';

class Message extends React.Component {
    render() {
        // Was the message sent by the current user. If so, add a css class
        const fromMe = this.props.fromMe ? 'from-me' : 'userChatMsg';

        return (
            <div className="card-panel small message-bubble self">
                <span>{this.props.username}: </span>{this.props.message}
            </div>
        );
    }
}

Message.defaultProps = {
    message: '',
    username: '',
    fromMe: false
};

export default Message;