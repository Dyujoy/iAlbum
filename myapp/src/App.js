import React from 'react';
import './App.css';
import axios from 'axios'
import {connect, useSelector} from 'react-redux'
import $ from 'jquery'
import {signIn, signOut, addFriends, userId} from "./actions";
import SideBar from "./components/SideBar";
import {Router, Route} from 'react-router-dom'
import history from "./history";
import UserAlbum from "./components/UserAlbum";

class App extends React.Component {
    constructor(props){
        super(props)
        this.state={
            username: '',
            password: '',
            user:'',
            friendList: {},
            logInDisp: 'block',
        }
    }

    componentDidMount = async ()=> {
        // add 'http://localhost:3002/init' part
        var result = await axios.get('http://localhost:3002/init')
        result.data
        console.log(result, 'init')

    }

    submit = async () =>{
        console.log('check button')
        var result = await axios.post('http://localhost:3002/login',{
            username: this.state.username,
            password: this.state.password,
        })
        this.setState({
            friendList: result.data.friends
        })

        if (result.data){
            this.setState({
                logInDisp: 'none'
            })
            this.props.signIn(this.state.username)
            this.props.addFriends(result.data.friends)
            this.props.userId(result.data._id)
        }
        console.log(this.state.friendList)
        console.log(result, 'log in')
    }

    logOut=()=>{
        // axios.get('http://localhost:3002/logout')
        //     .then =(response)=> {
        //         this.props.signOut()
        //         console.log('log out')
        //     }.catch=(error)=>{
        //         console.log(error)
        //     }
        console.log('check log out')
        $.ajax({
            url: 'http://localhost:3002/logout',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.props.signOut()
                console.log(data)
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }.bind(this)
        })
    }

    render() {
        return (
            <div>
                <div style={{display: 'none'}}>
                {/*<Router history={history}>*/}
                {/*    <Route path="/album/:id" exact component={UserAlbum}/>*/}
                {/*</Router>*/}
                </div>
                <div className='ui grid'>
                    <div className='six wide column'>
                        <h3 id='iAlbum'>iAlbum</h3>
                    </div>
                    <div className= 'eight wide column'>
                        <div className='ui three column grid' >
                            <div className='column' value={this.state.username} style={{display: this.props.signedIn === true? 'none': 'block'}} onChange={e=> this.setState({username: e.target.value})} >Username: <input type='text'/> </div>
                            <div className='column' value={this.state.password} style={{display: this.props.signedIn === true? 'none': 'block'}} onChange={e=> this.setState({password: e.target.value})} >Password: <input type='text'/> </div>
                            <div className='column' style={{display: this.props.signedIn === true? 'none': 'block'}} id='logIn' >
                                <button onClick={this.submit} type='submit' className='positive ui button' >Log In</button>
                                    {/* <button className='positive ui button' style={{display: this.state.signUpDisp}}>Sign Up</button> */}
                            </div>
                            <div className='column' id='topBar' style={{display: this.props.signedIn === true? 'block': 'none', margin: '25px 0 0 25%'}}>Hello {this.props.name}!</div>
                            <div className='column' id='topBar' style={{display: this.props.signedIn === true? 'block': 'none', margin: '10px 0 5px 0'}}><button className='ui negative button' onClick={this.logOut}>Log Out</button></div>
                        </div>
                        {/*<div className='ui two column grid' style={{display: this.props.signedIn === true? 'block': 'none', }}>*/}

                        {/*</div>*/}
                    </div>
                    {/*<div>*/}
                    {/*    <button className='ui button' onClick={()=> console.log(this.props)}>Props</button>*/}
                    {/*</div>*/}
                    <div className='ui twelve wide column' style={{display: this.props.signedIn === true? 'block': 'none'}}>
                        <SideBar />
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps =(state, ownProps)=>{
    return{
        signedIn: state.auth.signedIn,
        name: state.auth.username,
    }
}


export default connect(mapStateToProps,{
    signIn,
    signOut,
    addFriends,
    userId,
}) (App);