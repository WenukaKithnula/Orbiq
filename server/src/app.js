import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/workspaces', workspaceRoutes);

app.get('/test' , (req,res)=>{

    res.send({message:"working"})
})



export default app;
