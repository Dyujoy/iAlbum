import React, {useEffect, useState} from "react";
// import React from "react";
import {useSelector, useDispatch} from "react-redux";
import UserAlbum from "./UserAlbum";
import {Link, Router, Route, Switch} from "react-router-dom";
import {albumId} from "../actions";
import history from "../history";
import axios from 'axios'

const SideBar =()=>{
    // const [username,setUsername] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [preActive,setPreActive] = useState('')
    const dispatch = useDispatch()
    let username = useSelector(state=> state.auth.username)
    let userId = useSelector(state=> state.auth.userId)
    let albumIdSelect = useSelector(state=> state.auth.albumId)

    // let friendsList = ['My Album']
    let friendsList =   useSelector(state=> state.auth.friendsList)
    var preActiveItem = username
    useEffect(()=>{
        setPreActive(username)
        activate(preActive)
        setCurrentUser(username)
        dispatch(albumId(userId))
        console.log('pre pre active',preActiveItem, preActive,userId)
    },[username,userId])
    useEffect(()=>{
        setPreActive(currentUser)
        console.log('pre pre pre active',preActiveItem, preActive, currentUser)
    },[currentUser])

    const activate = async (name)=>{
        // let result = await axios.get(`localhost:3002/getid/${name}`)
        if (!name || !preActiveItem){
            return
        }

        let result = await axios.get(`http://localhost:3002/getid/${name}`)
        console.log('preactive',preActiveItem, preActive, name)
        console.log(result.data)
        dispatch(albumId(result.data))
        document.getElementById(preActive).className = 'item'
        preActiveItem = name
        document.getElementById(name).className = 'active item'
    }

    return(
        <div>
            <div className='ui grid'>
                <div className="five wide column" >
                    <div className="ui vertical fluid tabular menu">
                        {/*<Router history={history}>*/}
                        {/*<Switch >*/}
                        {/*    /!*<Route path="/" exact component={StreamList}/>*!/*/}

                        {/*    <Route style={{display: 'none'}} path="/album/:id" exact component={UserAlbum}/>*/}
                        {/*</Switch>*/}
                        {/*<Link to={`/album/${userId}`} className='active item' value={username} id={username} onClick={(e)=> {console.log(e.target.getAttribute('id')); activate(e.target.getAttribute('value'))}}>*/}
                        <div className='active item' value={username} id={username} onClick={(e)=> {setCurrentUser(username); console.log(e.target.getAttribute('id')); activate(e.target.getAttribute('value')); }}>
                            My Album
                        </div>
                        {/*<div className='item' value='Pics' id='Pics' onClick={(e)=> activate(e.target.getAttribute('id'))}>*/}
                        {/*    Pics*/}
                        {/*</div>*/}
                        { friendsList=== null? <div> </div> : friendsList.map(friend =>{
                            return(
                                <div className='item' key={friend} id={friend} value={friend} onClick={(e)=> {setCurrentUser(friend);activate(e.target.getAttribute('value'));}}>
                                    {friend}'s Album
                                    {console.log('friends:',friend)}
                                </div>
                            )
                        })
                        }
                        {/*</Router>*/}
                    </div>
                </div>
                <div className='eleven wide column'>
                    <UserAlbum/>
                </div>
            </div>

        </div>
    )
}


export default SideBar