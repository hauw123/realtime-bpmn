import React, { Component } from 'react'
import { Modal, Button, Table } from 'react-bootstrap';
import Axios from 'axios';


export class modaldeleteshare extends Component {
    state={
        allfriend: [],
        allfriendcount: 0,
        propsid: this.props.projectid
    }

    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });

    componentWillMount(){
        this.getdataallfriend();
        // this.getdataproject();
    }

    getdataallfriend = () => {
        var _this = this;
        console.log("axios")
        Axios.get('apiuser/usershared', {
            params: {
                id: localStorage.id,
                project: this.props.projectid
            }
        })
            .then(function (res) {
                _this.setState({
                    allfriend: res.data[0].shared,
                    allfriendcount: res.data[0].shared.length
                })

                console.log("state :")
                console.log(_this.state.allfriend)

            })
    }

    onClickRemoveUser = (iduser,idproject) => {
        var _this = this;
        Axios.delete('apiuser/removeshared', {
            params: {
                id:iduser,
                project:idproject
            }
        }
        )
            .then(function (res) {
                _this.getdataallfriend();
            }).catch(err => {console.log(err)})
    }

    render() {
        var _this = this;
        
        const renderShared = _this.state.allfriend.map(function (user, i) {

                return (
                    <tr key={user._id}>
                        <td>{user.email}</td>
                        <td><Button 
                        onClick={() => {this.onClickRemoveUser(user._id,this.props.projectid); this.props.onHide();}} 
                        variant="outline-danger" 
                        type="submit">Remove</Button> &nbsp; &nbsp;</td>
                    </tr>
                )
                
        }, this);

        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete Share
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <React.Fragment>
                <div>
                    <div style={tabstyle} >
                        <h3>Friend</h3>
                    </div><br></br>
                    <div style={tablestyle}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th colSpan="2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderShared}
                            </tbody>
                        </Table>
                    </div>

                </div>
            </React.Fragment>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const tablestyle = {
    width: '80%',
    margin: 'auto',
    textAlign: 'center',
    overflowY:"scroll",
    height:'auto',
    maxHeight: '50vh'
}
const tabstyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
}

export default modaldeleteshare
