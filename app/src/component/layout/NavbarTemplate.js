import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Nav, Navbar} from 'react-bootstrap'
// import { link } from 'fs';


export class NavbarTemplate extends Component {

    state = {
        loggedIn: 0
    };

    componentWillMount() {


        var config = {
            headers: { 'x-access-token': localStorage.getItem('token') }
        }
        
        //Cek Token dari user apakah valid
        Axios.get('/auth', config)
            .then((response) => {
                this.setState({
                    loggedIn: 1
                })
            })
            .catch(error => {
                if (error.response) {
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                } else if (error.request) {
                    //console.log(error.request);
                } else {
                    //console.log('Error', error.message);
                }
                console.log(error.config);
            })
    }

    logout() {
        localStorage.clear()
        this.setState({
            loggedIn: 0
        })
    }

    renderNavbar() {

        if (this.state.loggedIn === 1) {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand as={Link} to="/">E-BPMN</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/project"><i className='fa fa-book'></i> My Project</Nav.Link>
                        <Nav.Link as={Link} to="/friend"><i className='far fa-user'></i> Friends</Nav.Link>
                        <Nav.Link as={Link} to="/about"><i className='fa fa-laptop'></i> Guide</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to="/"><i className='far fa-user'></i> Welcome {localStorage.getItem('name')}</Nav.Link>
                        <Nav.Link as={Link} to="/login" onClick={this.logout}><i className='fas fa-sign-out-alt'></i> Log Out</Nav.Link>
                    </Nav>
                </Navbar>
            )

        }
        else {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand as={Link} to="/">E-BPMN </Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/about"><i className='fa fa-laptop'></i> Guide</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                    
                        <Nav.Link as={Link} to="/login"><i className='fas fa-sign-in-alt'></i> Sign In </Nav.Link>
                        <Nav.Link as={Link} to="/register"><i className='fas fa-sign-in-alt'></i> Sign Up </Nav.Link>
                    </Nav>
                </Navbar>
            )
        }
    }

    render() {
        return (
            this.renderNavbar()
        )
    }


}

export default NavbarTemplate
