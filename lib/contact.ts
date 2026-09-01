export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  lookingFor?: string;
  message: string;
};

export async function submitContactMessage(payload: ContactPayload): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_URL;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to send message");
    }

    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 650));
}
