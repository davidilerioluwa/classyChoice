import { SendVerificationRequestParams } from "next-auth/providers/email";
import { createTransport } from "nodemailer";

export async function sendVerificationRequest(
  params: SendVerificationRequestParams,
) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  // NOTE: You can use any email service (Resend, SendGrid, etc.)
  // Here we use Nodemailer to match your current setup
  const transport = createTransport(provider.server);

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

// HTML Email template
function html(params: { url: string; host: string; theme: any }) {
  const { url } = params;
  return `
    <body style="background: #f9f9f9;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-family: Helvetica, Arial, sans-serif; color: #444;">
            <strong style="font-size: 22px;">Classy Choice Varieties Store</strong>
          </td>
        </tr>
        <tr>
          <td align="center">
            <div style="background: #fff; padding: 40px; border-radius: 10px; width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p>Click the button below to sign in to your account.</p>
              <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; background-color: #346df1; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">Sign in</a>
            </div>
          </td>
        </tr>
      </table>
    </body>
  `;
}

// Fallback Text for email clients that don't render HTML
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
