const copyService = require("./service");
const sendEmail = require("../utils/sendEmail");
const registrationEmail = require("../utils/emailTemplates/registrationSuccess");

const copyController = {};

copyController.register = async (req, res) => {
  try {
    const { name, contact, email } = req.body;

    // ✅ Check for existing registration
    const isAlreadyRegistered = await copyService.isExist(email);
    if (isAlreadyRegistered) {
      return res.status(400).send({
        status: false,
        message: "This email is already registered.",
      });
    }

    // ✅ Create new registration
    const registration = await copyService.create({ name, contact, email });

    // ✅ Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: "🎉 Registration Successful - Copy Distribution Drive",
        html: registrationEmail(name),
      });
    } catch (emailError) {
      console.warn(
        "⚠️ Email sending failed but registration succeeded:",
        emailError
      );
    }

    // ✅ Respond success
    return res.status(201).send({
      status: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    console.error("❌ Error in registration:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

copyController.getAll = async (req, res) => {
  try {
    const registrations = await copyService.getAll();
    return res.status(200).send({
      status: true,
      message: "Registrations fetched successfully",
      data: registrations,
    });
  } catch (error) {
    console.error("❌ Error fetching registrations:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = copyController;
