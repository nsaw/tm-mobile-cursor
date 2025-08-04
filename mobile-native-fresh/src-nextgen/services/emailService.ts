export const emailService = {
  sendVerificationCode: async (email: string) => {
    // TODO: Implement actual email verification
    console.log('Email service send verification code:', email);
    return { success: true };
  },
  verifyCode: async (email: string, code: string) => {
    // TODO: Implement actual code verification
    console.log('Email service verify code:', { email, code });
    return true;
  },
}; 
