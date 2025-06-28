import { RFValue } from 'react-native-responsive-fontsize';

export const typographyTokens = {
  // H1 Title (THOUGHTMARKS)
  title: {
    fontSize: RFValue(16),
    fontWeight: '900' as const,
    fontFamily: 'Ubuntu_700Bold',
    color: '#374151', // tokens.colors.text
    opacity: 0.9,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    flexShrink: 1
  },
  
  // H2 Section Titles
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '600' as const,
    fontFamily: 'Ubuntu_600SemiBold',
    color: '#6B7280', // tokens.colors.textSecondary
    letterSpacing: 0.5,
    opacity: 0.85
  },
  
  // Tagline (NeonGradientText variant)
  tagline: {
    fontSize: RFValue(10),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.8,
    flexShrink: 1
  },
  
  // Filter/Tags Title
  tagsTitle: {
    fontSize: RFValue(10),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular',
    color: '#6B7280', // tokens.colors.textSecondary
    letterSpacing: 0.7,
    textTransform: 'lowercase' as const,
    opacity: 0.8
  },
  
  // Button Text (specialBinCard, viewMoreCard)
  buttonText: {
    fontSize: RFValue(12.5),
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8
  },
  
  // View More Button Text
  viewMoreText: {
    fontSize: RFValue(14),
    fontWeight: '600' as const,
    fontFamily: 'Ubuntu_600SemiBold',
    opacity: 0.8
  },
  
  // View More Count
  viewMoreCount: {
    fontSize: RFValue(11),
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.8
  },
  
  // Archive Card Text
  archiveCardText: {
    fontSize: RFValue(12),
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8
  },
  
  // Body Text
  body: {
    fontSize: RFValue(14),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular'
  },
  
  // Small Text
  small: {
    fontSize: RFValue(12),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular'
  }
}; 