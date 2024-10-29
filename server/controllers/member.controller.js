const memberService = require("../services/member.service");

function getAll(req, res) {
  const members = memberService.getAllMembers();
  res.status(200).json(members);
}

function createMember(req, res) {
  const memberData = req.body;
  const newMember = memberService.addNewMember(memberData);
  res
    .status(201)
    .json({ status: "Member added successfully", member: newMember });
}

function getVisitHistory(req, res) {
  const memberId = req.params.id;
  const visits = memberService.getVisitHistory(memberId);
  if (visits) {
    res.status(200).json(visits);
  } else {
    res.status(404).json({ error: "Member not found" });
  }
}

module.exports = {
  getAll,
  createMember,
  getVisitHistory,
};
