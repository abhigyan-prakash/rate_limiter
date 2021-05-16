import express from 'express';

const router = express.Router();
router.get('/example', (request, response) => {
  response.json({ status: 'success', message: 'example response' });
});

export default router;
