const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const campiRoutes = require('./routes/campi');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto alle API di CampiCalcio Italia' });
});

app.use('/api/auth', authRoutes);
app.use('/api/campi', campiRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});