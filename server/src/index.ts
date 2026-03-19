import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import sharp from 'sharp';

dotenv.config({ path: '.env.server' });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
    const imageData = req.body?.image as string | undefined;

    if (!prompt && !imageData) {
      res.status(400).json({ error: 'prompt or image is required' });
      return;
    }

    // 사진 업로드한 경우 → 이미지 편집 API 사용
    if (imageData) {
      const base64 = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');

      // 1024x1024 PNG로 변환
      const pngBuffer = await sharp(buffer)
        .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer();

      const { toFile } = await import('openai/uploads');
      const file = await toFile(pngBuffer, 'image.png', { type: 'image/png' });

      const editResult = await openai.images.edit({
        model: 'dall-e-2',
        image: file,
        prompt: `Convert this image into a cute die-cut sticker style. Keep the main subject, add thick white outline, flat vector illustration style, white background, sticker design, no shadow`,
        size: '1024x1024',
      });

      const first = editResult.data?.[0];
      const imageUrl = (first as any)?.url ?? null;
      if (!imageUrl) {
        res.status(502).json({ error: 'No image returned from OpenAI' });
        return;
      }
      res.status(200).json({ dataUrl: imageUrl });
      return;
    }

    // 텍스트 프롬프트만 있는 경우 → 이미지 생성 API 사용
    const model = String(process.env.OPENAI_IMAGE_MODEL ?? 'dall-e-3');
    const result = await openai.images.generate({
      model,
      prompt: `EXACTLY ONE single die-cut sticker of ${prompt}, strictly one item only, front view facing forward, centered, white background, thick white outline, flat vector illustration, no shadow, no text, do not repeat, do not show multiple stickers`,
      size: '1024x1024',
    });

    const first = result.data?.[0];
    const imageUrl = (first as any)?.url ?? null;
    if (!imageUrl) {
      res.status(502).json({ error: 'No image returned from OpenAI' });
      return;
    }
    res.status(200).json({ dataUrl: imageUrl });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Sticker server listening on http://localhost:${port}`);
});
```

저장 후 `sharp`와 `node-fetch` 패키지 설치해야 해요!
```
cd C:\Users\User\Downloads\apps-in-toss-examples-main\with-ai-sticker\server
npm install sharp node-fetch
git add .
git commit -m "Add image edit feature for photo upload"
git push