import React, { Component } from 'react';
import {InputGroup,Form,Button} from 'react-bootstrap';
import Moment from 'moment';

export class chatroomdemo extends Component {

    constructor() {
        
        super();
  
        this.messagearray = [];
  
        this.state = {
          showdata : this.messagearray,
          message:'',
          count:0
        }
      };

    componentWillMount(){

    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });

    onClickSend = () => {
        var _this = this;


        this.messagearray.push(
        <li key={Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} style={stylemessage} className="right clearfix">
        <div className="chat-body clearfix"><div>
        <strong className="pull-left primary-font">User</strong><p style={textStyle}>{Moment(new Date(Date.now())).format("hh:mm:ss")}</p>
        <br></br>
        </div><p>{this.state.message}</p></div></li>)
        
        this.setState({
            showdata : this.messagearray,
         });

        _this.setState({message:''})
    }
 
    onClickClear = () => {
        var _this = this;
        _this.setState({message: ''})

    }

    formSubmit = (e) => {
        e.preventDefault();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
      
      componentDidMount() {
        this.scrollToBottom();
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }

    render() {
        return (
            <div style={containerStyle}>
                <h1 style={title}>Chat room</h1>
                <div style={messageForm}>
                
                    <ul id="chatbodymessage" style={chatcontainer}>
                    {this.messagearray}
                    </ul>
                    <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
                </div>

                <div style ={inputForm}>
                <Form onSubmit={this.formSubmit}>
                <InputGroup>
                    <Form.Control autoComplete="off" value={this.state.message} onChange={this.onChange} name="message" type="text" placeholder="Enter Message..." />
                        <InputGroup.Append>
                            <Button type="submit" onClick={this.onClickSend} variant="outline-secondary">Send</Button>
                            <Button onClick={this.onClickClear} variant="outline-secondary">Clear</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                </div>

                
            </div>
        )
    }
}
const containerStyle = {
    width: "100%",
    // backgroundColor: "black",
    height: "93vh",
    padding: "5%",
    position: "relative",
    borderStyle:"inset"
}

const messageForm = {
    height: "70vh",
    overflowY:"scroll"
}

const inputForm = {
    bottom:"0",
    height:"7%",
    width:"90%",
    // marginLeft:"5%",
    position:"absolute"
}

const title = {
    textAlign: "center",
    borderBottom:"1px dotted #B3A9A9"
}

const chatcontainer ={
    listStyle:"none",
    margin: "0",
    padding: "0"
}

const stylemessage ={
    marginBottom:"10px",

    borderBottom: "1px dotted #B3A9A9"
}

const textStyle ={
    float:"right",
    marginRight:"5%",
    display: 'inline'
}
export default chatroomdemo
