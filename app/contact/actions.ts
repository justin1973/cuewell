"use server";

// Sends a contact message by email (via Resend) to the address in CONTACT_EMAIL.
export async function sendContact(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email.includes("@") || message.length < 5) {
    return { ok: false, error: "Please add your name, a valid email and a short message." };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!key || !to) {
    return { ok: false, error: "unconfigured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Cuewell <hello@cuewell.io>",
        to,
        reply_to: email,
        subject: `Cuewell contact — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) return { ok: false, error: "send_failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "send_failed" };
  }
}
