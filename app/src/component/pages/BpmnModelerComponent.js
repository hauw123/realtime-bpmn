import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
//import { emptyBpmn } from '../assets/empty.bpmn.js';
import Chat from './chatroom.js'
// import propertiesPanelModule from 'bpmn-js-properties-panel';
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import Axios from 'axios';
import { Button } from 'react-bootstrap';
import RestrictionModules from './Restriction';
import $ from 'jquery';
import Moment from 'moment';
import Tooltip from "react-simple-tooltip"
import readOnly from './Lock';

import canvg from 'canvg-browser';

import socketIOClient from 'socket.io-client';

const endpoint = "/bpmndiagram";
const socket = socketIOClient(endpoint);

var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/drive';

class BpmnModelerComponent extends Component {

    constructor() {
        
        super();

        this.state = {
            projectid: '',
            projectname:'',
            xmldata: '',
            count: 1,
            scale: 1,
            datasvg: '',
            statusgoogle:'true',
            containerWidth:75,
            divWidth:25,
            statusChat:'Hide',
            edit:true,
            editor:''
        }

        
        var _this = this;
        socket.on('xmlproject', function(data) {
            _this.setState({
                xmldata: data.xml
            })
            _this.newBpmnDiagram(_this.state.xmldata);
        });

        //DISABLE LABEL

        socket.on('userediting', function(data){
            _this.setState({
                editor:data.user + " melakukan edit"
            })
            _this.setState({edit:false})
            console.log(data.user)
        })

        socket.on('finishedit', function(data){
            _this.setState({
                editor: '',
                edit: true
            })
        })

        //DISABLE MODELER

        socket.on('usereditingmodeler', function(data){
            console.log("ok")
            _this.modeler.get('readOnly').readOnly(true);
            _this.setState({
                editor:data.user + " melakukan edit",
                edit:false
            })
        })

        socket.on("finisheditmodeler", function(data){
            _this.modeler.get('readOnly').readOnly(false);
            _this.setState({
                editor: '',
                edit: true
            })
        })

        this.console = this.console.bind(this);


    }

    timer() {
        var _this = this;

        this.setState({
            count: this.state.count - 1
        })

        if (this.state.count < 1) {
            //this.socketsavexml();
            //this.SaveDiagram();
            //this.getnewxmlproject();
            this.state.count = 1
            //console.log("a")
        }

    }

    componentWillUnmount() {
        clearInterval(this.intervalId);//Timer check online / offline
    }

    modeler = null;

    componentDidMount = () => {
        var priority = 10000;
        var _this = this;
        
        //this.intervalId = setInterval(this.timer.bind(this), 1000);


        //this.modeler = new BpmnModeler({ container: '#bpmnview', modules: [readOnly] });


        this.modeler = new BpmnModeler({
            container: '#bpmnview',
            keyboard: {
                bindTo: window
            },
            additionalModules: [
                RestrictionModules,
                readOnly
            ]
        });

        
        

        this.getxmlproject();

        this.modeler.get('eventBus').on('commandStack.changed', () => 
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return error;
            }
                socket.emit('send xml', {
                    room: _this.state.projectid,
                    xml: xml
                })
                _this.setState({xmldata:xml})

        })
        )

        this.modeler.get('eventBus').on('element.click', function(event) {
            console.log(event.element.type)
          });


            this.modeler.get('eventBus').on('element.dblclick', priority, function(event) {
                if(_this.state.edit === true){

                //DISABLE LABEL EDIT
                //     console.log("clicked 2");
                //     if(event.element.type!== 'bpmn:Collaboration'){                    
                //         _this.setState({edit:false,editor:localStorage.name + ' melakukan edit'})
                //     console.log(_this.state.edit);
                //     socket.emit('send edit', {
                //         user: localStorage.name,
                //         room: _this.state.projectid
                //     })
                // }


                //DISABLE MODELER
                if(event.element.type!== 'bpmn:Collaboration'){                    
                                    _this.setState({edit:false,editor:localStorage.name + ' melakukan edit'})
                                    socket.emit('send edit viewer', {
                                        user: localStorage.name,
                                        room: _this.state.projectid
                                    })
                }

                }
                else{
                    //_this.modeler.get('readOnly').readOnly(false);
                    // return false;
                }
            });

            this.modeler.get('eventBus').on('drag.start', priority, function(event) {
                socket.emit('send edit viewer', {
                    user: localStorage.name,
                    room: _this.state.projectid
                })
                console.log("drag start")
                console.log(event)
            })

            this.modeler.get('eventBus').on('drag.end', priority, function(event) {
                console.log("drag end")
                console.log(event)
                socket.emit('finish edit modeler', {
                    room: _this.state.projectid
                })
            })

        // this.modeler.get('eventBus').on('element.mouseup', function(event) {
        //     console.log("clicked release")
        //   });

        //   this.modeler.get('eventBus').on('element.mousedown', function(event) {
        //     console.log("clicked hold")
        //   });

           


 
        this.modeler.get('eventBus').on('shape.changed', 999999, function(event) {

            //DISABLE MODELER
            socket.emit('finish edit modeler', {
                room: _this.state.projectid
            })

            //DISABLE LABEL

            // socket.emit('finish edit', {
            //     room: _this.state.projectid
            // })
            
              console.log(event);
              _this.setState({edit:true,editor:''})
            });

            _this.handleClientLoad();
    }

    changeToViewer = () =>{
        console.log("ok")
        this.modeler.get('readOnly').readOnly(true);
        
    }

    changeToModeler = () =>{
        console.log("ok")
        this.modeler.get('readOnly').readOnly(false);
        this.setState({edit:true,editor:''})
        
    }

    componentWillMount() {
    
        // socket.emit("joinRoom",this.props.match.params.id);
        socket.emit("joinRoomProject", {
            id:this.props.match.params.id,
            user:localStorage.email,
            date:Date.now()
        })

        var _this = this;
        this.setState({ projectid: this.props.match.params.id })

        var config = {
            headers: { 'x-access-token': localStorage.getItem('token') }
        }

        this.intervalId = setInterval(function(){
            if(navigator.onLine){
                //console.log('online')
            }else{
                //console.log('offline')
                window.location="/noconnection";
                
            }
        },3000);

        //Cek Token dari user apakah valid
        Axios.get('/auth', config)
            .then((response) => {
                console.log("BPMN modeler component valid user")
                Axios.get('/apiuser/getdataproject', {
                    params:{
                        id: _this.state.projectid
                    }
                    
                })
                .then(res =>{
                    this.setState({projectname:res.data.name})
                    var user= res.data.shared;
                    if(localStorage.id == res.data.owner || user.toString().includes(localStorage.id)){
                        console.log("user valid inside bpmn")
                    }
                    else{
                        this.props.history.push('/notauthorized') 
                    }
                }).catch(err => { console.log(err); alert('Error action') })
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

    SaveDiagram = (xml) => {
        var _this = this;
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return error;
            }
            //console.log(xml)
            if (_this.state.xmldata == xml) {
                //console.log("Tidak ada perubahan")
            }
            else {
                //console.log("Save diagram updating to database")
                Axios.put('/apiuser/savediagram', {
                    dataxml: xml,
                    id: _this.state.projectid
                })
                    .then(res => {
                    }
                    ).catch(err => { console.log(err); alert('Error action') })
            }
        });
    }

    console = () =>{
        console.log("test123")
    }

    socketsavexml = () => {
        var _this = this;
        
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return error;
            }
            //console.log(xml)
            if (_this.state.xmldata == xml) {
                console.log("No Change")
            }
            else {
                socket.emit('send xml', {
                    room: _this.state.projectid,
                    xml: xml
                })
                _this.setState({xmldata:xml})
            }
        });
    }

    getnewxmlproject = () => {
        var _this = this;
        // console.log(this.state.projectid)
        var canvas = this.modeler.get('canvas');
        if (canvas._cachedViewbox == null) {
            //console.log("scale still null")
        }
        else {

            //console.log("scale : " + canvas._cachedViewbox.scale)
            this.setState({ scale: canvas._cachedViewbox.scale })
        }

        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return error;
            }

            Axios.get('/apiuser/getxml', {
                params: {
                    id: _this.state.projectid
                }
            })
                .then((res) => {
                    _this.setState({
                        xmldata: res.data.dataxml
                    }, () => {
                        if (_this.state.xmldata == xml) {
                            //console.log("still same")
                        }
                        else {
                            //console.log("update new one please")
                            _this.newBpmnDiagram(_this.state.xmldata)
                        }
                    })
                })
        });
    }

    getxmlproject = () => {

        var _this = this;

        this.setState({ projectid: this.props.match.params.id })

        Axios.get('/apiuser/getxml', {
            params: {
                id: this.props.match.params.id
            }
        })
            .then(function (res) {
                _this.setState({
                    xmldata: res.data.dataxml
                })
                _this.newBpmnDiagram(_this.state.xmldata);
                //console.log(_this.state.xmldata)

            })
    }



    newBpmnDiagram = (newbpmn) => {
        var _this = this;
        this.openBpmnDiagram(newbpmn)
    }

    openBpmnDiagram = (xml) => {
        this.modeler.importXML(xml, (error) => {
            if (error) {
                return console.log('fail import xml');
            }
            var canvas = this.modeler.get('canvas');
            canvas.zoom(this.state.scale);
        });
    }




    DownloadImage = (i) => {
        var _this = this;
        console.log(i)

        this.modeler.saveSVG(function (err, svg) {
            if (err) console.log(err)
            _this.setState({ datasvg: svg }, function () {

                const canvas = _this.refs.canvasforimage;
                

                const options = {
                    log: false,
                    ignoreMouse: true,

                };

                canvg(canvas, this.state.datasvg, options);
                // const ctx = canvas.getContext('2d');
                // ctx.font = '12px serif';
                // ctx.fillText('Hellow world', canvas.width-50, canvas.height-25 );          
                if (i == 1) {
                    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    var a = document.createElement("a")
                    a.href = image;
                    a.download = "diagram.png";
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                    }, 0);
                }
                else if (i == 2) {
                    const image = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
                    var a = document.createElement("a")
                    a.href = image;
                    a.download = "diagram.jpg";
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                    }, 0);
                }
                else if (i == 3) {
                    const image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                    var a = document.createElement("a")
                    a.href = image;
                    a.download = "diagram.jpeg";
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                    }, 0);
                    // const image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                    // const element = document.createElement("a");
                    // element.setAttribute('download', 'diagram.jpeg');
                    // element.setAttribute('href', image);
                    // element.click();
                }
            })
        })
    }
    
    Print = () => {
        var _this = this;

        this.modeler.saveSVG(function (err, svg) {
            if (err) console.log(err)
            _this.setState({ datasvg: svg }, function () {

                

                const canvas = _this.refs.canvasforimage;


                const options = {
                    log: false,
                    ignoreMouse: true
                };
                canvg(canvas, this.state.datasvg, options);

                var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                var newWindow = '<!DOCTYPE html>';
                newWindow += '<html>'
                newWindow += '<head><title>Print canvas</title></head>';
                newWindow += '<body>'
                newWindow += '<img src="' + image + '">';
                newWindow += '<div style="position:absolute;right:0;bottom:0">'+'E-BPMN Date : '+Moment(new Date(Date.now())).format("YYYY-MM-DD hh:mm:ss")+'</div>';
                newWindow += '</body>';
                newWindow += '</html>';
                console.log(newWindow);
                var win = window.open('','','width=1280,height=720');
                win.document.write(newWindow);
                win.document.close();
                win.focus();

                setTimeout(function () {
                    win.print();
                    win.close();
                }, 0);
            })
        })
    }

    DownloadDiagram = () => {
        var _this = this;
        const element = document.createElement("a");
        const file = new Blob([_this.state.xmldata], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "diagram.bpmn";
        document.body.appendChild(element);
        element.click();
    }

    handleClientLoad = () => {
        window.gapi.load('client:auth2', this.initClient);
      }

      initClient = () => {
        var _this = this;
        console.log('client inited')
      var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

      window.gapi.client.init({
          'apiKey': 'AIzaSyDcf2KSBcCS1EHgEO6xCGwvlf5DT9mvDG4',
          'discoveryDocs': [discoveryUrl],
          'clientId': '698242060833-9at25qfsnpvvhjr5eg3qiaes74dpbmpv.apps.googleusercontent.com',
          'scope': SCOPE
      }).then(function () {
        GoogleAuth = window.gapi.auth2.getAuthInstance();
  
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
  
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();

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
          $('#UploadDrive').removeAttr('hidden');
          $('#sign-in-or-out-button').html('Sign out');
          $('#revoke-access-button').css('display', 'inline-block');
        //   $('#auth-status').html('You are currently signed in and have granted ' +
        //       'access to this app.');
        } else {
            $('#UploadDrive').attr('hidden','hidden');
          $('#sign-in-or-out-button').html('Sign In/Authorize Google');
          $('#revoke-access-button').css('display', 'none');
        //   $('#auth-status').html('You have not authorized this app or you are ' +
        //       'signed out.');
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

    UploadFiles = () => {
        
        var title = this.state.projectname+'-'+Date.now()+'.bpmn';
        var fileContent = this.state.xmldata; // As a sample, upload a text file.
        var fileData = new Blob([fileContent], {type: 'text/xml'});
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
      
        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
          var contentType = fileData.type || 'application/octet-stream';
          var metadata = {
            'name': title,
            'mimeType': contentType
          };
      
          var base64Data = btoa(reader.result);
          var multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: ' + contentType + '\r\n' +
              'Content-Transfer-Encoding: base64\r\n' +
              '\r\n' +
              base64Data +
              close_delim;
      
          var request = window.gapi.client.request({
              'path': '/upload/drive/v3/files',
              'method': 'POST',
              'params': {'uploadType': 'multipart'},
              'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
              },
              'body': multipartRequestBody});
              request.execute(function(arg) {
                console.log(arg);
                alert("Upload Success");
              });
        }
    }

    hideChat = () => {
        if(this.state.statusChat === 'Hide'){
            this.setState({statusChat:'Show'})
            $('#chatRoom').attr('hidden','hidden');
            // $('#buttonHide').attr('hidden','hidden');
            // $('#buttonShow').removeAttr('hidden');
            this.setState({containerWidth:95})
            this.setState({divWidth:5})
        }
        if(this.state.statusChat === 'Show'){
            this.setState({statusChat:'Hide'})
            $('#chatRoom').removeAttr('hidden');
            // $('#buttonShow').attr('hidden','hidden');
            // $('#buttonHide').removeAttr('hidden');
            this.setState({containerWidth:75})
            this.setState({divWidth:25})
        }
    }




    render = () => {
        
        return (
            <div id="bpmncontainer">
                
                <div style={chatstyle} id="propview" style={{ width: this.state.divWidth+'%', height: '93vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}>
                    <div style={{width:'100%',display:'flex'}} >                
                    <Button variant="outline-dark" style={buttonStyle}  id="buttonHide" onClick={this.hideChat}><i className="fa fa-eye" aria-hidden="true"></i> {this.state.statusChat}</Button>
                    </div>

                    <div id="chatRoom"><Chat projectid={this.state.projectid} /></div>
                    
                    </div>
                {/* <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div> */}
                <div id="bpmnview" style={{ width: this.state.containerWidth+'%', height: '90vh', float: 'left' }}></div>

                <canvas hidden  ref="canvasforimage" id="canvasforimage">
                </canvas>


                {/* <Button
                    onClick={this.SaveDiagram}
                    variant="outline-info"
                    type="submit">Save
                </Button>&nbsp; */}
                <Tooltip background="white" color="black"  radius={50} content="Download diagram ke komputer pribadi">                
                <Button
                    onClick={this.DownloadDiagram}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-download"> Diagram</i>
                </Button>
                </Tooltip>&nbsp;

                <Tooltip background="white" color="black" radius={50} content="Download gambar dengan format PNG">    
                <Button
                    onClick={() => this.DownloadImage(1)}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> PNG
                </Button>
                </Tooltip>&nbsp;

                <Tooltip background="white" color="black"  radius={50} content="Download gambar dengan format JPG">    
                <Button
                    onClick={() => this.DownloadImage(2)}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> JPG
                </Button>
                </Tooltip>&nbsp;

                <Tooltip background="white" color="black" radius={50} content="Download gambar dengan format JPEG">    
                <Button
                    onClick={() => this.DownloadImage(3)}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> JPEG
                 </Button>
                 </Tooltip>&nbsp;

                 <Tooltip background="white" color="black"  radius={50} content="Print diagram">    
                 <Button
                    onClick={() => this.Print()}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> Print
                 </Button>
                 </Tooltip>&nbsp;


                <Tooltip background="white" color="black" radius={50} content="Login untuk upload">    
                <Button variant="outline-dark" id="sign-in-or-out-button">Sign In/Authorize Google</Button></Tooltip>&nbsp;
                
                <Tooltip background="white" color="black" radius={50} content="Hapus akses website untuk upload">   
                <Button variant="outline-dark" id="revoke-access-button"><i className="fa fa-google"></i> Revoke access</Button></Tooltip>
                
                <Tooltip background="white" color="black" radius={50} content="Upload diagram">   
                <Button
                            id="UploadDrive"
                            hidden
                            onClick={() => this.UploadFiles()}
                            variant="outline-dark"
                            type="submit">
                            <i className="fa fa-google"></i> Upload Diagram to Drive
                </Button></Tooltip>&nbsp;

        {/* <div id="auth-status"></div> */}
        <div style={{display:'inline'}}>{this.state.editor}</div>&nbsp;&nbsp;
        <Button variant="outline-dark" onClick={() => this.changeToViewer()}>Testing</Button>&nbsp;
        <Button variant="outline-dark" onClick={() => this.changeToModeler()}>Modeler</Button>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        {/* <script async defer src="https://apis.google.com/js/api.js" 
                onload="this.onload=function(){};handleClientLoad()" 
                onreadystatechange="if (this.readyState === 'complete') this.onload()">
        </script> */}

            </div>
        )
    }
}

const infoStyle = {
    position:'absolute',
    right:'0',
    bottom:'0'
}
const chatstyle = {
    overflowY: "scroll"
}
const buttonStyle = {
    margin: '0 auto'
}

export default BpmnModelerComponent;
