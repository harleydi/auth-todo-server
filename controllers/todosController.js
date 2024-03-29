const Todo = require('../models/Todo')
const User = require('../models/User')

const getAllTodos = async (req, res) => {
    try {
        const user = res.locals.decodedToken.userId
        const allTodos = await Todo.find({ owner: user })
        res.status(200).json({ success: true, data: allTodos })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "error", error: error })
    }
}

const createTodo = async (req, res) => {
    try {
        const user = res.locals.decodedToken.userId
        const todoData = {
            owner: user,
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority
        }
        const newTodo = await new Todo(todoData)
        const savedTodo = await newTodo.save()
        const updateUser = await User.findOneAndUpdate({ _id: user}, {$push: { todos: newTodo._id}})
        await updateUser.save()
        res.status(200).json({ success: true, data: savedTodo })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "error", error: error })
    }
}

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = res.locals.decodedToken
        req.body.lastModified = Date.now()
        if (req.body.completed) {
            req.body.completedDate = Date.now()
        }
        console.log(req.body)
        console.log(userId)
        
        const findTodo = await Todo.findOne({ _id: id })
        console.log(findTodo.owner)
        if (findTodo.owner !== userId) {
            return res.status(401).json({ success: false, message: "Error" })
        }
        const updateTodo = await Todo.findOneAndUpdate({ _id: id}, req.body)
        
        res.status(200).json({ success: true, data: updateTodo })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "error", error: error })
    }
}

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = res.locals.decodedToken
        const findTodo = await Todo.findOne({ _id: id })
        if (findTodo.owner !== userId) {
            return res.status(401).json({ success: false, message: "Error", error: { user: "Not Authorized"}})
        }
        const deleteTodo = await Todo.findOneAndDelete({ _id: id })
        await User.findOneAndDelete({ _id: userId }, {$pull: { todos: id }})

        res.status(200).json({ success: true, data: deleteTodo })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "error", error: error })
    }
}

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo
}