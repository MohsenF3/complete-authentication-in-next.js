import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { activationTemplate } from "./activation";

interface SendMailProps {
  to: string;
  subject: string;
  body: string;
}

export const sendMail = async ({ to, subject, body }: SendMailProps) => {
  const { SMTP_EMAIL, SMTP_GMAIL_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_GMAIL_PASSWORD,
    },
  });

  try {
    const result = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.error(error);
  }
};

export const compileActivationTemplate = (name: string, url: string) => {
  const template = Handlebars.compile(activationTemplate);

  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};
