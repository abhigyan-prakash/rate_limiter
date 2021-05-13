import express from 'express';

const router = express.Router();
router.get('/example', (request, response) => {
  response.send('example response');
});

export default router;
