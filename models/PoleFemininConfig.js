import mongoose from 'mongoose';

const PoleFemininConfigSchema = new mongoose.Schema({
  hero: {
    badgeText: { type: String, default: "Un projet club fort" },
    title1: { type: String, default: "PÔLE" },
    title2: { type: String, default: "FÉMININ" },
    description: { type: String, default: "L'US Créteil Badminton s'engage pour le développement de la pratique féminine. Un accompagnement dédié pour encourager, rassembler et faire briller nos joueuses." }
  },
  values: {
    type: [{
      icon: { type: String, default: "Heart" },
      title: { type: String, default: "Convivialité" },
      description: { type: String, default: "Un espace de partage et de cohésion." },
      color: { type: String, default: "#F72585" }
    }],
    default: [
      { icon: "Heart", title: "Convivialité", description: "Un espace de partage et de cohésion. Nous créons un environnement bienveillant où chaque joueuse, débutante ou confirmée, trouve sa place.", color: "#F72585" },
      { icon: "Zap", title: "Progression", description: "Des créneaux spécifiques encadrés par nos entraîneurs pour travailler la technique, la tactique de double dames et le mixte.", color: "#0065FF" },
      { icon: "Trophy", title: "Compétition", description: "Des équipes Interclubs féminines dynamiques et un accompagnement soutenu pour celles qui souhaitent se lancer en tournoi individuel.", color: "#0EE2E2" }
    ]
  },
  program: {
    image: { type: String, default: "" },
    badgeTitle: { type: String, default: "Label FFBaD" },
    badgeSubtitle: { type: String, default: "Club Avenir" },
    title1: { type: String, default: "Plus qu'un sport," },
    title2: { type: String, default: "une équipe." },
    description: { type: String, default: "Nous savons que franchir le pas de la compétition ou simplement trouver sa place dans un club peut parfois être intimidant. C'est pourquoi l'US Créteil a structuré un parcours spécifique pour ses adhérentes." },
    feature1Title: { type: String, default: "Créneaux 100% Féminins" },
    feature1Desc: { type: String, default: "Des sessions d'entraînement réservées, encadrées par nos coachs, pour travailler des schémas de jeu spécifiques (double dames, déplacements)." },
    feature2Title: { type: String, default: "Réseau & Marrainage" },
    feature2Desc: { type: String, default: "Les nouvelles joueuses sont accompagnées par des compétitrices expérimentées pour faciliter leur intégration dans la vie du club." }
  },
  testimonial: {
    quote: { type: String, default: "Le pôle féminin m'a permis de prendre confiance en moi sur le terrain. L'ambiance y est exceptionnelle, on s'encourage et on progresse toutes ensemble, de la joueuse loisir à la compétitrice N." },
    authorRole: { type: String, default: "Capitaine Équipe 2" },
    authorSub: { type: String, default: "Joueuse depuis 5 ans au club" }
  },
  cta: {
    title1: { type: String, default: "Prête à rejoindre" },
    title2: { type: String, default: "la team féminine ?" },
    description: { type: String, default: "Que ce soit pour transpirer, vous amuser ou tout gagner en tournoi, il y a une place pour vous à Créteil." },
    buttonText: { type: String, default: "S'inscrire pour la saison" }
  }
}, { timestamps: true });

export default mongoose.models.PoleFemininConfig || mongoose.model('PoleFemininConfig', PoleFemininConfigSchema);