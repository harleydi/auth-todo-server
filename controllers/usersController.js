const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const userInfo = {
            email: email,
            hashPassword: hash
        }
        const newUser = await new User(userInfo)
        await newUser.save()
        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "error", error: error })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(401).json({ success: false, message: "User or Password does not match" })
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.hashPassword)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "User or Password does not match" })
        }
        const token = jwt.sign({ userId: foundUser._id}, process.env.SECRET_KEY, { expiresIn: '1hr'})

        res.status(200).json({ success: true, token: token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'error', error: error })
    }
}

const validateUser = async(req, res) => {
    try {
        const decodedToken = res.locals.decodedToken
        const findUser = await User.findOne({ _id: decodedToken.userId })

        if(!findUser) {
            return res.status(401).json({ success: false, message: "error", error: { user: "User not found"}})
        }

        res.status(200).json({ success: true, email: findUser.email})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "error", error: error})
    }
}

module.exports = {
    createUser,
    loginUser,
    validateUser
}