// importing the express foe api purpose
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// inside this app we have the instance of the express
const app = express();
app.use(express.json());
app.use(cors());
// connecting mongodb
mongoose.connect('mongodb://localhost:27017/todo-app')
    .then(() => {
        console.log("DB is connected");
    })
    .catch((err) => {
        console.log("Error:" + err);
    })
// create schema for mongoose 
const TodoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    desc: String
})

// create model for schema
const TodoModel = mongoose.model('Todo', TodoSchema);    //the model name should be singular//

// creating the route for the app
app.post('/todos', async (req, res) => {
    const { title, desc } = req.body;
    // const newTodo = {
    //     id:todos.length + 1,
    //     title,
    //     desc
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try {
        const newTodo = new TodoModel({ title, desc });
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        console.log("Error:" + error);
        res.status(500).json({ message: error.message });
    }
})

// get all the api
app.get('/todos', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (error) {
        console.log("Error:" + error);
        res.status(500).json({ message: error.message });
    }
});
    
// update todo Item
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, desc } = req.body;
        const id = req.params.id;
        const updateTodo = await TodoModel.findByIdAndUpdate(
            id,
            { title, desc },
            { new: true } //for responing the current db
        )
        if (!updateTodo) {
            return res.status(404).json({ message: "Todo not found" })
        }
        res.json(updateTodo);
    }
    catch (error) {
        console.log("Error:" + error);
        res.status(500).json({ message: error.message });

    }
})

// delete todo items
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await TodoModel.findByIdAndDelete(id);
        res.status(204).end()
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//for start the server
const port = 8000;
app.listen(port, () => {
    console.log("The server is running in the server :" + port);
}) 