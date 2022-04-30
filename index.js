const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts.js');
const conversationRoute = require('./routes/conversations.js');
const messageRoute = require('./routes/messages.js');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URL, () =>
  console.log('Connected to database')
);
//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(process.env.PORT, () => console.log('Server is running'));
