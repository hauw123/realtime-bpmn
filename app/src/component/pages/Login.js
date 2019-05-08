import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Button } from 'react-bootstrap';

export class Login extends Component {

    state = {
        email: '',
        password: '',
        warning: ''
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });

    handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('apiuser/loginuser', {
            email: this.state.email,
            password: this.state.password
        }
        ).then(res => {
            if (res.status === 200) {
                localStorage.setItem('id', res.data.user_id);
                localStorage.setItem('email', res.data.user_email);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('name', res.data.user_name);
                window.location="/";
                console.log(res.data.token);
            } else {
                const error = new Error(res.error);
                throw error;
            }
        }
        ).catch(err => { console.log(err); this.setState({warning:'Login gagal. Cek email atau password kembali'}) })
    }
    

    renderLoginForm(){
        return(
            <Container style={backgroundstyle}>

                <Row className="justify-content-md-center">
                
                    <Col md="auto">
                    <h1>Login</h1>
                        <Form onSubmit={this.handleSubmit}>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control onChange={this.onChange} name="email" type="email" placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
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
                                Don't have account? <Link style={linkStyle} to="/register">Sign Up</Link>
                            </Form.Text>
                            
                        </Form>
                    </Col>

                </Row>

            </Container>
        )
    }

    render() {
        return (
            this.renderLoginForm()
        );
    }

}

const backgroundstyle = {
    backgroundImage: 'url(../../img/wallpapertech.png)',
    paddingTop: '10%',
    height: '92vh',
    width: '100%',
    position:'relative',
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

export default Login
