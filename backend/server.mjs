import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

const createToken = async () => {
  const roomName = 'quickstart-room';
  const participantName = 'quickstart-username';

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    ttl: 600, // 10 minutes in seconds
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return at.toJwt();
}

app.get('/getToken', async (req, res) => {
  try {
    const token = await createToken();
    res.send({ token });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).send('Error creating token');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
