"use strict";
var CONST_CLICKMESSAGE = "clickMessage"
var Dispatcher = require('react-dispatcher');
var AppDispatcher = new Dispatcher();
var messageStore = {
  messages: [
    {messageID: 0, subject: 'woot', body: 'woo woo!'},
    {messageID: 1, subject: 'boot', body: 'boo boo!'}
  ],
  currentMessage: 0,
  getMessages: function() {return this.messages;},
  getCurrentMessage: function() {return this.currentMessage; }
};

var eventEmitter = {
  events: [],
  registerEvent: function(eventName, callback) {
    this.events.push({"eventName": eventName, "callback": callback});
  },
  emit: function(eventName) {
    for(var n in this.events) { console.log(this.events[n]); }
  }
}

eventEmitter.registerEvent('woot', 'woot');
eventEmitter.emit();

AppDispatcher.register(function(payload) {
  switch (payload.eventName) {
    case CONST_CLICKMESSAGE:
      messageStore.currentMessage = payload.currentMessage;
      break;
    default:

  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: messageStore.getMessages(), currentMessage: messageStore.getCurrentMessage() };
    console.log(this.state);
  }
  render() {
    return  <div id='app'>
              <MessageList messages={this.state.messages} currentMessage={this.state.currentMessage} />
              <MessagePane messages={this.state.messages} currentMessage={this.state.currentMessage} />
            </div>;
  }
}

class MessagePane extends React.Component {
  render() {
    return  <div id='messagePane'>
              <Message />
              <MessageComments />
            </div>;
  }
}

class MessageList extends React.Component {
  render() {
    return  <div id='messageList'>
              {this.props.messages.map(function(m){ return <MessageListItem subject={m.subject} messageID={m.messageID} />;})}
            </div>;
  }
}

class MessageListItem extends React.Component {
  clickMessage() {
    AppDispatcher.dispatch({"eventName": CONST_CLICKMESSAGE, "currentMessage": this.props.messageID})
  }
  render() {
    return <div onClick={this.clickMessage.bind(this)}>{this.props.subject}</div>;
  }
}

class Message extends React.Component {
  render() {
    return <div id='message'>Message</div>;
  }
}

class MessageComments extends React.Component {
  render() {
    return <div id='commentList'>Comments here</div>;
  }
}

React.render(<App />, document.getElementById('app'));
