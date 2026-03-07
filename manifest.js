export default function manifest() {
  return {
    name: 'US Créteil Badminton',
    short_name: 'USC Bad',
    description: "L'application officielle de l'US Créteil Badminton. Suivez nos actus, nos équipes et vos plannings en temps réel !",
    start_url: '/',
    display: 'standalone', // Cache l'interface du navigateur, comme une vraie app
    background_color: '#040817',
    theme_color: '#081031',
    icons: [
      {
        src: '/assets/ios-logo-uscbad.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/ios-logo-uscbad.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}