const contactService = require("./service");
const sendEmail = require("../utils/sendEmail");
const contactController = {};

contactController.create = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send({
        status: false,
        message: "Name, email, and message are required",
      });
    }

    // DB save
    const contact = await contactService.create({ name, email, message });

    // Auto reply
   await sendEmail({
  to: email.trim(),
  subject: "📩 AV Foundation - Message Received",
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="color: #007BFF;">Hello ${name},</h2>
        <p>Thank you for reaching out to <strong>AV Foundation</strong>. We have successfully received your message and truly appreciate you taking the time to connect with us.</p>
        
        <p>Our team is reviewing your message and will get back to you as soon as possible, typically within <strong>24-48 hours</strong>.</p>
        
        <div style="background: #f1f1f1; padding: 15px; border-left: 4px solid #007BFF; margin: 20px 0; font-style: italic;">
          <strong>Your Message:</strong><br/>
          ${message}
        </div>
        
        <p>If you have any urgent queries, feel free to reply directly to this email.</p>
        
        <p style="margin-top: 30px;">Warm regards,<br/>
        <strong>Team AV Foundation</strong><br/>
        📧 support@avfoundation.com<br/>
        📞 +91 98765 43210</p>
      </div>
    </div>
  `,
});


    res.status(201).send({
      status: true,
      message: "Message saved & email sent",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

contactController.getAll = async (req, res) => {
  try {
    const contacts = await contactService.getAll();
    return res.status(200).send({
      status: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

contactController.getById = async (req, res) => {
  try {
    const contact = await contactService.getById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .send({ status: false, message: "Contact not found" });
    }
    return res.status(200).send({
      status: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

contactController.update = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const updated = await contactService.update(req.params.id, {
      name,
      email,
      message,
    });

    if (!updated) {
      return res
        .status(404)
        .send({ status: false, message: "Contact not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Contact updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

contactController.delete = async (req, res) => {
  try {
    const deleted = await contactService.delete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .send({ status: false, message: "Contact not found" });
    }
    return res.status(200).send({
      status: true,
      message: "Contact deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = contactController;
