import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import { emptyBpmn } from '../assets/empty.bpmn.js';
import Chat from './chatroomdemo.js'
import { Button } from 'react-bootstrap';
import RestrictionModules from './Restriction';
import $ from 'jquery';
import Moment from 'moment';
import Tooltip from "react-simple-tooltip";

import canvg from 'canvg-browser';


var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/drive';

class BpmnModelerDemo extends Component {


    modeler = null;

    componentDidMount = () => {
        this.modeler = new BpmnModeler({
            container: '#bpmnview',
            keyboard: {
                bindTo: window
            },
            additionalModules: [
                RestrictionModules
            ]
        });

        this.newBpmnDiagram();
        this.handleClientLoad();

    }

    componentWillMount() {

    }


    newBpmnDiagram = () => {
        this.openBpmnDiagram(emptyBpmn)
    }

    openBpmnDiagram = (xml) => {
        this.modeler.importXML(xml, (error) => {
            if (error) {
                return console.log('fail import xml');
            }

            var canvas = this.modeler.get('canvas');

            canvas.zoom('fit-viewport');

        });
    }
    
    DownloadImage = (i) => {
        var _this = this;
        console.log(i)

        this.modeler.saveSVG(function (err, svg) {
            if (err) console.log(err)
            _this.setState({ datasvg: svg }, function () {
                console.log(this.state.datasvg)
                const canvas = _this.refs.canvasforimage;
                console.log(canvas)

                const options = {
                    log: false,
                    ignoreMouse: true
                };

                canvg(canvas, this.state.datasvg, options);

                
                if (i == 1) {
                    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    const element = document.createElement("a");
                    element.setAttribute('download', 'diagram.png');
                    element.setAttribute('href', image);
                    element.click();
                }
                else if (i == 2) {
                    const image = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
                    const element = document.createElement("a");
                    element.setAttribute('download', 'diagram.jpg');
                    element.setAttribute('href', image);
                    element.click();
                }
                else if (i == 3) {
                    const image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                    const element = document.createElement("a");
                    element.setAttribute('download', 'diagram.jpeg');
                    element.setAttribute('href', image);
                    element.click();
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

                setTimeout(function () { // necessary for Chrome
                    win.print();
                    win.close();
                }, 0);
            })
        })
    }

    DownloadDiagram = () => {
        var _this = this;
        this.modeler.saveXML({ format: true }, function (error, xml) {
            if (error) {
                return;
            }
            const element = document.createElement("a");
            const file = new Blob([xml], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "diagram.bpmn";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        });


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
              });
        }
    }

    render = () => {
        return (
            <div id="bpmncontainer">
            <div style={chatstyle} id="propview" style={{ width: '25%', height: '93vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}><Chat /></div>
            <div id="bpmnview" style={{ width: '75%', height: '90vh', float: 'left' }}></div>

            <canvas hidden  ref="canvasforimage" id="canvasforimage"></canvas>


            <Tooltip background="white" color="black"  radius ="50" content="Download diagram ke komputer pribadi">                
                <Button
                    onClick={this.DownloadDiagram}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-download"> Diagram</i>
                </Button>
                </Tooltip>&nbsp;

                <Tooltip background="white" color="black" radius ="50" content="Download gambar dengan format PNG">    
                <Button
                    onClick={() => this.DownloadImage(1)}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> PNG
                </Button>
                </Tooltip>&nbsp;

                <Tooltip background="white" color="black"  radius ="50" content="Download gambar dengan format JPG">    
                <Button
                    onClick={() => this.DownloadImage(2)}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> JPG
                </Button>
                </Tooltip>&nbsp;

                <Tooltip background="white" color="black" radius ="50" content="Download gambar dengan format JPEG">    
                <Button
                    onClick={() => this.DownloadImage(3)}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> JPEG
                 </Button>
                 </Tooltip>&nbsp;

                 <Tooltip background="white" color="black"  radius ="50" content="Print diagram">    
                 <Button
                    onClick={() => this.Print()}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-picture-o"></i> Print
                 </Button>
                 </Tooltip>&nbsp;


        <Tooltip background="white" color="black"radius ="50" content="Login untuk upload">    
        <Button variant="outline-dark" id="sign-in-or-out-button">Sign In/Authorize Google</Button></Tooltip>&nbsp;
        
        <Tooltip background="white" color="black"radius ="50" content="Hapus akses website untuk upload">   
        <Button variant="outline-dark" id="revoke-access-button"><i className="fa fa-google"></i> Revoke access</Button></Tooltip>
        
        <Tooltip background="white" color="black"radius ="50" content="Upload diagram">   
        <Button
                    id="UploadDrive"
                    hidden
                    onClick={() => this.UploadFiles()}
                    variant="outline-dark"
                    type="submit">
                    <i className="fa fa-google"></i> Upload Diagram to Drive
        </Button></Tooltip>&nbsp;

        <div id="auth-status"></div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script async defer src="https://apis.google.com/js/api.js" 
                onload="this.onload=function(){};handleClientLoad()" 
                onreadystatechange="if (this.readyState === 'complete') this.onload()">
        </script>


        </div>
        )
    }
}

const chatstyle = {
    overflowY: "scroll"
}

export default BpmnModelerDemo;
