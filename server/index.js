import 'dotenv/config';
import cors from 'cors';
import express from 'express';
// import embeddingRouter from './embedding';
import chatCompletionRouter from './chatCompletion.js';

const app = express();
const PORT = 8000;

/* Middlewares */
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// app.use('/', embeddingRouter)
app.use('/chat-completion', chatCompletionRouter);

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})
