const Message = require("../Message");
var ejs = require('ejs');
const path = require('path');
const User = require('../User');
const { Op } = require("sequelize");

// Post Message
const postMessage = async (req, res, next) => {
    if(req.body.content){
        console.log(req.user)
      const message = await Message.create({
        from_id: req.user.userId,
        to_id: req.body.to,
        message: req.body.content
       })
       return res.json({message})
    }

    res.json(req.body)
  };


const getUserDetail = async(req, res) => {
   

   var data = await User.findByPk(req.params.id)

   var user = {id:data.id,email:data.email,name:data.name}

   

   res.json(user)


  }

 const getMessage = async(req,res)=>{
    const user_id = req.query.user_id;
    // const view =   render('my-message');
    // res.render('my-message');

  
    var user = await User.findByPk(user_id);

    var messages = await Message.findAll({ 
      
      [Op.or]: [
        { 
          from_id:req.user.userId,
          to_id: user_id 
        },
        {
          from_id: user_id ,
          to_id:  req.user.userId
        }
      ]
    });
 
    ejs.renderFile(path.join(__basedir, 'views', 'my-message.ejs'), { user: user,messages: messages }, (err, htmlContent) => {
      if (err) {
          console.log(err)
          return res.status(500).json({ error: "Error rendering template" });
      }

      // Send the rendered HTML as part of the JSON response
      res.status(200).json({
          message: "Here is some HTML content",
          htmlContent: htmlContent
      });
  });
  }
  
module.exports = { postMessage, getUserDetail,getMessage};