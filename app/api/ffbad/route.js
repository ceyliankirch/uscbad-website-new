import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const licence = searchParams.get('licence');

    if (!licence) {
      return NextResponse.json({ success: false, error: "Numéro de licence manquant." }, { status: 400 });
    }

    // =========================================================================
    // NOTE TECHNIQUE :
    // L'API officielle de MyFFBaD/Poona nécessite une authentification ou un token.
    // Pour l'instant, on simule une réponse de classement dynamique basée sur 
    // la longueur et les caractères de la licence pour que le front-end fonctionne.
    // =========================================================================

    // Logique de simulation pour avoir des résultats variés selon la licence saisie
    const firstChar = licence.charAt(0).toUpperCase();
    const lastNum = parseInt(licence.charAt(licence.length - 1)) || 0;
    
    let simple = 'NC';
    let double = 'NC';
    let mixte = 'NC';

    if (firstChar >= 'A' && firstChar <= 'H') {
      simple = 'R' + (Math.max(4, lastNum % 6 + 4)); // Entre R4 et R9
      double = 'D' + (Math.max(7, lastNum % 3 + 7)); // Entre D7 et D9
      mixte = 'R' + (Math.max(5, lastNum % 5 + 5));  
    } else if (firstChar >= 'I' && firstChar <= 'P') {
      simple = 'N' + (Math.max(1, lastNum % 3 + 1)); // Entre N1 et N3
      double = 'N' + (Math.max(1, lastNum % 3 + 1)); 
      mixte = 'N' + (Math.max(2, lastNum % 3 + 2));  
    } else {
      simple = 'D' + (Math.max(7, lastNum % 3 + 7)); // Entre D7 et D9
      double = 'P' + (Math.max(10, lastNum % 3 + 10)); // Entre P10 et P12
      mixte = 'D' + (Math.max(8, lastNum % 2 + 8)); 
    }

    // On simule un léger délai réseau pour l'UX
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      success: true, 
      rankings: { 
        simple, 
        double, 
        mixte 
      } 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des données FFBaD." }, { status: 500 });
  }
}