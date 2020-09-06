const INITIAL_STATE = {
    signedIn: null,
    username: null,
    friendsList: null,
    userId: null,
    albumId: null,
}

export default (state = INITIAL_STATE, action)=>{
    switch(action.type){
        case 'SIGN_IN':
            return {...state, signedIn: true, username: action.payload }
        case 'SIGN_OUT':
            return {...state, signedIn: false, username: null, friendsList: null}
        case 'ADD_FRIENDS':
            return {...state, friendsList: action.payload}
        case 'USER_ID':
            return{...state, userId: action.payload}
        case 'ALBUM_ID':
            return{...state, albumId: action.payload}
        default:
            return state
    }
}