const adminService = require("../services/admin.service");

function getAllAdmins(req, res) {
  const admins = adminService.getAllAdmins();
  res.status(200).json(admins);
}

function createAdmin(req, res) {
  const adminData = req.body;
  const newAdmin = adminService.addNewAdmin(adminData);
  res.status(201).json({ status: "Admin added successfully", admin: newAdmin });
}

function deleteAdmin(req, res) {
  const adminId = req.params.id;
  const removedAdmin = adminService.removeAdminById(adminId);
  if (removedAdmin) {
    res.status(200).json({ status: "Admin removed successfully" });
  } else {
    res.status(404).json({ error: "Admin not found" });
  }
}

module.exports = {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
};
