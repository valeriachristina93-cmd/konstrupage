"use server";

export async function sendToGoogleSheet(data: { name: string; email: string; phone: string; }) {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_SCRIPT_URL;

  if (!scriptUrl) {
    console.error("Google Sheet script URL is not defined in environment variables.");
    // Depending on requirements, you might want to throw an error or just log it.
    // For now, we'll just log it and let the registration continue.
    return { success: false, message: "Server configuration missing for Google Sheets." };
  }

  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);

    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      if (result.result === 'success') {
        return { success: true, message: "Data sent to Google Sheet successfully." };
      } else {
        return { success: false, message: "Failed to send data to Google Sheet." };
      }
    } else {
      return { success: false, message: `Server responded with status: ${response.status}` };
    }
  } catch (error) {
    console.error("Error sending data to Google Sheet:", error);
    return { success: false, message: "An error occurred while sending data to Google Sheet." };
  }
}