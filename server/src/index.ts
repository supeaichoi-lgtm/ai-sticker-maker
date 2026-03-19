import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';

// Load env from `.env.server` (preferred), fallback to `.env`
dotenv.config({ path: '.env.server' });
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

const openai = new OpenAI({
  apiKey: requireEnv('OPENAI_API_KEY'),
});

app.post('/api/sticker', async (req, res) => {
  try {
    const prompt = String(req.body?.prompt ?? '').trim();
    if (!prompt) {
      res.status(400).json({ error: 'prompt is required' });
      return;
    }

    const model = String(process.env.OPENAI_IMAGE_MODEL ?? 'dall-e-2');

    const result = await openai.images.generate({
      model,
      prompt: `single sticker design of ${prompt}, front view, facing forward, centered composition, transparent background, thick white outline, flat vector illustration, no shadow, no background, one single item only, die-cut sticker style`,
      size: '512x512',
    });

   const first = result.data?.[0];
    const imageUrl = (first as any)?.url ?? null;
    if (!imageUrl) {
      res.status(502).json({ error: 'No image returned from OpenAI' });
      return;
    }
    res.status(200).json({
      dataUrl: imageUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // Intentionally minimal log for beginners
  // eslint-disable-next-line no-console
  console.log(`Sticker server listening on http://localhost:${port}`);
});

