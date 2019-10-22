import React, { Component } from 'react'
import {Jumbotron, Container, Alert, Button } from 'react-bootstrap';

export class notconnect extends Component {

    constructor(props){
        super(props);
        this.state = {
            count: 5
        }
      }
      timer() {
        this.setState({
          count: this.state.count - 1
        })
        if(this.state.count < 1) { 
          //window.location= ('/home')
          clearInterval(this.intervalId);
        }
      }
      
      componentDidMount() 
      {
        this.intervalId = setInterval(this.timer.bind(this), 1000);
      }

      componentWillUnmount()
      {
        clearInterval(this.intervalId);
      }

      projectclick = () => {
          this.props.history.push('/');
      }

  renderCarousel(){
    return(   
      <div>
        <Jumbotron fluid style={style}>
  <Container>
    <h1>No Internet</h1>
    <Alert variant="light">
  <p>
        <h2>Try :</h2>

        Reconnecting to Wi-Fi<br></br>
        Checking the network cables, modem and router<br></br>
        Running Windows Network Diagnostics<br></br>
        <br></br>
        <h3>ERR_INTERNET_DISCONNECTED</h3>
    </p>
        <Button onClick={this.projectclick} variant="outline-primary">Back to Homepage</Button>
</Alert>

  </Container>
</Jumbotron>
      </div>


     )


  }
  render() {
    return (
      this.renderCarousel()
    )
  }
}

const style ={
  backgroundImage: 'url(../../img/wallpapertech.png)',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '50vh',
  textAlign: 'center'
}



export default notconnect
