import React, { Component } from 'react'
import { Modal, Button, Table } from 'react-bootstrap';
import Axios from 'axios';


export class modalinviteproject extends Component {

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
        Axios.get('apiuser/friendproject', {
            params: {
                id: localStorage.id,
                project: this.props.projectid
            }
        })
            .then(function (res) {
                // console.log("Get data all friend")
                // console.log(res)
                _this.setState({
                    allfriend: res.data,
                    // allfriendcount: res.data[0].friends.length
                })

            })
    }

    onClickInviteUser = (iduser,idproject) => {
        var _this = this;
        Axios.put('apiuser/inviteproject', {id: iduser,project: this.props.projectid}
        )
            .then(function (res) {
                _this.getdataallfriend();
            })
    }

    render() {
        var _this = this;
        var iduser = localStorage.id;
        const renderFriend = _this.state.allfriend.map(function (user, i) {

            if(user.isShared == false){
                return (
                    <tr key={user._id}>
                        <td>{user.email}</td>
                        <td><Button 
                        onClick={() => { this.onClickInviteUser(user._id,this.props.projectid); this.props.onHide(); }}
                        //onClick={() => this.onClickInviteUser(user._id,this.props.projectid)} 
                        variant="outline-info" 
                        type="submit">Invite</Button> &nbsp; &nbsp;</td>
                    </tr>
                )
            }



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
                        Share Project
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
                                {renderFriend}
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



export default modalinviteproject
