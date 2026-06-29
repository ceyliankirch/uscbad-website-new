import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import InscriptionsConfig from '@/models/InscriptionsConfig';

const DEFAULT_CONFIG = {
  saison: 'Saison 2024 - 2025',
  inscriptionLink: 'https://myffbad.fr',
  tarifs: [
    { title: 'Adultes compétiteurs et jeunes > 12 ans', desc: '2 entraînements', price: '260€', badgeColor: '#0065FF', textDark: false },
    { title: 'Adultes compétiteurs et jeunes > 12 ans', desc: '1 entraînement', price: '225€', badgeColor: '#0EE2E2', textDark: true },
    { title: 'Jeunes < 12 ans', desc: '2 entraînements', price: '225€', badgeColor: '#F72585', textDark: false },
    { title: 'Jeunes < 12 ans', desc: '1 entraînement', price: '205€', badgeColor: '#F72585', textDark: false },
    { title: 'Adultes loisirs', desc: '1 entraînement', price: '215€', badgeColor: '#9333EA', textDark: false },
    { title: 'Jeu libre', desc: 'Accès aux créneaux libres sans entraînement encadré', price: '153€', badgeColor: '#94a3b8', textDark: false },
    { title: 'Dirigeant joueur', desc: 'Membres du bureau pratiquants', price: '106€', badgeColor: '#1e293b', textDark: false },
    { title: 'Dirigeant non joueur', desc: 'Membres du bureau non pratiquants', price: '58€', badgeColor: '#1e293b', textDark: false },
  ],
  notes: [
    'Part non remboursable : 78€.',
    'Aucun remboursement ne sera effectué, passées les vacances d\'automne.',
    'Réduction Famille : Remise de 10% pour toute inscription de 3 personnes ou plus d\'un même foyer.'
  ]
};

export async function GET() {
  try {
    await dbConnect();
    let config = await InscriptionsConfig.findOne();
    if (!config) {
      config = await InscriptionsConfig.create(DEFAULT_CONFIG);
    }
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const config = await InscriptionsConfig.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
