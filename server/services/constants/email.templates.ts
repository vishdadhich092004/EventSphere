export const templates = {
  registration: {
    subject: `Registration Confirmed: ${event.name}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Registration Confirmed!</h2>
          <p>Hello ${user.name},</p>
          <p>Your registration for <strong>${
            event.name
          }</strong> has been confirmed.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Event Details:</h3>
            <p><strong>Date:</strong> ${new Date(
              event.date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(
              event.date
            ).toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${
              event.description
                ? `<p><strong>Description:</strong> ${event.description}</p>`
                : ""
            }
          </div>
          <p>We look forward to seeing you there!</p>
        </div>
      `,
  },
  cancellation: {
    subject: `Registration Cancelled: ${event.name}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Registration Cancelled</h2>
          <p>Hello ${user.name},</p>
          <p>Your registration for <strong>${
            event.name
          }</strong> has been cancelled.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Event Details:</h3>
            <p><strong>Date:</strong> ${new Date(
              event.date
            ).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(
              event.date
            ).toLocaleTimeString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          <p>We hope to see you at future events!</p>
        </div>
      `,
  },
};
