import React, { Component } from 'react'
import { Button, Jumbotron, Container, Card, CardDeck, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export class home extends Component {

  renderCarousel(){
    return(   
      <div>
        <Jumbotron fluid style={style}>
  <Container>
    <h1>Express BPMN</h1>
    <p>
      Website yang digunakan sebagai alat pembuatan diagram BPMN
    </p>
    <Button as={Link} to="/bpmndemo" size="lg" variant="secondary">Demo</Button>
  </Container>
</Jumbotron>

<CardDeck style={iconstyle}>

  <Card>
  <Image style={imgStyle} src="../img/info1.png"  />
    <Card.Body>
      <Card.Title>Collaboration</Card.Title>
      <Card.Text>
        Fitur real-time dalam pembuatan diagram BPMN yang dapat dilakukan oleh beberapa user
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      
    </Card.Footer>
  </Card>

  <Card>
  <Image style={imgStyle} src="../img/info2.png"  />
    <Card.Body>
      <Card.Title>Communication</Card.Title>
      <Card.Text>
        Fitur komunikasi untuk menghindari terjadinya <i>misscommunication</i> antar user
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      
    </Card.Footer>
  </Card>

  <Card>
  <Image style={imgStyle} src="../img/info3.png" />
    <Card.Body>
      <Card.Title style={iconstyle}>Efficiency</Card.Title>
      <Card.Text>
        Collaboration + Communication akan memberikan efisiensi dalam pengerjaan diagram BPMN baik dari diagram sederhana maupun kompleks
      </Card.Text>
    </Card.Body>
    <Card.Footer>
    </Card.Footer>
  </Card>

  
</CardDeck>
      </div>


     )


  }
  render() {
    return (
      this.renderCarousel()
    )
  }
}

const iconstyle ={
  width:'95%',
  margin:'auto'
}
const style ={
  backgroundImage: 'url(../../img/wallpapertech.png)',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '50vh',
  textAlign: 'center'
}

const imgStyle ={
  width:"200px",
  height:"200px",
  margin:'auto',
  paddingTop:"5%"
}



export default home
