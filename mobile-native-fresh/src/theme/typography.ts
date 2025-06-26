import { RFValue } from 'react-native-responsive-fontsize';

export const typographyTokens = {
  // H1 Title (THOUGHTMARKS)
  title: {
    fontSize: RFValue(16),
    fontWeight: '900' as const,
    fontFamily: 'Ubuntu_700Bold',
    opacity: 0.7,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    flexShrink: 1,
  },
  
  // H2 Section Titles (lowered to 18px)
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: '600' as const,
    fontFamily: 'Ubuntu_600SemiBold',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  
  // H3 Subsection Titles (lowered to 16px)
  subsectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    letterSpacing: 0.3,
    opacity: 0.7,
  },
  
  // Tagline (NeonGradientText variant)
  tagline: {
    fontSize: RFValue(10),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.7,
    flexShrink: 1,
  },
  
  // Filter/Tags Title
  tagsTitle: {
    fontSize: RFValue(10),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular',
    letterSpacing: 0.7,
    textTransform: 'lowercase' as const,
    opacity: 0.7,
  },
  
  // Button Text (specialBinCard, viewMoreCard)
  buttonText: {
    fontSize: RFValue(12.5),
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.7,
  },
  
  // View More Button Text
  viewMoreText: {
    fontSize: RFValue(14),
    fontWeight: '600' as const,
    fontFamily: 'Ubuntu_600SemiBold',
    opacity: 0.7,
  },
  
  // View More Count
  viewMoreCount: {
    fontSize: RFValue(11),
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.7,
  },
  
  // Archive Card Text
  archiveCardText: {
    fontSize: RFValue(12),
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.7,
  },
  
  // Body Text
  body: {
    fontSize: RFValue(14),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.7,
  },
  
  // Small Text
  small: {
    fontSize: RFValue(12),
    fontWeight: '400' as const,
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.7,
  },

  // CTA variants with full opacity and bold Oswald font
  cta: {
    fontSize: RFValue(18),
    fontWeight: '700' as const,
    fontFamily: 'Oswald',
    opacity: 1,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  
  ctaSecondary: {
    fontSize: RFValue(16),
    fontWeight: '700' as const,
    fontFamily: 'Oswald',
    opacity: 1,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
}; 