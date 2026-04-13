import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Enregistrement de la police Montserrat via CDN pour le PDF
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-700-normal.ttf', fontWeight: 'bold' },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-900-normal.ttf', fontWeight: 'heavy' },
    { src: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-italic.ttf', fontWeight: 'normal', fontStyle: 'italic' },
  ]
});

const styles = StyleSheet.create({
  page: { 
    padding: 40,
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Montserrat',
    lineHeight: 1.4
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
    borderBottom: 2,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 15
  },
  headerLeft: {
    flexDirection: 'column',
    maxWidth: '70%'
  },
  brand: {
    fontSize: 22,
    fontWeight: 'heavy',
    color: '#081031',
    letterSpacing: 1,
    fontStyle: 'italic'
  },
  brandHighlight: {
    color: '#0065FF'
  },
  title: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#F72585',
    marginTop: 8,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  infoRow: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2
  },
  contentContainer: {
    marginTop: 10
  },
  heading1: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#081031', 
    marginBottom: 8, 
    marginTop: 12,
    textTransform: 'uppercase',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4
  },
  heading2: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#0065FF', 
    marginBottom: 6, 
    marginTop: 10 
  },
  paragraph: { 
    fontSize: 10, 
    color: '#334155',
    marginBottom: 6,
    textAlign: 'justify'
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 10
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: '#F72585',
    fontWeight: 'bold'
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    fontSize: 8, 
    color: '#94a3b8', 
    textAlign: 'center', 
    borderTop: 1, 
    borderTopColor: '#f1f5f9', 
    paddingTop: 10
  }
});

export const ReportPDF = ({ title, date, participants, content }) => {
  // Parseur basique pour transformer le Markdown de l'IA en éléments React-PDF
  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <Text key={i} style={styles.heading2}>{trimmed.replace('### ', '')}</Text>;
      } else if (trimmed.startsWith('## ')) {
        return <Text key={i} style={styles.heading1}>{trimmed.replace('## ', '')}</Text>;
      } else if (trimmed.startsWith('# ')) {
        return <Text key={i} style={styles.heading1}>{trimmed.replace('# ', '')}</Text>;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Nettoyage du gras dans les puces
        const cleanBulletText = trimmed.substring(2).replace(/\*\*/g, '');
        return (
          <View key={i} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>{cleanBulletText}</Text>
          </View>
        );
      } else if (trimmed === '') {
        return <View key={i} style={{ height: 6 }} />;
      } else {
        // Nettoyage basique du gras markdown (**) pour l'affichage brut
        const cleanText = trimmed.replace(/\*\*/g, '');
        return <Text key={i} style={styles.paragraph}>{cleanText}</Text>;
      }
    });
  };

  return (
    <Document author="US Créteil Badminton" title={title || "Compte-Rendu"}>
      <Page size="A4" style={styles.page}>
        
        {/* Header du PDF */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brand}>US CRÉTEIL <Text style={styles.brandHighlight}>BADMINTON</Text></Text>
            <Text style={styles.title}>{title || "Compte-Rendu de Réunion"}</Text>
            <Text style={styles.infoRow}>Date : {date}</Text>
            <Text style={styles.infoRow}>Présents : {participants || "Non renseignés"}</Text>
          </View>
        </View>

        {/* Contenu IA Converti */}
        <View style={styles.contentContainer}>
          {renderContent(content)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Ce document est un compte-rendu officiel généré par l'Assistant IA de l'US Créteil Badminton.</Text>
          <Text style={{ marginTop: 2 }}>Gymnase Casalis, 2 Rue du Général Koenig, 94000 Créteil</Text>
        </View>

      </Page>
    </Document>
  );
};

export default ReportPDF;