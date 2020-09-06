import React from "react";
import {connect, useSelector} from 'react-redux'
import axios from 'axios'
import {albumId} from "../actions";
import $ from "jquery";


class UserAlbum extends React.Component{
    constructor(props){
        super(props)
        this.state={
            photoList: null,
            count: 0,
            showBigPic: false,
            sourceBigPic: null,
            likedBy: null,

        }
    }

    componentDidMount() {
        if (this.props.albumId === null){
            console.log('hello check',this.state.count)
        }
    }


    componentDidUpdate = async (prevProps, prevState, snapshot) =>{
        // count= count+1
        console.log('prestates',prevProps,prevState,snapshot)
        // console.log('states',{this.state.id})
        // if(this.state.count === 0) {
        //     console.log('id', this.props.albumId, this.props)
        //     let result = await axios.get(`http://localhost:3002/getalbum/${this.props.albumId}`)
        //     this.setState({
        //         photoList: result.data.photo_list,
        //         count: this.state.count+1
        //     })
        //     console.log('photolist', this.state.photoList, this.state.count)
        // }
        if (prevProps.albumId !== this.props.albumId){
            console.log('albumID',this.props.albumId)
            let result = await axios.get(`http://localhost:3002/getalbum/${this.props.albumId}`)
            this.setState({
                photoList: result.data.photo_list,
                showBigPic: false
                // count: this.state.count+1
            })
            console.log('photolist', this.state.photoList, this.state.count)
        }
    }

    resetBigPicSrc =()=>{
        this.setState({
            sourceBigPic: null,
            showBigPic: false,
            likedBy: null,
        })
    }

    bigPic = ()=>{
        // this.setState({
        //     showBigPic: true
        // })
        return(
            <div style={{display: this.state.showBigPic===true ? 'none': 'block'}} className='ui big image'>
                {console.log('src',this.state.sourceBigPic)}
                <img src={this.state.sourceBigPic} />
            </div>
        )
    }

    addLike = async (photoId)=>{
        console.log('id:', photoId)
        var result = await axios.post('http://localhost:3002/updatelike',{photoId, 'userId': this.props.userId})
        console.log('likedby', result)
    }

    deletePhoto = async (photoId)=>{
        console.log(photoId)
        var result = await axios.delete(`http://localhost:3002/deletephoto/${photoId}`,)
        console.log('deleted',result)
    }

    showPhotos = ()=>{
        if(this.state.photoList!=null){
            // this.state.photoList.map(photo =>{
            //     return(
            //         <div className='ui small image'>
            //             <img src={photo.url} />
            //             {console.log('photoo',{phot})}
            //         </div>
            //     )
            // })
            // for(var i=0; i<this.state.photoList.length; i=i+1){
            return (
                <div>{
                this.state.photoList.map(photo =>
                     (
                        <div>
                            <div className='three wide column'>
                                {console.log('photo', photo)}
                                <div className='ui small image'
                                     style={{display: this.state.showBigPic === false ? 'block' : 'none'}}>
                                    <img onClick={() => {
                                        this.setState({
                                            sourceBigPic: photo.url,
                                            showBigPic: true,
                                            likedBy: photo.likedby
                                        });
                                    }} src={photo.url}/>
                                    {/*{console.log('photoo',{this.state.photoList})}*/}
                                    {/*{this.state.photoList[i].likedby}*/}
                                    {
                                        photo.likedby.map(friend => {
                                            return (
                                                <div key={friend}
                                                     style={{display: "inline-block"}}>{friend}, &nbsp; </div>
                                            )
                                        })
                                    }
                                    liked this photo! &nbsp;
                                    <button className="mini ui button"
                                            style={{display: this.props.albumId === this.props.userId ? 'inline-block' : 'none'}} onClick={()=> this.deletePhoto(photo._id)}>
                                        DELETE
                                    </button>
                                    <button className="mini ui button"
                                            style={{display: this.props.albumId !== this.props.userId ? 'inline-block' : 'none',}} onClick={()=> this.addLike(photo._id)} >
                                        Like
                                    </button>
                                </div>
                            </div>
                        </div>
                     )
                )}
                </div>
            )
                // return(
                //     <div>
                //     <div className='three wide column'>
                //     <div className='ui small image' style={{display: this.state.showBigPic === false? 'block': 'none'}}>
                //         <img  onClick={()=>{ this.setState({sourceBigPic: this.state.photoList[i].url, showBigPic:true, likedBy: this.state.photoList[i].likedby});  }} src={this.state.photoList[i].url}/>
                //             {/*{console.log('photoo',{this.state.photoList})}*/}
                //         {/*{this.state.photoList[i].likedby}*/}
                //         {
                //             this.state.photoList[i].likedby.map(friend =>{
                //                 return(
                //                     <div key={friend} style={{display: "inline-block"}}>{friend}, &nbsp; </div>
                //                 )
                //             })
                //         }
                //         liked this photo!
                //         <button className="mini ui button" style={{display: this.props.albumId === this.props.userId? 'inline-block': 'none' }} >
                //             DELETE
                //         </button>
                //         <button className="mini ui button" style={{display: this.props.albumId !== this.props.userId? 'inline-block': 'none',  }} >
                //             Like
                //         </button>
                //     </div>
                //     </div>
                //     </div>
                // )
            // }
        }
    }
    uploadPicture=()=>{
        var f = document.getElementById('filePhoto').files[0];
        console.log('photoo',f)

        // var f = document.getElementById('imgFile').files[0];

        if (f) {
            // upload the photo to the server
            $.ajax({
                url: "http://localhost:3002/uploadphoto",
                dataType: 'json',
                data:f,
                type:"POST",
                cache:false,
                contentType: false,
                processData: false,
                // xhrFields: {
                //     withCredentials: true
                // },
                success: function(data) {
                    // if (data._id){
                    if (data){
                        // newly uploaded photo has no likedby and empty friendListring.
                        // var tmp = this.state.userPhotos;
                        // tmp.push({'_id':data._id, 'url':data.url, 'likedby':[], 'friendListString':""});
                        // this.setState({
                        //     userPhotos:tmp
                        // });

                        document.getElementById('filePhoto').value = null;
                        console.log(data)
                    }
                    else{
                        alert(data.msg);
                    }
                }.bind(this),
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("Error upload photo.");
                    alert(xhr.status);
                    alert(thrownError);
                }.bind(this)
            });

        }
        console.log('no photo')
    }

    // uploadPicture = async ()=>{
    //     var photo = document.getElementById('photoFile').files[0]
    //     var response = await axios.post('http://localhost:3002/uploadphoto',{
    //         photo: photo,
    //         userId: this.props.userId
    //     })
    //     console.log(response)
    // }

    render() {
        return(
            <div>
                <div className='ui grid'>
                {/*<button onClick={()=> {this.getAlbum(); console.log(this.props.match.params.id); } }>User Props </button>*/}
                <div className='fourteen wide column' style={{marginLeft: '30px'}}>
                {/*    /!*<button className='ui button' onClick={()=> this.getAlbum()}> Album</button>*!/*/}
                {/*</div>*/}
                    {this.showPhotos()}
                </div>

                </div>
                <ShowBigPic style={{display: this.state.showBigPic===true ? 'none': 'block'}} showBigPic={this.state.showBigPic}  source={this.state.sourceBigPic} resetBigPic={this.resetBigPicSrc} likedBy={this.state.likedBy} />
                {/*{ this.bigPic()} /!*style={{display: this.state.showBigPic===true ? 'none': 'block'}} showBigPic={this.state.showBigPic}  source={this.state.sourceBigPic}/>*!/*/}
                <div className='ui grid'>
                <div className='fourteen wide column'  style={{display: this.props.albumId ===this.props.userId ? 'block': 'none'}}>
                    {/*<input  type='file' style={{bottom: '0', float: 'right', }} id='filePhoto'/>*/}
                    <input type="file" id="filePhoto" style={{bottom: '0', float: 'right' }}/>

                    <button style={{bottom: '0', float: 'right' }} onClick={()=> this.uploadPicture()}>Upload</button>
                </div>
                </div>
                {/*<button className='ui button' onClick={()=> console.log(this.props)}> Props</button>*/}
            </div>
        )
    }
}


// class ShowBigPic extends React.Component{
//     constructor(props){
//         super(props)
//     }
//
//     render() {
//         return(
//             <div className='ui fluid image' style={{display: this.props.showBigPic===true ? 'block': 'none',float:'center'}}>
//                 <button style={{float:"right"}}  >X</button>
//                 <img src={this.props.source} id='bigPicture' />
//             </div>
//         )
//     }
// }

const ShowBigPic =(props)=>{
    // const signedIn = useSelector(state=> state.auth.signedIn)

    const showLikedBy = ()=>{
        if(props.likedBy===null){
            return null
        }
        // props.likedBy.map(friend =>{
        //     return(
        //         <span style={{display: "inline-block"}} key={friend}>{friend},&nbsp;</span>
        //     )
        // })
        var names = []
        for(var i=0; i<=(props.likedBy.length+1);i=i+1){
            return(
                <div style={{display: "inline-block"}} key={props.likedBy[i]}>
                    {i},&nbsp;
                    {console.log(props.likedBy[i])}
                </div>
            )
        }
    }
    return(
        <div className='ui fluid image' style={{display: props.showBigPic===true ? 'block': 'none',float:'center'}}>
            <button style={{float:"right"}} onClick={()=>props.resetBigPic()} >X</button>
            <img src={props.source} id='bigPicture' />
            {console.log('props::',props.likedBy)}
            {
                props.likedBy === null ?   <div></div>:
                props.likedBy.map(friend =>{
                    return(
                        <span style={{display: "inline-block"}} key={friend}>{friend},&nbsp;</span>
                    )
                })
                // showLikedBy()
            //     for(var i=0; i<props.likedBy.length; i=i+1){
            //     return(
            //         <span style={{display: "inline-block"}}>{friend},</span>
            //     )
            // }
            }
            have liked this photo!
        </div>
    )
}

const mapStateToProps = (state)=>{
    return{
        albumId: state.auth.albumId,
        userId: state.auth.userId,
    }
}

export default connect(mapStateToProps) (UserAlbum)