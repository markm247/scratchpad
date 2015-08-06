"use strict";

var CONST_CLICKMESSAGE = "clickMessage";
var Dispatcher = require('react-dispatcher');
var AppDispatcher = new Dispatcher();
var messageStore = {
  messages: [
    {messageID: 0, subject: 'woot', body: 'woo woo!'},
    {messageID: 1, subject: 'boot', body: 'boo boo!'}
  ],
  currentMessageID: 0,
  getMessages: function() {return this.messages;},
  getCurrentMessageID: function() {return this.currentMessageID; },
  setCurrentMessageID: function(messageID) { this.currentMessageID = messageID; console.log("new ID = " + this.currentMessageID); },
  getCurrentMessageBody: function() { console.log(this.currentMessageID); return this.messages[this.currentMessageID].body; }
};

var eventEmitter = {
  events: [],
  registerEvent: function(eventName, callback) {
    this.events.push({"eventName": eventName, "callback": callback});
  },
  emit: function(eventName) {
    for(var n in this.events) {
      if(this.events[n].eventName == eventName) {
        this.events[n].callback();
      }
    }
  }
};

eventEmitter.emit('woot');

AppDispatcher.register(function(payload) {
  switch (payload.eventName) {
    case CONST_CLICKMESSAGE:
      console.log(payload.currentMessage);
      messageStore.setCurrentMessageID(payload.currentMessage);
      eventEmitter.emit("currentMessageChanged");
      break;
    default:

  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: messageStore.getMessages(), currentMessageID: messageStore.getCurrentMessageID(), currentMessageBody: messageStore.getCurrentMessageBody() };
    this._onChange = this._onChange.bind(this);
  }
  _onChange() {
    this.setState({messages: messageStore.getMessages(), currentMessageID: messageStore.getCurrentMessageID(), currentMessageBody: messageStore.getCurrentMessageBody() });
  }
  componentDidMount() {
    eventEmitter.registerEvent('currentMessageChanged', this._onChange);
  }
  render() {
    return  <div id='app'>
              <MessageList messages={this.state.messages} currentMessageID={this.state.currentMessageID} />
              <MessagePane messages={this.state.messages} currentMessageBody={this.state.currentMessageBody} />
            </div>;
  }
}

class MessagePane extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return  <div id='messagePane'>
              <Message currentMessageBody={this.props.currentMessageBody} />
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
    return <div id='message'>{this.props.currentMessageBody}</div>;
  }
}

class MessageComments extends React.Component {
  render() {
    return <div id='commentList'>Comments here</div>;
  }
}

React.render(<App />, document.getElementById('app'));
