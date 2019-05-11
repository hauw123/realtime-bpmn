import React, { Component } from 'react';
import Axios from 'axios';
import Tab from 'react-bootstrap/Tabs';
import Tabs from 'react-bootstrap/Tabs';
import Sonnet from 'react-bootstrap/Tabs';
import { Jumbotron, Button, Form, FormControl, Table } from 'react-bootstrap';


const URL = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=perl&site=stackoverflow";


export class friend extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            key: 'friend',//State awal pada tab halaman friend
            search: '',//State search pada input box
            users: [], //Var pada handleSearch() berisi data user hasil search
            friendrequest: 0,//Vara pada getdatafriendrequest() berisi dari jumlah friend request yang ada
            usersrequest: [],//Var pada getdatafriendrequest() berisi data semua friend request
            allfriend: [],//Var pada getdataallfriend() berisikan array dari list teman
            allfriendcount: 0,//Var pada getdataallfriend() berisikan dari jumlah teman yang ada
            items: [],
            count: 5,//Timer yang digunakan untuk melakukan panggilan axios/ajax call
        };
    }

    timer() {
        this.setState({
          count: this.state.count - 1
        })
        //console.log(this.state.count)
        if(this.state.count < 1) {
            this.getdatafriendrequest();
            this.getdataallfriend();
            this.state.count = 5
        }
      }

      componentDidMount() 
      {
        this.intervalId = setInterval(this.timer.bind(this), 1000);
      }

      componentWillUnmount()
      {
        clearInterval(this.intervalId);
        this.getdatafriendrequest();
            this.getdataallfriend();
      }

    componentWillMount() {
        var _this = this;

        var config = {
            headers: { 'x-access-token': localStorage.getItem('token') }
        }

        //Cek Token dari user apakah valid
        Axios.get('/auth', config)
            .then((response) => {
                console.log("Logged In Alreaddy")
                this.getdatafriendrequest();
                this.getdataallfriend();
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
                this.props.history.push('/notfound')
            })
    }


    // Digunakan untuk mendapatkan data list teman yang ada
    getdataallfriend = () => {
        var _this = this;
        Axios.get('apiuser/allfriend', {
            params: {
                id: localStorage.id
            }
        })
            .then(function (res) {
                _this.setState({
                    allfriend: res.data,
                    allfriendcount: res.data[0].friends.length
                })
            })
    }

    onClickdeleteuser = (e,id1) => {
        console.log(e);
        var _this = this;
        Axios.delete('apiuser/deletefriend', {
            params: {
                idfriend : e,
                iduser : id1
            }
            
        })
            .then(res => {
                console.log(res);
            }
            ).catch(err => { console.log(err); alert('Error action') })
    }

    //Digunakan untuk memberikan tampilan dari friend list yang ada
    renderallfriend() {
        var _this = this;
        var iduser = localStorage.id

        const renderAllFriend = _this.state.allfriend.map(function (user, i) {
            return user.friends.map(friends => {
                return (
                    <tr key={friends._id}>
                        <td>{friends.name}</td>
                        <td>{friends.email}</td>
                        <td><Button onClick={() => this.onClickdeleteuser(friends._id,iduser)} variant="outline-danger" type="submit">Delete</Button> &nbsp; &nbsp;
                            </td>
                    </tr>
                )
            })
        }, this);

        return (
            <React.Fragment>
                <div>

                    <div style={tabstyle} >
                        <h1>All Friend</h1>
                    </div><br></br>
                    <div style={tablestyle}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th colSpan="2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderAllFriend}
                            </tbody>
                        </Table>
                    </div>

                </div>
            </React.Fragment>
        )
    }

    //Digunakan untuk mendapatkan data request teman melalui axios / ajax call
    getdatafriendrequest = () => {
        var _this = this;
        Axios.get('apiuser/datafriendrequest', {
            params: {
                id: localStorage.id
            }
        })
            .then(function (res) {
                //console.log("Get data friend request")
                _this.setState({
                    usersrequest: res.data
                })
                _this.setState({
                    friendrequest: _this.state.usersrequest.length
                })

            })
            .catch(function (e) {
                console.log("Error ", e);
            })
    }

    //Digunakan untuk input form setiap state perubahan
    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });

    //digunakan pada renderfriendrequest()
    onClickrequestaction = (e, id1, id2, id3) => {
        console.log(e);
        var _this = this;
        Axios.put('apiuser/actionrequest', {
            status: e,
            idrecipient: id1,
            idrequester: id2,
            iddoc: id3
        })
            .then(res => {
                console.log(res);
                this.getdatafriendrequest();
            }
            ).catch(err => { console.log(err); alert('Error action') })
    }

    //Digunakan untuk menampilkan hasil friend request
    renderfriendrequest() {
        const renderFriend = this.state.usersrequest.map(function (user, i) {
            return (
                <tr key={user.requester._id}>
                    <td>{user.requester.name}</td>
                    <td><Button onClick={() => this.onClickrequestaction(1, user.recipient, user.requester._id, user._id)} variant="outline-success" type="submit">Accept</Button> &nbsp; &nbsp;
                        <Button onClick={() => this.onClickrequestaction(2, user.recipient, user.requester._id, user._id)} variant="outline-success" type="submit">Reject</Button>
                    </td>
                </tr>
            );
        }, this);

        return (
            <React.Fragment>
                <div>

                    <div style={tabstyle} >
                        <h1>Friend Requests</h1>
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
        )
    }

    //Digunakan pada function rendersearch()
    onClickuserid = (e) => {
        console.log(e);
        var _this = this;
        Axios.post('apiuser/addfriend', {
            requester: localStorage.id,
            recipient: e
        })
            .then(res => {
                var array = [...this.state.users]; // make a separate copy of the array
                
                if (i !== -1) {
                  array.splice(i, 1);
                  this.setState({users: array});
                }

            }
            ).catch(err => { console.log(err); alert('Error add') })
    }

        //Digunakan untuk melakukan search by email terhadap user
        handleSearch = (e) => {
            e.preventDefault();
            var _this = this;
    
            Axios.get('apiuser/searchuser', {
                params: {
                    email: this.state.search,
                    id: localStorage.id
                }
            })
                .then(function (res) {
                    _this.setState({
                        users: res.data
                    })
                    console.log(_this.state.users);
                    // if(!_this.state.users.length){
                    //     console.log("empty bruh")
                    // }
                })
                .catch(function (e) {
                    console.log("Error ", e);
                })
        }

    //Digunakan untuk menampilkan hasil search berdasarkan email
    rendersearch() {

        let button;

        const renderUser = this.state.users.map(function (user, i) {
            //console.log("this user " + user.name + " isfriend :  " +user.isFriend+ " and is request : "+user.isRequest)
            if(user.isFriend == true && user.isRequest == false){
                button= (<td><Button style={buttonStyle} disabled 
                variant="outline-info" type="submit">Already friend</Button></td>);
            }
            if(user.isFriend == false && user.isRequest == true){
                button= (<td><Button style={buttonStyle} disabled 
                variant="outline-info" type="submit">Request</Button></td>);
            }
            if(user.isFriend == false && user.isRequest == false){
                button= (<td><Button style={buttonStyle} onClick={() => this.onClickuserid(user._id,i)}
                variant="outline-success" type="submit">Add</Button></td>);
            }
            
            return (
                <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {button}
                    {/* <td><Button disabled onClick={() => this.onClickuserid(user._id)}
                        variant="outline-success" type="submit">Add</Button></td> */}
                </tr>
            );
        }, this);

        return (
            <React.Fragment>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderUser}
                    </tbody>
                </Table>
            </React.Fragment>

        )
    }

    //Render halaman friend
    renderfriend() {
        return (
            <React.Fragment>
                <Jumbotron>
                    <h1><i className='far fa-user'></i> Friends</h1>
                </Jumbotron>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}
                    style={tabstyle}
                >
                    <Tab eventKey="friend" title={"All Friends [ " + [this.state.allfriendcount] + " ]"}>
                        <Sonnet />
                        {this.renderallfriend()}

                    </Tab>
                    <Tab eventKey="friendrequests" title={"Friend requests [ " + [this.state.friendrequest] + " ]"}>
                        <Sonnet />
                        {this.renderfriendrequest()}

                    </Tab>

                    <Tab eventKey="addfriend" title="Add friend">
                        <Sonnet /><br></br>
                        <div>

                            <div style={tabstyle} >
                                <Form onSubmit={this.handleSearch} inline>
                                    <FormControl onChange={this.onChange} type="text" name='search' placeholder="Search email" className=" mr-sm-2" />
                                    <Button variant="outline-primary" type="submit">Search</Button>
                                </Form>
                            </div><br></br>
                            <div style={tablestyle}>
                                {this.rendersearch()}
                            </div>

                        </div>


                    </Tab>
                </Tabs>
            </React.Fragment>

        )
    }

    //render keseluruhan
    render() {
        return (<div>{this.renderfriend()}</div>
        )
    }
}

const buttonStyle={
    width: '50%'
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

export default friend
