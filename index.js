const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const { Expense } = require('./schema.js')

const app = express()
app.use(bodyParser.json())
app.use(cors())

async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://harinii0807:Jessr1104@cluster0.1twz0hv.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
        console.log('DB connection established')

        const port = process.env.PORT || 8000
        app.listen(port, function() {
            console.log(`Listening on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
        console.log('Couldn\'t establish connection :(')
    }
}
connectToDb()

app.get('/get-expenses', async function(request, response) {
    try {
        const expensesData = await Expense.find()
        response.status(200).json(expensesData)
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not fetch details",
            "error" : error
        })
    }
})

app.post('/add-expense', async function(request, response) {
    try {
        await Expense.create({
            "amount" : request.body.amount,
            "title" : request.body.title,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "success",
            "message" : "entry created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})

app.delete('/delete-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "successfully deleted the entry"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "could not find the entry"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})

app.patch('/update-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await expenseEntry.updateOne({
                "amount" : request.body.amount,
                "title" : request.body.title,
                "date" : request.body.date
            })
            response.status(200).json({
                "status" : "success",
                "message" : "successfully updated the entry"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "could not find the entry"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not update entry",
            "error" : error
        })
    }
})
