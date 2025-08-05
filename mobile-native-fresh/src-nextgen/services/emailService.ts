export interface EmailTemplate {
  subject: string;
  body: string;
  variables: Record<string, string>;
}

export interface EmailService {
  sendEmail: (to: string, template: EmailTemplate) => Promise<void>;
  sendBulkEmail: (recipients: string[], template: EmailTemplate) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class EmailServiceImpl implements EmailService {
  async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    // Implementation would go here
    console.log(`Sending email to ${to}: ${template.subject}`);
  }

  async sendBulkEmail(recipients: string[], template: EmailTemplate): Promise<void> {
    // Implementation would go here
    console.log(`Sending bulk email to ${recipients.length} recipients: ${template.subject}`);
  }
}

export const emailService = new EmailServiceImpl(); 
