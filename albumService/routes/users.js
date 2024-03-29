var express = require('express');
var router = express.Router();
var cors = require('cors');
var fs = require('fs')


var corsOptions = {
  "origin": "http://localhost:3000",
  "credentials":true
}

var currentUserId = ''

router.get('/init', cors(corsOptions), function(req,res) {
  // add cookies part

  if(req.cookies.id) {
    try {
      var db = req.db
      var userList = db.get('userList')
      userList.find({'_id':req.cookies.id}, {}, function (err,docs) {
        try{
          // userList.find({'_id': docs[0]})
          res.json(docs[0])
        }catch(error) {
          res.json(error)
        }
      })
      res.json(req.cookies.id)
    } catch (err) {
      console.log(err)
    }
  }
})

router.post('/login', cors(corsOptions), function(req,res) {
  var username = req.body.username
  var password = req.body.password

  var db = req.db
  var userList = db.get('userList')
  let checkdocs= ''
  userList.find({'username':username}, {}, function(error, docs) {
    try{
      if (docs[0].password === password){
        res.cookie('userId', docs[0]._id, { maxAge: 360000 });
        currentUserId= docs[0]._id
        res.json(docs[0])
      }else{
        res.json()
      }
    }catch(err){
      console.log(err)
    }
  })
})

router.get('/logout', cors(corsOptions), function(req,res) {
  try{
    currentUserId=''
    res.clearCookie('id')
    res.json("logOut")
  }catch(err){
    res.send(err)
  }
})

router.get('/getAlbum/:userid', cors(corsOptions), function(req, res) {
  var db = req.db
  var photoList = db.get('photoList')

  photoList.find({'userid':req.params.userid}, {}, function(error, docs) {
    try{
      let photo_list=[];
      for(let index in docs){
        photo_list.push({'_id':docs[index]._id, 'url':docs[index].url, 'likedby':docs[index].likedby});
      }
      res.json({'photo_list':photo_list});
    }catch(err) {
      res.json(err)
    }
  })
})

router.get('/getid/:name', cors(corsOptions), function(req,res){
  var db = req.db
  var userList = db.get('userList')
  userList.find({'username':req.params.name},{}, function(error, docs){
    try{
      res.json(docs[0]._id)
    }catch(err){
      res.json(err)
    }
  })
})

router.post('/uploadphoto', cors(corsOptions),function(req, res) {

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // generate a random number
  var randomNumber = getRandomInt(1000, 90000).toString();

  // this is the absolute path for storing the received photo
  var path = "./public/uploads/"+randomNumber+".jpg";

  // call the following function to store the received photo
  req.pipe(fs.createWriteStream(path));

  var db = req.db;
  var photo_list_collection = db.get("photoList");
  
  // update the database
  photo_list_collection.insert({'url':'http://localhost:3002/uploads/'+random_num_str+".jpg", 'userid':currentUserId, 'likedby':[]}, function(error, result){
    if (error === null)
      res.json({'_id':result._id, 'url':result.url});
    else
      res.send({msg:error});
  })
});

router.post('/updatelike', cors(corsOptions), function(req,res){
  var db = req.db
  var photoList = db.get('photoList')
  var photoId = req.body.photoId
  var userId = req.body.userId
  var check = true
  
  photoList.find({'_id': photoId},{}, function (error, photo) {
    try{
      var userList = db.get('userList')
      var likedBy = photo[0].likedby
  

      userList.find({'_id':userId},{},function (e, user) {
  
        likedBy.push(user[0].username)
        // same person cannot like the photo twice
        for( var i=0; i<likedBy.length ; i=i+1){
          if (likedBy[i]===user[0].username){
            check = false
          }
        }

        if(check===true) {
          photoList.update({'_id': photoId}, {
            $set: {
              'url': photo[0].url,
              'userid': photo[0].userid,
              'likedby': likedBy
            }
          }, function (er, docs) {
            try {
              res.json({'likedBy': likedBy})
            } catch (er) {
              res.json(er)
            }
          })
        }
        res.json({'likedBye':likedBy})

      })
    }catch(err){
      res.json(err)
    }
  })
  
})

router.delete('/deletephoto/:photoid',cors(corsOptions), function(req, res) {
  var db = req.db
  var photoList = db.get('photoList')
  var photoId = req.params.photoid
  
  photoList.find({'_id':photoId}, {}, function (err,docs) {
  
    var photo = docs[0].url
    res.json(docs)
    photoList.remove({'url':docs[0].url}, function(err,result){
      var path = "./public/uploads/"+photo.split("/")[photo.split("/").length-1];
      fs.unlink(path, function(err){
        try{
          res.json({'success': 'true'})
        }catch(error){
          res.json(error)
        }
      });
  
    })
  
  })
  
})

router.options("/*", cors());

module.exports = router;