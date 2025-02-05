const express = require('express');
const router = express.Router();
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post( '/register', async (req, res) => {
    data = req.body;
    usr = new user(data);

    const salt = bcrypt.genSaltSync(10);
    const cryptedPassword = await bcrypt.hashSync(data.password, salt);
    usr.password = cryptedPassword;

    usr.save()
       .then(
        (savedUser) => {
            res.status(200).send(savedUser);
        }
       )
       .catch(
        (error) => {
            res.status(400).send(error);
        }
       );
});

router.post( '/login', async (req, res) => {
    data = req.body;
    usr = await user.findOne({email: data.email});

    if(!usr) {
        res.status(404).send("email or password invalid!");
    }else {
        validatePass = bcrypt.compareSync(data.password, usr.password);
        if(!validatePass) {
            res.status(404).send("email or password invalid!");
        }else {
            payload = {
                _id: usr._id,
                email: usr.email,
                firstName: usr.firstName
            }
            token = jwt.sign(payload, 'c17471Abdou&');
            res.status(200).send({mytoken: token});
        }
    }

});

router.post( '/addUser', (req, res) => {
    data = req.body;
    usr = new user(data);
    usr.save()
       .then((userData) => {
        res.send(userData);
       })
       .catch((err) => {
        res.send(err);
       });
});

router.post( '/addUserAsyncAwait', async (req, res) => {
    try {
        data = req.body;
        usr = new user(data);

        savedUser = await usr.save();
        res.send(savedUser);
    }catch(err) {
        res.send(err);
    }
});

router.get( '/getall' , (req, res) => {
    user.find()
        .then(
            (users) => {
                res.send(users);
            }
        )
        .catch(
            (err) => {
                res.send(err);
            }
        );
});

router.get( '/getallAsyncAwait', async(req, res) => {
    try {
        users = await user.find();
        res.send(users);
    }catch(err) {
        res.send(err);
    }
});

router.get( '/getUserById/:id', (req, res) => {
    userId = req.params.id;
    
    user.findById(userId)
        .then(
            (user) => {
                res.send(user);
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
});

router.get( '/getUserByIdAsyncAwait/:id', async (req, res) => {
    try {
      userId = req.params.id;
      usr = await user.findById(userId);
      res.send(usr);
    } catch (error) {
        res.send(error);
    }
});

router.put( '/update/:id' , (req, res) => {
    userId = req.params.id;
    newUserInfos = req.body;

    user.findByIdAndUpdate(userId, newUserInfos)
        .then(
            (userUpdated) => {
                res.send(userUpdated);
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
    
});

router.put( '/updateAsyncAwait/:id', async (req, res) => {
    try {
       userId = req.params.id;
       newUserInfos = req.body;
       
       userUpdated = await user.findByIdAndUpdate(userId, newUserInfos);

       res.send(userUpdated);
    } catch (error) {
        res.send(error);
    }
});

router.delete( '/deleteUser/:id' , (req, res) => {
    userId = req.params.id;
    user.findByIdAndDelete(userId)
        .then(
            () => {
                res.send("user deleted successfully");
            }
        )
        .catch(
            (error) => {
                res.send(error);
            }
        )
});

router.delete( '/deleteUserAsyncAwait/:id', async (req, res) => {
    try {
       userId = req.params.id;
       await user.findByIdAndDelete(userId);
       res.send("user deleted successfully"); 
    } catch (error) {
       res.send(error); 
    }
});

module.exports = router;