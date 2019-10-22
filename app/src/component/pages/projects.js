import React, { Component } from 'react';
import Axios from 'axios';
import Tab from 'react-bootstrap/Tabs';
import Tabs from 'react-bootstrap/Tabs';
import Sonnet from 'react-bootstrap/Tabs';
import { Jumbotron, Button, Form, FormControl, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ModalProject from './modaladdproject';
import ModalInviteProject from './modalinviteproject';
import ModalDeleteShare from './modaldeleteshare';
import ModalOpenProject from './modalopenproject';
import ModalEditProject from './modaledit';
import Moment from 'moment';
import $ from 'jquery';

import GooglePicker from 'react-google-picker';

const URL = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=perl&site=stackoverflow";
var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/drive';

export class projects extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            key: 'myproject',//State awal pada tab halaman project
            //search: '',//State search pada input box
            // users: [], //Var pada handleSearch() berisi data user hasil search
            shareproject: [],//Var pada getdatasharedproject() berisikan array dari list shared
            shareprojectcount:0,//Var pada getdatasharedproject() berisikan dari jumlah project yang ada
            allproject: [],//Var pada getdataallproject() berisikan array dari list project
            allprojectcount : 0,//Var pada getdataallproject() berisikan dari jumlah project yang ada
            items: [],
            count: 5,//Timer yang digunakan untuk melakukan panggilan axios/ajax call
            modalShow: false,
            modalShowOpen:false,
            activeModalInvite:null,
            activeModalShare:null,
            activeModalEdit:null,
            search:''
        };

        this.clickHandler = this.clickHandler.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.clickEdit = this.clickEdit.bind(this);
        this.hideModalEdit = this.hideModalEdit.bind(this);
        this.clickHandlerDeleteShare = this.clickHandlerDeleteShare.bind(this)
        this.hideModalDeleteShare = this.hideModalDeleteShare.bind(this)
    }

    timer() {
        this.setState({
          count: this.state.count - 1
        })
        console.log(this.state.count)
        if(this.state.count < 1) {
            this.state.count = 3
            this.getdataallproject();
            this.getdatasharedproject();
        }
      }

      componentDidMount() 
      {
          var _this = this;
        this.intervalId = setInterval(this.timer.bind(this), 1000);

        _this.handleClientLoad();
      }

      componentWillUnmount()
      {
        clearInterval(this.intervalId);
        // this.getdataallproject();
        //     this.getdatasharedproject();
      }

    componentWillMount() {
        var _this = this;

        var config = {
            headers: { 'x-access-token': localStorage.getItem('token') }
        }

        //Cek Token dari user apakah valid
        Axios.get('/auth', config)
            .then((response) => {
                //console.log("Logged In Alreaddy")
                this.getdatasharedproject();
                this.getdataallproject();
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

    clickHandler(e, index) {
        this.setState({ activeModalInvite: index, })
    }
    
    hideModal() {
        this.setState({ activeModalInvite: null })
    }

    clickEdit(e, index) {
        this.setState({ activeModalEdit: index, })
    }
    
    hideModalEdit() {
        this.setState({ activeModalEdit: null,count:1 })
    }

    clickHandlerDeleteShare(e, index) {
        this.setState({ activeModalShare: index, })
    }
    
    hideModalDeleteShare() {
        this.setState({ activeModalShare: null })
    }

    getdataallproject = () => {
        var _this = this;
        Axios.get('apiuser/getproject', {
            params:{
                id:localStorage.id
            }
        })
        .then(function(res){
            _this.setState({
                allproject:res.data,
                allprojectcount: res.data.length
            })
            // console.log("check data all project")
            //console.log(_this.state.allproject)
        })
    }
    
    deleteproject = (id) => {
        var _this = this;
        console.log(id)
        Axios.delete('apiuser/deleteproject', {
            params:{
                id: id
            }
        })
        .then(res=>{
            console.log(res)
            _this.setState({
                count:1
            })
        })
        .catch(err => {console.log(err)})
    }

    getdoc =(fileId,callback)=>{
        var _this = this;
        var request = window.gapi.client.drive.files.get({
          fileId: fileId,
          alt: 'media'
        })
        request.then(function(response){
            console.log(response); //response.body has the text content of the file
            console.log(response.body)

            // const parser = new window.DOMParser();
            // const theDom = parser.parseFromString(response.body, 'application/xml');
            // if (theDom.getElementsByTagName('parsererror').length > 0) {
            //     alert('File tidak sesuai format bpmn');
            // } else {
            //     Axios.post('apiuser/addproject', {
            //         name: 'G-Drivefile'+Moment(new Date(Date.now())).format("YYYY-MM-DD hh:mm:ss"),
            //         dataxml: response.body,
            //         owner: localStorage.id
            //     }
            //     ).then(res => {
            //         if (res.status === 200) {
            //             console.log(res);
            //             console.log("from google drive")
            //             _this.setState({count:1})
                        
            //         } else {
            //             const error = new Error(res.error);
            //             throw error;
            //         }
            //     }
            //     ).catch(err => { console.log(err); alert('File tidak sesuai format bpmn') })
            //     if (typeof callback === "function") callback(response.body); 
            // }


            Axios.post('apiuser/addproject', {
                name: 'G-Drivefile'+Moment(new Date(Date.now())).format("YYYY-MM-DD hh:mm:ss"),
                dataxml: response.body,
                owner: localStorage.id
            }
            ).then(res => {
                if (res.status === 200) {
                    console.log(res);
                    console.log("from google drive")
                    _this.setState({count:1})
                    
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            }
            ).catch(err => { console.log(err); alert('File tidak sesuai format bpmn') })
            if (typeof callback === "function") callback(response.body); 
        },function(error){
            console.error(error)
        })
        return request; //for batch request
    }

    renderallproject(){
        var _this = this;
        var iduser = localStorage.id;
        let modalClose = () => this.setState({modalShow: false,count:1})
        let modalOpenClose = () => this.setState({modalShowOpen: false,count:1})
        

        const render = _this.state.allproject.map(function (project, i) {
            return (
                <tr key={project._id}>
                        <td>{project.name}</td>
                        <td>{project.owner.name}</td>
                        <td>{Moment(new Date(project.dateCreated)).format("YYYY-MM-DD hh:mm:ss")}</td>
                        <td>{Moment(new Date(project.lastEdited)).format("YYYY-MM-DD hh:mm:ss")}</td>
                        <td>
                        <Button as={Link} to={"/bpmndiagram/"+project._id} variant="outline-success" type="submit">Open</Button>&nbsp; &nbsp;
                        <Button  onClick={e => this.clickHandler(e, i)} variant="outline-success" type="submit">Share</Button>&nbsp; &nbsp;
                        <ModalInviteProject id={project._id}
                        projectid={project._id}
                        show={this.state.activeModalInvite === i}
                        onHide={this.hideModal} />

                        <Button  onClick={e => this.clickEdit(e, i)} variant="outline-success" type="submit">Edit</Button>&nbsp; &nbsp;
                        <ModalEditProject id={project._id}
                        projectid={project._id}
                        projectname={project.name}
                        show={this.state.activeModalEdit === i}
                        onHide={this.hideModalEdit} />

                        <Button  onClick={e => this.clickHandlerDeleteShare(e, i)} variant="outline-danger" type="submit">Delete Share</Button>&nbsp; &nbsp;
                        <Button onClick={() => this.deleteproject(project._id)} variant="outline-danger" type="submit">Delete Project</Button>
                        
                        
                        <ModalDeleteShare id={project._id}
                        projectid={project._id}
                        show={this.state.activeModalShare === i}
                        onHide={this.hideModalDeleteShare} />
                        </td> 
                </tr>
            )
    }, this);
        return (
            <React.Fragment>
                <div>

                    <div style={tabstyle} >
                        <h1>My Project</h1>
                    </div><br></br>
                    
                    <div style={divstyle}>

                    {/* GoogleDrive */}
                    <Button variant="outline-dark" id="sign-in-or-out-button">Sign In/Authorize Google</Button>&nbsp;

                    <button type="button" id="getDrive"><GooglePicker clientId={'698242060833-9at25qfsnpvvhjr5eg3qiaes74dpbmpv.apps.googleusercontent.com'}
                        developerKey={'AIzaSyDcf2KSBcCS1EHgEO6xCGwvlf5DT9mvDG4'}
                        scope='https://www.googleapis.com/auth/drive'
                        onChange={data => {
                            console.log('on change:', data); 
                            console.log(data.action); 
                            if(data.action == 'picked'){
                                console.log(data.docs[0].id);
                                this.getdoc(data.docs[0].id);
                            }
                        }}
                        onAuthFailed={data => console.log('on auth failed:', data)}
                        multiselect={true}
                        navHidden={true}
                        authImmediate={false}
                        mimeTypes={['image/png', 'image/jpeg', 'image/jpg', 'text/xml']}
                        query={''}
                        viewId={'DOCUMENTS'}>
                    </GooglePicker></button>&nbsp;
                    
                    <Button onClick={() => this.setState({modalShow:true})} variant="outline-primary" type="submit"><i className='fa fa-plus'></i> Add Project</Button>&nbsp;
                    <Button onClick={() => this.setState({modalShowOpen:true})} variant="outline-primary" type="submit"><i className='fa fa-plus'></i> Open Existing Project</Button>
                    <ModalProject show={this.state.modalShow} onHide={modalClose} />
                    <ModalOpenProject show={this.state.modalShowOpen} onHide={modalOpenClose} />
                    
                    {/* Search Project Name */}
                    {/* <div style={tabstyle} >
                                <Form onSubmit={this.handleSearch} inline>
                                    <FormControl onChange={this.onChange} type="text" name='search' placeholder="Search project" className=" mr-sm-2" />
                                    <Button variant="outline-primary" type="submit">Search</Button>
                                </Form>
                    </div> */}
                   
                    </div>
                    
                    <div style={tablestyle}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Owner</th>
                                    <th>Date Created</th>
                                    <th>Last Edited</th>
                                    <th colSpan="2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                            {render}

                    
                            </tbody>
                        </Table>
                    </div>

                </div>
            </React.Fragment>
        )
    }

    //Search Project
    handleSearch = (e) => {
        e.preventDefault();
        var _this = this;


        console.log(this.state.search)
        if(this.state.search !== ''){
            _this.setState({
                count:1000
            })
        }
        else{
            _this.setState({
                count:3
            })
        }

        Axios.get('apiuser/searchproject', {
            params: {
                project: this.state.search,
                id: localStorage.id
            }
        })
            .then(function (res) {
                _this.setState({
                    allproject:res.data,
                    
                })
            })
            .catch(function (e) {
                console.log("Error ", e);
            })
    }

    getdatasharedproject = () => {
        var _this = this;
        Axios.get('apiuser/getsharedproject', {
            params:{
                id:localStorage.id
            }
        })
        .then(function(res){
            _this.setState({
                shareproject: res.data,
                shareprojectcount: res.data.length
            })
        })
    }

    removeshare = (projectid) => {
        var _this = this;
        Axios.delete('apiuser/deleteshared',{
            params:{
                id:localStorage.id,
                project: projectid
            }
        })
        .then(function(res){
            console.log(res)
        }).catch(err => {console.log(err)})
    }


    rendersharedproject = () => {
        var _this = this
        const render = _this.state.shareproject.map(function (project, i) {
            return (
                <tr key={project._id}>
                        <td>{project.name}</td>
                        <td>{project.owner.name}</td>
                        <td>{Moment(new Date(project.dateCreated)).format("YYYY-MM-DD hh:mm:ss")}</td>
                        <td>{Moment(new Date(project.lastEdited)).format("YYYY-MM-DD hh:mm:ss")}</td>
                        <td><Button as={Link} to={"/bpmndiagram/"+project._id} variant="outline-success" type="submit">Open</Button>&nbsp; &nbsp;
                        <Button onClick={() => this.removeshare(project._id)} variant="outline-danger" type="submit">Delete</Button>
                        </td> 
                </tr>
            )
    }, this);
    return (
        <React.Fragment>
            <div>

                <div style={tabstyle} >
                    <h1>Shared Project</h1>
                </div><br></br>  
                <div style={tablestyle}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Owner</th>
                                <th>Date Created</th>
                                <th>Last Edited</th>
                                <th colSpan="2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        {render}

                
                        </tbody>
                    </Table>
                </div>

            </div>
        </React.Fragment>
    )
    }

    //Digunakan untuk input form setiap state perubahan
    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });

    //Render halaman project
    renderproject() {
        return (
            <React.Fragment>
                <Jumbotron>
                    <h1><i className='fa fa-book'></i> Projects</h1>
                </Jumbotron>
                {/* <Button as={Link} to="/bpmndiagram/aaasgag" variant="primary">Primary</Button> */}


                <Tabs
                    id="controlled-tab-example"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}
                    style={tabstyle}
                >
                    <Tab eventKey="myproject" title={"My Project [ " + [this.state.allprojectcount] + " ]"}>
                        <Sonnet />
                        {this.renderallproject()}

                    </Tab>
                    <Tab eventKey="sharedproject" title={"Shared Project [ " + [this.state.shareprojectcount] + " ]"}>
                        <Sonnet />
                        {this.rendersharedproject()}

                    </Tab>
                </Tabs>
            </React.Fragment>

        )
    }


    GoogleDrive
    handleClientLoad = () => {
        // Load the API's client and auth2 modules.
        // Call the initClient function after the modules load.
        window.gapi.load('client:auth2', this.initClient);
      }

      initClient = () => {
        var _this = this;
        console.log('client inited')
      // Retrieve the discovery document for version 3 of Google Drive API.
      // In practice, your app can retrieve one or more discovery documents.
      var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  
      // Initialize the gapi.client object, which app uses to make API requests.
      // Get API key and client ID from API Console.
      // 'scope' field specifies space-delimited list of access scopes.
      window.gapi.client.init({
          'apiKey': 'AIzaSyDcf2KSBcCS1EHgEO6xCGwvlf5DT9mvDG4',
          'discoveryDocs': [discoveryUrl],
          'clientId': '698242060833-9at25qfsnpvvhjr5eg3qiaes74dpbmpv.apps.googleusercontent.com',
          'scope': SCOPE
      }).then(function () {
        GoogleAuth = window.gapi.auth2.getAuthInstance();
  
        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
  
        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();
  
        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function() {
          handleAuthClick();
        }); 
        $('#revoke-access-button').click(function() {
          revokeAccess();
        }); 
      });

      function updateSigninStatus(isSignedIn) {
        setSigninStatus();
      }

      function setSigninStatus(isSignedIn)  {
        var user = GoogleAuth.currentUser.get();
        var isAuthorized = user.hasGrantedScopes(SCOPE);
        if (isAuthorized) {
          $('#getDrive').removeAttr('hidden');
          $('#sign-in-or-out-button').html('Sign out');
          $('#revoke-access-button').css('display', 'inline-block');
          $('#auth-status').html('You are currently signed in and have granted ' +
              'access to this app.');
        } else {
          $('#getDrive').attr('hidden','hidden');
          $('#sign-in-or-out-button').html('Sign In/Authorize Google');
          $('#revoke-access-button').css('display', 'none');
          $('#auth-status').html('You have not authorized this app or you are ' +
              'signed out.');
        }
      }

      function handleAuthClick(){
        if (GoogleAuth.isSignedIn.get()) {
          // User is authorized and has clicked 'Sign out' button.
          GoogleAuth.signOut();
        } else {
          // User is not signed in. Start Google auth flow.
          GoogleAuth.signIn();
        }
      }
    
      function revokeAccess() {
        GoogleAuth.disconnect();
      }
    }

    //render keseluruhan
    render() {
        return (<div>{this.renderproject()}</div>
        )
    }
}

const buttonStyle={
    width: '50%'
}

const divstyle ={
    textAlign: 'right',
    paddingRight: '10%',
    paddingBottom: '20px'
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

export default projects
