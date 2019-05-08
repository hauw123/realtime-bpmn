import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import Header from './component/layout/Header';
// import logo from './logo.svg';
import './App.css';

//Component
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import BpmnModelerComponent from './component/pages/BpmnModelerComponent';
import BpmnModelerDemo from './component/pages/BpmnModelerDemo';


import About from './component/pages/about';
import Navbar from './component/layout/NavbarTemplate';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Home from './component/pages/home';
import NotFound from './component/pages/notfound';
import NotAuthorized from './component/pages/notauthorize';
import Friend from './component/pages/friend';
import Project from './component/pages/projects';
//import uuid from 'uuid';
//Axios seperti ajax call
//import Axios from 'axios';



class App extends Component {
  state = {
    todos: []
  }
  

  componentDidMount(){

  }

  //Register User

  render() {
    return (
      <Router>      
    <div>
    <Navbar />
    <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/friend" component={Friend} />
      <Route exact path="/about" component={About} />
      <Route exact path="/notfound" component={NotFound} />
      <Route exact path="/notauthorized" component={NotAuthorized} />
      {/* <Route exact path="/user" component={User} /> */}
      <Route exact path="/project" component={Project} />
      <Route exact path="/bpmndiagram/:id" component={BpmnModelerComponent} />
      <Route exact path="/bpmndemo" component={BpmnModelerDemo} />

    </div>
    </Router>


    );
  }

  // render() {
  //   return (
  //     <Router>
  //       <div>
  //         <Navbar />
  //       </div>
  //       <div className="App">
  //         <div className="container">
  //           <Header />
  //           <Route exact path="/" render={props => (
  //             <React.Fragment>
  //               <AddTodo addTodo={this.addTodo} />
  //               <h1>App</h1>
  //               <Todos todos={this.state.todos} markComplete={this.markComplete} delTodo={this.delTodo} />
  //               <User />
  //             </React.Fragment>
  //           )} />
  //           <Route path="/about" component={About} />
  //         </div>
  //       </div>
  //     </Router>

  //   );
  // }
}

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//         </header>
//         <User />
//       </div>
//     );
//   }
// }

export default App;
