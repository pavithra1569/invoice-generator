const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4100;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Invoice-generator', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MONGO DB IS CONNECTED");
})
.catch((err) => {
    console.error("DB connection error:", err);
});

// Invoice Schema and Model
const invoiceSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    amount: {
        required: true,
        type: Number
    },
    dueDate: {
        required: true,
        type: Date
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Invoice Routes
app.post('/invoices', async (req, res) => {
    const { title, description, amount, dueDate } = req.body;
    try {
        const newInvoice = new Invoice({ title, description, amount, dueDate });
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/invoices/:id', async (req, res) => {
    const { title, description, amount, dueDate } = req.body;
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { title, description, amount, dueDate },
            { new: true }
        );
        res.json(updatedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/invoices/:id', async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.status(202).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ Auth Routes — ensure this path matches frontend
const authRoutes = require('./routes/auth');
app.use('/', authRoutes); // register, login, logout, profile

// Server Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
