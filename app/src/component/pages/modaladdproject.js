import React, { Component } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import { emptyBpmn } from '../assets/empty.bpmn.js';

export class modaladdproject extends Component {

    state={
        projectname: '',
        xmlstring: emptyBpmn,
        validatename: '',
    }

    onChange = (e) => 
    this.setState({
        [e.target.name]: e.target.value
    });
    

    
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.projectname !== '')
        {
            console.log(this.state.projectname)
            console.log(this.state.xmlstring)
            console.log("success")
    
            Axios.post('apiuser/addproject', {
                name: this.state.projectname,
                dataxml: this.state.xmlstring,
                owner: localStorage.id
            }
            ).then(res => {
                if (res.status === 200) {
                    console.log(res);
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            }
            ).catch(err => { console.log(err); alert('Error loggin in') })
        }


    }

    

    render() {



        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        New Project
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control autoComplete="off" onChange={this.onChange} name="projectname" type="text" placeholder="Enter project name" />
                            {this.state.validatename}
                        </Form.Group>

                        <Button disabled={!this.state.projectname} onClick={this.props.onHide} variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default modaladdproject
