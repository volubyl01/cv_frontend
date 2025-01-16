// app/api/background/route.ts
import { NextResponse } from 'next/server';
import huggingFaceApi from '@/lib/axios/huggingface';
import { AxiosError } from 'axios';

interface RequestBody {
  prompt: string;
}

export async function GET() {
  try {
    console.log('Début de la génération d\'image...'); // Debug

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
        body: JSON.stringify({
          inputs: "abstract digital art background, colorful, vibrant, high quality",
        }),
      }
    );

    // Vérifions si la réponse est ok
    if (!response.ok) {
      console.error('Erreur API:', response.status, response.statusText);
      const text = await response.text();
      console.error('Détails:', text);
      throw new Error('Erreur API Hugging Face');
    }

    // La réponse est un buffer d'image
    const imageBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64String}`;

    console.log('Image générée avec succès'); // Debug

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Erreur complète:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Log pour vérifier l'environnement
    console.log('API Token présent:', !!process.env.HUGGINGFACE_API_TOKEN);
    
    const { prompt }: RequestBody = await request.json();
    console.log('Prompt reçu:', prompt);

    // Vérifier que le token est présent
    if (!process.env.HUGGINGFACE_API_TOKEN) {
      throw new Error('Hugging Face API token is missing');
    }

    // Faire la requête avec la structure exacte attendue par l'API
    const response = await huggingFaceApi.post(
      '/models/CompVis/stable-diffusion-v1-4', // Changement de modèle
      {
        inputs: prompt || "abstract digital art background, colorful",
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
          negative_prompt: "blurry, bad"
        }
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'image/png' // Spécifier explicitement qu'on attend une image
        }
      }
    );

    console.log('Réponse reçue, status:', response.status);

    const base64String = Buffer.from(response.data).toString('base64');
    return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${base64String}` });

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Erreur détaillée:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        headers: axiosError.config?.headers,
      }
    });

    // Si l'erreur vient de l'API, essayons de lire le message d'erreur
    let errorMessage = 'Failed to generate image';
    if (axiosError.response?.data) {
      try {
        const errorData = axiosError.response.data;
        errorMessage = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
      } catch (e) {
        console.error('Erreur lors du parsing de l\'erreur:', e);
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: axiosError.response?.status || 500 }
    );
  }
}