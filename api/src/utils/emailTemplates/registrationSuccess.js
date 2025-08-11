const registrationEmail = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #4a90e2; padding: 20px; color: #ffffff; text-align: center;">
          <h1 style="margin: 0;">Your Store Foundation</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333;">Hello, ${name} 👋</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for registering with <strong>Your Store</strong>!
          </p>
          <p style="font-size: 16px; color: #555;">
            We're thrilled to welcome you to our family. As a member of the <strong>Acharya Vidhyasagar Foundation</strong>,
            you now have access to exclusive deals, early product launches, and more.
          </p>
          <p style="font-size: 16px; color: #555;">
            🎉 Start exploring and enjoy shopping with confidence.
          </p>
          <br/>
          <p style="font-size: 16px; color: #555;">
            If you have any questions or need support, feel free to reach out.
          </p>
          <br/>
          <p style="font-size: 16px; color: #555;">
            Best wishes,<br/>
            <strong>AV Foundatione</strong>
          </p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #999;">
          © ${new Date().getFullYear()} AV Foundation. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

module.exports = registrationEmail;
