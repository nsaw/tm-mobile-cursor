import { RFValue } from 'react-native-responsive-fontsize';

export const buttonStyles = {
  // Special Bin Card (New Bin, Saved to Sort Later)
  specialBinCard: {
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
    borderRadius: 12, // tokens.radius.md
    borderWidth: 1,
    borderColor: '#3B82F6', // tokens.colors.accent
    paddingTop: 16, // tokens.spacing.sm * 1.34
    paddingBottom: 16, // tokens.spacing.sm * 1.34
    paddingLeft: 30, // tokens.spacing.sm * 2.5
    paddingRight: 30, // tokens.spacing.sm * 2.5
    marginBottom: 16, // tokens.spacing.sm * 1.34
    justifyContent: 'center' as const,
  },
  
  specialBinCardContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
  },
  
  specialBinCardText: {
    fontSize: RFValue(12.5),
    color: '#3B82F6', // tokens.colors.accent
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8,
  },
  
  specialBinCardCount: {
    fontSize: RFValue(12.5),
    color: '#3B82F6', // tokens.colors.accent
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8,
  },
  
  // View More Card
  viewMoreCard: {
    backgroundColor: 'transparent',
    borderRadius: 12, // tokens.radius.md
    paddingTop: 16, // tokens.spacing.sm * 1.34
    paddingBottom: 16, // tokens.spacing.sm * 1.34
    paddingLeft: 30, // tokens.spacing.sm * 2.5
    paddingRight: 30, // tokens.spacing.sm * 2.5
    marginTop: 16, // tokens.spacing.md * 1.34
    borderWidth: 1,
    borderColor: '#3B82F6', // tokens.colors.accent
    height: 70,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  
  viewMoreText: {
    fontSize: RFValue(14),
    color: '#3B82F6', // tokens.colors.accent
    fontWeight: '600' as const,
    fontFamily: 'Ubuntu_600SemiBold',
    opacity: 0.8,
  },
  
  viewMoreCount: {
    fontSize: RFValue(11),
    color: '#6B7280', // tokens.colors.textSecondary
    fontFamily: 'Ubuntu_400Regular',
    opacity: 0.8,
  },
  
  // Archive Card
  archiveCard: {
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
    borderRadius: 12, // tokens.radius.md
    paddingTop: 16, // tokens.spacing.sm * 1.34
    paddingBottom: 16, // tokens.spacing.sm * 1.34
    paddingLeft: 30, // tokens.spacing.sm * 2.5
    paddingRight: 30, // tokens.spacing.sm * 2.5
    marginBottom: 16, // tokens.spacing.sm * 1.34
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: '#D1D5DB', // tokens.colors.border
  },
  
  archiveCardContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
  },
  
  archiveCardText: {
    fontSize: RFValue(12),
    color: '#374151', // tokens.colors.text
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    opacity: 0.8,
  },
}; 