import "server-only";

import { sendResendMail } from "./resend";
import { sendSmtpMail, type SmtpMail } from "./smtp";

export type TransactionalMail = SmtpMail;

/**
 * Preferred transport order:
 * 1. Resend, when RESEND_API_KEY is present.
 * 2. Hostinger SMTP fallback, when Resend is not configured.
 */
export async function sendTransactionalMail(mail: TransactionalMail): Promise<boolean> {
  if (process.env.RESEND_API_KEY) {
    return sendResendMail(mail);
  }

  return sendSmtpMail(mail);
}
