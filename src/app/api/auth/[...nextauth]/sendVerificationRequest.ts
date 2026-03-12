import { createTransport } from "nodemailer";
// We import the Provider type to get access to the server/from properties
import type { EmailConfig } from "next-auth/providers/email";

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: EmailConfig;
}) {
  const { identifier, url, provider } = params;
  const { host } = new URL(url);

  // In v5, provider.server might need a type cast or check
  const transport = createTransport(provider.server as any);

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host }),
  });

  const failed = result.rejected.concat(result.rejected).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

function html(params: { url: string; host: string }) {
  const { url } = params;
  // Your "Classy Choice Varieties Store" template
  return `
    <body style="background: #f9f9f9; padding: 20px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-family: Helvetica, Arial, sans-serif; color: #444;">
            <strong style="font-size: 22px;">Classy Choice Varieties Store</strong>
          </td>
        </tr>
        <tr>
          <td align="center">
            <div style="background: #fff; padding: 40px; border-radius: 10px; width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="font-family: sans-serif;">Click the button below to sign in to your account.</p>
              <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; background-color: #346df1; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">Sign in</a>
            </div>
          </td>
        </tr>
      </table>
    </body>
  `;
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
