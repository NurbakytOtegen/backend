// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')
// const cors = require('cors')
// const bodyParser = require('body-parser')


// mongoose.connect('mongodb://localhost:27017/crud_Users')

// app.use(cors())
// app.use(bodyParser.json())


// app.use('/api/users', require('./api'))


// const PORT = 3001
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`)
// })


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // подключение переменных окружения

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', require('./api'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
