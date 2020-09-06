export const signIn =(username)=>{
    return{
        type: 'SIGN_IN',
        payload: username
    }
}

export const signOut =()=>{
    return{
        type: 'SIGN_OUT'
    }
}
export const userId =(userId)=>{
    return{
        type: 'USER_ID',
        payload: userId
    }
}
export const addFriends =(friends)=>{
    return{
        type: 'ADD_FRIENDS',
        payload: friends,
    }
}

export const albumId =(albumId)=>{
    return{
        type: 'ALBUM_ID',
        payload: albumId,
    }
}