const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.getUserInfo = async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing or invalid" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
  
      if (!user) return res.status(404).json({ error: "User not found" });
  
      const { password, ...userData } = user.toJSON(); // Remove password
      res.json({ user: userData });
    } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ error: "Invalid or expired token" });
    }
};

// exports.updateUser = async (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Authorization token missing or invalid" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findByPk(decoded.id);

//     if (!user) return res.status(404).json({ error: "User not found" });

//     const allowedFields = [
//       'name', 'bio', 'primary_genre', 'website_url', 
//       'social_media_url', 'availability', 'profile_image'
//     ];

//     // Only update fields the user sent
//     for (const key of Object.keys(req.body)) {
//       if (allowedFields.includes(key)) {
//         user[key] = req.body[key];
//       }
//     }

//     // Optional: Check if profile is now complete
//     const fieldsToCheck = ['name', 'bio', 'primary_genre', 'availability', 'profile_image'];
//     const isComplete = fieldsToCheck.every(field => !!user[field]);
//     user.is_profile_complete = isComplete;

//     await user.save();

//     const { password, ...userData } = user.toJSON();
//     res.json({ message: "User updated successfully", user: userData });
//   } catch (err) {
//     console.error("Update failed:", err);
//     res.status(400).json({ error: "Failed to update user" });
//   }
// };
