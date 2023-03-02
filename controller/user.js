const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');


const getUser = async (req, res) => await User.find();

const saveUser = async (req, res) => {
  const { email, password, role } = req.body;
  // Comprobar si el correo electrónico ya está registrado
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).send({ error: "Email ya está registrado" });
  }

  const newUser = new User({
    email,
    password,
    role,
  });
  const savedU = await newUser.save();
  return res.status(200).json({ savedU });
};

const updateUser = async (req, res) => {
  const { password } = req.body;
  await User.findByIdAndUpdate(
    {
      // id:req.body.id
    },
    {
      $set: {
        password,
      }, 
    },
    {
      new: true,
    }
  );
};

const deleteUser = async (req, res) => await User.deleteById(req.params.id);

const logInUser = async (req, res) => {
  try {
   (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      console.log(errors.array());
      return res.json({ errors: errors.array() })
    };
        
    const {
      body: { email, password },
    } = req;
    
    userLogIn = await User.findOne({ $and: [{ email }, { password }] });
    
    if (userLogIn.length == 0) {
      return res.status(400).json({
        msg: "Correo o contraseña incorrectos",
      });
    }

    const token = sign(
      {
        email: userLogIn.email,
        role: userLogIn.role,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  getUser,
  saveUser,
  updateUser,
  deleteUser,
  logInUser,
};
