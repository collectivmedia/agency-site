import { connect } from "cloudflare:smtp";

export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const smtp = connect({
    hostname: context.env.SMTP_HOST,
    port: Number(context.env.SMTP_PORT),
    username: context.env.SMTP_USERNAME,
    password: context.env.SMTP_PASSWORD,
    secure: true
  });

  const body = `
New contact form submission from collectivmedia.net:

Name: ${name}
Email: ${email}

Message:
${message}
  `;

  await smtp.send({
    from: context.env.FROM_EMAIL,
    to: context.env.TO_EMAIL,
    subject: "New Contact Form Submission",
    content: body
  });

  return Response.redirect("/contact.html?sent=1", 302);
}
