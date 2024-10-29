const memberDb = require("../db/member.db");

function getAllMembers() {
  return memberDb.getAllMembers();
}

function addNewMember(data) {
  const newMember = { id: Date.now().toString(), ...data, visits: [] };
  return memberDb.addMember(newMember);
}

function getVisitHistory(memberId) {
  const member = memberDb.getMemberById(memberId);
  return member ? member.visits : null;
}

module.exports = {
  getAllMembers,
  addNewMember,
  getVisitHistory,
};
