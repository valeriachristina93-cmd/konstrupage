"use server";

export async function sendToGoogleSheet(data: { name: string; email: string; phone: string; }) {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_SCRIPT_URL;

  if (!scriptUrl) {
    console.error("Google Sheet script URL is not defined in environment variables.");
    return { success: false, message: "Server configuration missing for Google Sheets." };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // Redirect is needed for Google Apps Script web apps
      redirect: 'follow'
    });

    if (response.ok) {
      // It's common for Google Apps Script doPost to return a redirect or a JSON response.
      // We will read the response as text to handle both cases without crashing.
      const responseText = await response.text();
      try {
        const result = JSON.parse(responseText);
         if (result.status === 'success') {
          return { success: true, message: "Data sent to Google Sheet successfully." };
        } else {
          console.error("Google Sheet script returned an error:", result.message);
          return { success: false, message: result.message || "Failed to send data to Google Sheet." };
        }
      } catch (e) {
        // If parsing fails, it might be a redirect HTML page or a simple text response.
        // As long as the response was 'ok', we can consider it a success from the fetch perspective.
        return { success: true, message: "Request sent, but response was not valid JSON." };
      }
    } else {
      return { success: false, message: `Server responded with status: ${response.status}` };
    }
  } catch (error) {
    console.error("Error sending data to Google Sheet:", error);
    return { success: false, message: "An error occurred while sending data to Google Sheet." };
  }
}
