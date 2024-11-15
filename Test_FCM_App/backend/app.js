import express from 'express';
import fcmRoutes from './fcmRoutes.js';

const app = express();

import cors from 'cors';

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/fcm',fcmRoutes);

app.get('/', (req, res) => {
  console.log("HOME!!!!!!!!!!!!!!!!");

  res.json({message:'Hello World!!', magicNumber: 24})
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})