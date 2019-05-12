import React, { Component } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import Axios from 'axios';


export class modaledit extends Component {

    state={
        allfriend: [],
        allfriendcount: 0,
        propsid: this.props.projectid,
        projectname:this.props.projectname
    }

    onChange = (e) => {this.setState({
        [e.target.name]: e.target.value
    }); 
        
}


    handleSubmit=(e)=>{
        var _this = this;
        e.preventDefault()
        console.log(this.state.projectname)
        Axios.put('apiuser/editprojectname', {
            name: this.state.projectname,
            id:this.state.propsid
        })
        .then(function(res){
            _this.props.onHide();
        })
        
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
                        Edit project name
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <React.Fragment>
                <Form onSubmit={this.handleSubmit}>

                <Form.Group controlId="formBasicName">
                    <Form.Label>Project Name : </Form.Label>
                    <Form.Control onChange={this.onChange} name="projectname" type="text" value={this.state.projectname} />
                    
                </Form.Group>

                <Button variant="outline-secondary" type="submit" block>
                    Submit
                </Button>

                </Form>
            </React.Fragment>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default modaledit
