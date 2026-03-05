import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PresentationConfig from '@/models/PresentationConfig';

export async function GET() {
  try {
    await dbConnect();
    let config = await PresentationConfig.findOne();
    
    // Valeurs par défaut si la config n'existe pas encore
    if (!config) {
      config = await PresentationConfig.create({
        hero: {
          coverImage: "https://images.unsplash.com/photo-1572680511874-98402c5c991f?q=80&w=2070&auto=format&fit=crop",
          badgeText: "Depuis 1982",
          title1: "L'ÂME DU",
          title2: "CLUB",
          description: "Plus qu'un simple club de sport, l'US Créteil Badminton est une véritable famille qui rassemble passionnés, compétiteurs et loisirs autour du même terrain."
        },
        stats: [
          { value: 300, suffix: "+", label: "Licenciés", color: "#0065FF", icon: "Users" },
          { value: 3, suffix: "", label: "Gymnases", color: "#0EE2E2", icon: "MapPin" },
          { value: 1, suffix: "ère", label: "Équipe en N1", color: "#F72585", icon: "Trophy" },
          { value: 3, suffix: "★", label: "Label École", color: "#FFD500", icon: "Shield" }
        ],
        history: {
          title1: "Une ascension", title2: "fulgurante", subtitle: "De l'association locale à la Nationale 1",
          p1: "Fondée au début des années 80, la section Badminton de l'Union Sportive de Créteil s'est imposée comme une référence incontournable en Île-de-France.",
          p2: "Grâce au dévouement de nos bénévoles, entraîneurs et joueurs, le club a gravi les échelons un à un.",
          quote: "Notre force, c'est d'avoir su garder un esprit familial tout en visant l'excellence sportive.",
          img1: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=1000&auto=format&fit=crop",
          img1Num: "1982", img1Text: "Année de création",
          img2: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
          img2Num: "100%", img2Text: "Passion & Dévouement"
        },
        profiles: [
          { title: "Jeunes", subtitle: "Apprendre & Grandir", desc: "Dès 5 ans, notre école labellisée accueille les champions de demain...", img: "https://images.unsplash.com/photo-1526232759533-35d64843063f?q=80&w=1000&auto=format&fit=crop", color: "#FFD500" },
          { title: "Loisirs", subtitle: "Plaisir & Détente", desc: "Envie de décompresser ? Profitez de nos nombreux créneaux...", img: "https://images.unsplash.com/photo-1599474924187-334a4ae593c0?q=80&w=1000&auto=format&fit=crop", color: "#0EE2E2" },
          { title: "Compétition", subtitle: "Challenge & Progrès", desc: "Entraînements dirigés et matchs par équipe...", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop", color: "#0065FF" },
          { title: "Haut Niveau", subtitle: "Performance & Élite", desc: "Le fer de lance du club. Une structure dédiée...", img: "https://images.unsplash.com/photo-1574170685233-a3d8ce3f6406?q=80&w=1000&auto=format&fit=crop", color: "#F72585" }
        ],
        gyms: [
          { title: "Gymnase Casalis", badge: "Gymnase Principal", address: "40 Rue Casalis, 94000 Créteil", tags: ["7 Terrains", "Gradins", "Nationale 1"], mapLink: "https://maps.google.com", img: "https://images.unsplash.com/photo-1541534401786-2077e733015c?q=80&w=2000&auto=format&fit=crop" },
          { title: "Nelson Mandela", badge: "Entraînements & Jeunes", address: "Rue Nelson Mandela, 94000 Créteil", tags: ["5 Terrains", "École de Bad", "Loisirs"], mapLink: "https://maps.google.com", img: "https://images.unsplash.com/photo-1518659727402-901d830c242c?q=80&w=2000&auto=format&fit=crop" }
        ],
        bureau: [
          { name: "Julien Moreau", role: "Président", email: "president@uscbad.fr", phone: "06 12 34 56 78", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop", color: "#0065FF" }
        ],
        coaches: [
          { name: "Alexandre Roux", role: "Head Coach N1", email: "alex@uscbad.fr", phone: "06 56 78 90 12", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop", color: "#F72585" }
        ]
      });
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
    const config = await PresentationConfig.findOneAndUpdate(
      {}, 
      { $set: body }, 
      { upsert: true, returnDocument: 'after' }
    );
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}