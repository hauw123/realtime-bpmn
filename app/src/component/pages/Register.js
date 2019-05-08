import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

export class Register extends Component {
    state = {
        email: '',
        name: '',
        password: '',
        warning:''
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });

    handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('apiuser/registeruser', {
            email: this.state.email,
            name: this.state.name,
            password: this.state.password
        }).then(res =>{            
            if(res.data.register === false){
                console.log("cant register")
                this.setState({warning:'Email telah digunakan...'})
            }
            else{
                this.props.history.push('/login')}
            }
        )
            .catch(err => console.log(err))
    }



    renderRegisterForm() {
        return (
            <Container style={backgroundstyle}>

                <Row className="justify-content-md-center">

                    <Col md="auto">
                        <h1>Register</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control onChange={this.onChange} name="email" type="email" placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                            </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control onChange={this.onChange} name="name" type="text" placeholder="Enter name" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control onChange={this.onChange} name="password" type="password" placeholder="Password" />
                            </Form.Group>
                            <Form.Group controlId="formBasicWarning">
                            <Form.Text style={warning}>
                                    {this.state.warning}
                            </Form.Text>
                            </Form.Group>


                            <Button variant="outline-secondary" type="submit" block>
                                Submit
                        </Button>
                            <Form.Text className="text-muted">
                                Don't have account? <Link style={linkStyle} to="/login">Sign In</Link>
                            </Form.Text>

                        </Form>
                    </Col>

                </Row>

            </Container>
        )
    }

    render() {
        return (
            this.renderRegisterForm()
        )
    }

}

const backgroundstyle = {
    backgroundImage: 'url(../../img/wallpapertech.png)',
    paddingTop: '10%',
    height: '92vh',
    width: '100%',
    position: 'relative',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'

}

const linkStyle = {
    textAlign: 'center',
    paddingBottom: '20%'
}

const warning = {
    color:'red'
}

export default Register
