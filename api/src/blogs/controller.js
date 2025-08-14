// const blogService = require("./service");

// const blogController = {};

// blogController.create = async (req, res) => {
//   try {
//     const { title, content, author, tags } = req.body;
//     const image = req.file ? req.file.filename : "";

//     if (!title || !content) {
//       return res.status(400).send({
//         status: false,
//         message: "Title and content are required",
//       });
//     }

//     const blog = await blogService.create({
//       title,
//       content,
//       author,
//       tags: tags ? tags.split(",") : [],
//       image,
//     });

//     return res.status(201).send({
//       status: true,
//       message: "Blog created successfully",
//       data: blog,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ status: false, message: "Internal Server Error" });
//   }
// };

// blogController.getAll = async (req, res) => {
//   try {
//     const blogs = await blogService.getAll();
//     return res.status(200).send({
//       status: true,
//       message: "Blogs fetched successfully",
//       data: blogs,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ status: false, message: "Internal Server Error" });
//   }
// };

// blogController.getById = async (req, res) => {
//   try {
//     const blog = await blogService.getById(req.params.id);
//     if (!blog) {
//       return res.status(404).send({ status: false, message: "Blog not found" });
//     }
//     return res.status(200).send({
//       status: true,
//       message: "Blog fetched successfully",
//       data: blog,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ status: false, message: "Internal Server Error" });
//   }
// };

// blogController.update = async (req, res) => {
//   try {
//     const { title, content, author, tags } = req.body;
//     const image = req.file ? req.file.filename : undefined;

//     const updated = await blogService.update(req.params.id, {
//       title,
//       content,
//       author,
//       tags: tags ? tags.split(",") : [],
//       ...(image && { image }),
//     });

//     if (!updated) {
//       return res.status(404).send({ status: false, message: "Blog not found" });
//     }

//     return res.status(200).send({
//       status: true,
//       message: "Blog updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ status: false, message: "Internal Server Error" });
//   }
// };

// blogController.delete = async (req, res) => {
//   try {
//     const deleted = await blogService.delete(req.params.id);
//     if (!deleted) {
//       return res.status(404).send({ status: false, message: "Blog not found" });
//     }
//     return res.status(200).send({
//       status: true,
//       message: "Blog deleted successfully",
//       data: deleted,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ status: false, message: "Internal Server Error" });
//   }
// };

// module.exports = blogController;
const blogService = require("./service");

const blogController = {};

blogController.create = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    const image = req.files?.image ? req.files.image[0].filename : "";
    const video = req.files?.video ? req.files.video[0].filename : "";

    if (!title || !content) {
      return res.status(400).send({
        status: false,
        message: "Title and content are required",
      });
    }

    const blog = await blogService.create({
      title,
      content,
      author,
      tags: tags ? tags.split(",") : [],
      image,
      video,
    });

    return res.status(201).send({
      status: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

blogController.getAll = async (req, res) => {
  try {
    const blogs = await blogService.getAll();
    return res.status(200).send({
      status: true,
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

blogController.getById = async (req, res) => {
  try {
    const blog = await blogService.getById(req.params.id);
    if (!blog) {
      return res.status(404).send({ status: false, message: "Blog not found" });
    }
    return res.status(200).send({
      status: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

blogController.update = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    const image = req.files?.image ? req.files.image[0].filename : undefined;
    const video = req.files?.video ? req.files.video[0].filename : undefined;

    const updated = await blogService.update(req.params.id, {
      title,
      content,
      author,
      tags: tags ? tags.split(",") : [],
      ...(image && { image }),
      ...(video && { video }),
    });

    if (!updated) {
      return res.status(404).send({ status: false, message: "Blog not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

blogController.delete = async (req, res) => {
  try {
    const deleted = await blogService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ status: false, message: "Blog not found" });
    }
    return res.status(200).send({
      status: true,
      message: "Blog deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

module.exports = blogController;
