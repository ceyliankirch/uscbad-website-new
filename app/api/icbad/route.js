import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  let debugLog = "Début du scraping global...";
  
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    // =======================================================================
    // 1. EXTRACTION DES RENCONTRES À VENIR (Équipe 1 N1)
    // =======================================================================
    let scrapedMatches = [];
    try {
      const teamRes = await fetch('https://icbad.ffbad.org/equipe/58349', { headers, cache: 'no-store' });
      if (teamRes.ok) {
        const teamHtml = await teamRes.text();
        const $team = cheerio.load(teamHtml);

        $team('tr.clickable-row').each((i, el) => {
          const $tds = $team(el).find('td');
          if ($tds.length >= 6) {
            const dateRaw = $tds.eq(1).text().replace(/\s+/g, ' ').trim(); 
            const location = $tds.eq(2).text().replace(/,\s*$/, '').trim();
            const team1 = $tds.eq(3).text().replace(/\s*\(.*?\)\s*/g, '').trim();
            const score = $tds.eq(4).text().trim();
            const team2 = $tds.eq(5).text().replace(/\s*\(.*?\)\s*/g, '').trim();

            if (score === "0 - 0" || score === "" || score === "-") {
              let dateFormatted = dateRaw;
              let timeFormatted = "À définir";

              const matchDateRegex = dateRaw.match(/Le\s+(.*?)\s+à\s+(.*)/i);
              if (matchDateRegex) {
                const datePart = matchDateRegex[1]; 
                timeFormatted = matchDateRegex[2];  
                const months = ["JAN", "FÉV", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];
                const dateSplit = datePart.split('/');
                if (dateSplit.length === 2) {
                  dateFormatted = `${dateSplit[0]} ${months[parseInt(dateSplit[1], 10) - 1]}`;
                } else {
                  dateFormatted = datePart;
                }
              }
              if (team1 && team2) {
                scrapedMatches.push({
                  date: dateFormatted, time: timeFormatted, home: team1, away: team2,
                  location: location || "Lieu à confirmer",
                  isHome: team1.toUpperCase().includes("CRETEIL") || team1.toUpperCase().includes("CRÉTEIL")
                });
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Erreur scraping rencontres:", e);
    }

    // =======================================================================
    // 2. EXTRACTION DE TOUS LES CLASSEMENTS (Via la page globale du club)
    // =======================================================================
    let rankingN1 = [];
    let rankingEq2 = [];
    let rankingEq3 = [];

    try {
      const clubRes = await fetch('https://icbad.ffbad.org/instance/USC94', { headers, cache: 'no-store' });
      
      if (clubRes.ok) {
        const clubHtml = await clubRes.text();
        const $club = cheerio.load(clubHtml);

        $club('table.classement-poule').each((_, table) => {
          let tempRanking = [];
          let hasEq1 = false;
          let hasEq2 = false;
          let hasEq3 = false;

          $club(table).find('tbody tr').each((i, el) => {
            const $tds = $club(el).find('td');
            if ($tds.length < 11) return; // Ignore l'en-tête

            const rankText = $tds.eq(0).text().trim();
            const nameTextRaw = $tds.eq(2).text().trim(); // Nom de l'équipe
            const playedText = $tds.eq(3).text().trim();  // Matchs Joués
            const ptsText = $tds.eq(10).text().trim();    // Points

            // Identification de l'équipe
            if (nameTextRaw.includes('94-USC-1')) hasEq1 = true;
            if (nameTextRaw.includes('94-USC-2')) hasEq2 = true;
            if (nameTextRaw.includes('94-USC-3')) hasEq3 = true;

            const nameTextClean = nameTextRaw.replace(/\s*\(.*?\)\s*/g, '').trim();

            if (nameTextClean && rankText && !isNaN(parseInt(rankText))) {
              tempRanking.push({
                rank: parseInt(rankText),
                name: nameTextClean,
                played: parseInt(playedText) || 0,
                pts: parseInt(ptsText) || 0,
                isUs: nameTextClean.toUpperCase().includes("CRETEIL") || nameTextClean.toUpperCase().includes("CRÉTEIL")
              });
            }
          });

          // On attribue le tableau récupéré à la bonne équipe, UNIQUEMENT s'il n'a pas déjà été rempli
          // (au cas où il y a deux poules A/B, on prend la première qui est souvent la bonne)
          if (hasEq1 && rankingN1.length === 0) rankingN1 = tempRanking;
          if (hasEq2 && rankingEq2.length === 0) rankingEq2 = tempRanking;
          if (hasEq3 && rankingEq3.length === 0) rankingEq3 = tempRanking;
        });

        debugLog = "Classements extraits avec succès !";
      } else {
        debugLog = `Erreur accès page globale: ${clubRes.status}`;
      }
    } catch (e) {
      console.error("Erreur scraping global:", e);
      debugLog = `Erreur catch: ${e.message}`;
    }

    // =======================================================================
    // 3. RETOUR DE L'API (Avec Fallbacks)
    // =======================================================================
    return NextResponse.json({ 
      success: true, 
      data: {
        rankingN1: rankingN1.length > 0 ? rankingN1 : [
          { rank: 1, name: "BC Chambly Oise", pts: 41, played: 8 },
          { rank: 2, name: "US Créteil", pts: 38, played: 8, isUs: true },
          { rank: 3, name: "Racing Club de France", pts: 35, played: 8 }
        ],
        rankingEq2: rankingEq2.length > 0 ? rankingEq2 : [
          { rank: 1, name: "US Créteil 2", pts: 42, played: 8, isUs: true },
          { rank: 2, name: "Sénart Badminton", pts: 39, played: 8 }
        ],
        rankingEq3: rankingEq3.length > 0 ? rankingEq3 : [
          { rank: 1, name: "Vincennes", pts: 30, played: 8 },
          { rank: 2, name: "US Créteil 3", pts: 28, played: 8, isUs: true }
        ],
        nextMatches: scrapedMatches.length > 0 ? scrapedMatches : [
          { date: "24 MARS", time: "16:00", home: "US CRÉTEIL", away: "FLUME ILLE", location: "Gymnase Casalis", isHome: true }
        ]
      },
      debug: debugLog
    });

  } catch (error) {
    console.error("Erreur serveur API ICBAD:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}