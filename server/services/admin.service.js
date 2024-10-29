const memberDb = require("../db/member.db");

function getAllAdmins() {
  return memberDb.getAllAdmins();
}

function addNewAdmin(data) {
  const newAdmin = { id: Date.now().toString(), ...data };
  return memberDb.addAdmin(newAdmin);
}

function removeAdminById(id) {
  return memberDb.removeAdmin(id);
}

module.exports = {
  getAllAdmins,
  addNewAdmin,
  removeAdminById,
};
