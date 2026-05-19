import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const agendaFile = formData.get('agenda'); // <-- LIGNE MANQUANTE AJOUTÉE ICI

    if (!file) {
      return NextResponse.json({ success: false, error: "Aucun fichier audio reçu." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Clé API Groq manquante dans les variables d'environnement." }, { status: 500 });
    }

    // ====================================================================
    // ÉTAPE 0 : LECTURE DU PDF DE L'ORDRE DU JOUR (Si fourni)
    // ====================================================================
    let agendaText = "";
    if (agendaFile) {
      try {
        const arrayBuffer = await agendaFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Import dynamique pour résoudre l'erreur d'export par défaut avec Turbopack
        const pdfParseModule = await import('pdf-parse');
        const parsePDF = pdfParseModule.default || pdfParseModule;
        
        const pdfData = await parsePDF(buffer);
        agendaText = pdfData.text;
      } catch (pdfErr) {
        console.warn("Erreur lors de la lecture du PDF de l'ordre du jour:", pdfErr);
        // On continue même si le PDF échoue, on ne veut pas bloquer le CR
      }
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
      // On remonte l'erreur exacte de Groq pour Whisper
      throw new Error(`Erreur Whisper: ${transcribeData.error?.message || "Impossible de transcrire l'audio."}`);
    }
    
    const transcript = transcribeData.text;

    // ====================================================================
    // ÉTAPE 2 : GÉNÉRATION DU CR EN JSON STRICT (Llama 3 via Groq)
    // ====================================================================
    const systemPrompt = `Tu es le secrétaire général d'un club de badminton. Ton rôle est de rédiger un compte-rendu clair et structuré à partir d'une transcription audio brute de la réunion.
Tu DOIS IMPÉRATIVEMENT répondre au format JSON valide.
La structure de ton JSON doit être exactement celle-ci :
{
  "title": "Titre généré pour le CR",
  "topics": [
    {
      "theme": "Nom de la thématique (ex: Sportif, Finances, Buvette...)",
      "content": "Un paragraphe résumé des discussions sur ce thème.",
      "decisions": ["Décision actée 1", "Décision actée 2"],
      "actions": ["Action à faire 1 (Responsable)", "Action à faire 2"]
    }
  ]
}
Si aucune décision ou action n'a été prise sur un thème, renvoie un tableau vide [].
Ignore les bruits de fond, les "euh", et les blagues hors sujet.`;

    const userContent = `
${agendaText ? `Voici l'ORDRE DU JOUR PRÉVU (utilise-le pour structurer les thèmes si possible) :\n"""\n${agendaText}\n"""\n\n` : ''}
Voici la TRANSCRIPTION DE LA RÉUNION :\n"""\n${transcript}\n"""\n
Génère le compte-rendu en JSON.`;

    const completionRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', 
        response_format: { type: "json_object" }, // FORCER LE MODE JSON
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.2,
        max_tokens: 3000
      })
    });

    const completionData = await completionRes.json();
    if (!completionRes.ok) {
      throw new Error(`Erreur Groq (Llama 3): ${completionData.error?.message || "Erreur de génération."}`);
    }
    
    const summary = completionData.choices[0].message.content;

    return NextResponse.json({ success: true, transcript, summary });

  } catch (error) {
    console.error("Erreur API Generate CR :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}