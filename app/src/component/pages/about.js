import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Jumbotron, Button} from 'react-bootstrap';

export class about extends Component {
    constructor(){
        super();
        this.state = {
            message : 'Loading....'
        }
    }


  componentWillMount() {

  }

  render() {
    return (
      <div>
                <Jumbotron>
                    <h1><i className='fa fa-laptop'></i> Guide</h1>
                </Jumbotron>
                <div style={divStyle}>
                  <h3>Langkah-langkah dalam menggunakan website : </h3>
                  <Button href="#" variant="outline-primary" size="lg" disabled>
                  Cara penggunaan : 
                </Button>&nbsp;
                <div style={divStyle01}>
                  1. Lakukan <Link to="/login">Login</Link> terlebih dahulu<br></br>
                  2. Klik tab <Link to="/project">My Project</Link><br></br>
                  3. Pilih salah satu dari langkah 4 - 6<br></br>
                  4. Lakukan penambahan project baru dengan <b>| Add Project |</b><br></br>
                  5. Lakukan penambahan project baru dengan menggunakan file dari komputer pribadi <b>| Open Existing Project |</b><br></br>
                  6. Lakukan penambahan project baru dengan menggunakan file dari google drive <b>| Sign in Google |</b> dan pilih file melalui <b>| Open Google Chooser |</b><br></br>
                  7. Klik <b> | Open | </b><br></br>
                </div>
                <Button href="#" variant="outline-primary" size="lg" disabled>
                  Cara collaboration project : 
                </Button>&nbsp;
                <div style={divStyle01}>
                  1. Lakukan penambahan teman dengan klik tab <Link to="/friend">Friends</Link> dan Klik tab <b>| Add Friend |</b><br></br>
                  2. Lakukan pencarian berdasarkan email dan klik <b>| Add |</b><br></br>
                  3. Tunggu hingga friend request diterima<br></br>
                  4. Klik tab <Link to="/project">My Project</Link><br></br>
                  5. Pilih project dan klik <b> | Share | </b><br></br>
                  6. Project akan keluar pada tab <b> | Shared Project |</b> bagi user yang di share
                </div>
                </div>
      </div>
    );
  }
}

const divStyle = {
  marginLeft:'10%'
}

const divStyle01 = {
  marginBottom:'2%',
  marginLeft:'3%'
}

export default about
