import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: "Aucun fichier audio reçu." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Clé API Groq manquante dans les variables d'environnement." }, { status: 500 });
    }

    // ====================================================================
    // ÉTAPE 1 : TRANSCRIPTION AUDIO (Speech-to-Text avec Whisper via Groq)
    // ====================================================================
    const whisperFormData = new FormData();
    whisperFormData.append('file', file);
    whisperFormData.append('model', 'whisper-large-v3'); 
    whisperFormData.append('response_format', 'json');
    whisperFormData.append('language', 'fr');

    const transcribeRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: whisperFormData
    });

    const transcribeData = await transcribeRes.json();
    if (!transcribeRes.ok) {
      throw new Error(transcribeData.error?.message || "Erreur lors de la transcription audio.");
    }
    
    const transcript = transcribeData.text;

    // ====================================================================
    // ÉTAPE 2 : GÉNÉRATION DU CR (Texte vers Texte avec Llama 3 via Groq)
    // ====================================================================
    const completionRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', 
        messages: [
          {
            role: 'system',
            content: `Tu es le secrétaire d'un club de badminton dynamique. 
Ton rôle est de prendre la transcription brute (et parfois imparfaite) d'une réunion du bureau, et d'en extraire un Compte-Rendu (CR) clair, professionnel et parfaitement structuré en Markdown.
Tu dois inclure : 
- Un Titre pertinent.
- Les points clés abordés (Ordre du jour).
- Les décisions importantes prises.
- Les actions à mener (To-Do list).
Ignore les bruits de fond, les hésitations ("euh", "bah") et les blagues hors sujet. Reste synthétique mais précis.`
          },
          {
            role: 'user',
            content: `Voici la transcription de la réunion :\n\n"${transcript}"\n\nRédige le compte-rendu complet.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2048
      })
    });

    const completionData = await completionRes.json();
    if (!completionRes.ok) {
      throw new Error("Erreur lors de la génération du résumé par l'IA.");
    }
    
    const summary = completionData.choices[0].message.content;

    // Retourne le succès avec le résumé généré
    return NextResponse.json({ success: true, transcript, summary });

  } catch (error) {
    console.error("Erreur API Generate CR :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}