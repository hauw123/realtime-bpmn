import React, { Component } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import { emptyBpmn } from '../assets/empty.bpmn.js';

export class modalopenproject extends Component {

    state = {
        projectname: '',
        xmlstring: emptyBpmn,
        file: '',
        dataxml: '',
        fileformattext: '',
        filestatus: false,
        buttonstatus: true,
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (this.state.projectname !== '' && this.state.filestatus === true) {
            this.setState({ buttonstatus: false })
        }
    }

    onChangeFile = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        const files = e.target.files
        const reader = new FileReader();
        reader.readAsText(files[0]);
        var string = files[0].name
        if (string.indexOf('.bpmn') !== -1) {
            reader.onload = (e) => {

                const parser = new window.DOMParser();
                const theDom = parser.parseFromString(e.target.result, 'application/xml');
                if (theDom.getElementsByTagName('parsererror').length > 0) {
                    console.log(theDom.getElementsByTagName('parsererror')[0].getElementsByTagName('div')[0].innerHTML);
                } else {
                    console.log('Valid Xml');
                    this.setState({ dataxml: e.target.result, filestatus: true, fileformattext: '' })
                    if (this.state.projectname !== '' && this.state.filestatus === true) {
                        this.setState({ buttonstatus: false })
                    }
                }
            }
            console.log("Found .bpmn in str")
        }
        else {
            this.setState({ fileformattext: "Please check your file format", buttonstatus: true, filestatus: false })
        }

    }


    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.dataxml)
        // console.log(this.state.projectname)
        // console.log(this.state.xmlstring)
        // console.log("success")

        Axios.post('apiuser/addproject', {
            name: this.state.projectname,
            dataxml: this.state.dataxml,
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
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>File</Form.Label>
                            <Form.Control autoComplete="off" onChange={this.onChangeFile} name="file" type="file" />
                        </Form.Group>
                        <Form.Text style={textStyle}>
                            {this.state.fileformattext}
                        </Form.Text>

                        <Button onChange={this.onChange} disabled={this.state.buttonstatus} onClick={this.props.onHide} variant="primary" type="submit">
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

const textStyle = {
    color: "red",
    fontSize: "15px"
}

export default modalopenproject
