import React, { Component } from 'react'
import {Jumbotron, Container, Alert } from 'react-bootstrap';

export class notauthorize extends Component {

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
          window.location= ('/home')
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

  renderCarousel(){
    return(   
      <div>
        <Jumbotron fluid style={style}>
  <Container>
    <h1>Oops!</h1>
    <Alert variant="danger">
  <Alert.Heading>401 Unauthorized</Alert.Heading>
  <p>
        Sorry, you have no permission to see this page
        <br></br>
        Redirect to homepage in {this.state.count}
    </p>
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



export default notauthorize
