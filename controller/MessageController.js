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
      where: {
        from_id: {
          [Op.or]: [req.user.userId , user_id],
        },
        to_id: {
          [Op.or]: [req.user.userId , user_id],
        },
     
        
        
      },
     
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

  const searchUser = async (req,res) => {
      var search = req.query.search;
      var users = await User.findAll({
        where: {
          [Op.not]: {
            id: req.user.userId,
          },
          name: { [Op.like]: `%${search}%` },
        },
      });

      ejs.renderFile(path.join(__basedir, 'views', 'search.ejs'), { users: users }, (err, htmlContent) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Error rendering template" });
        }
  
        // Send the rendered HTML as part of the JSON response
        res.status(200).json({
        
            htmlContent: htmlContent
        });
      });
     
  }
  
module.exports = { postMessage, getUserDetail,getMessage,searchUser};