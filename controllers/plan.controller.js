const { Plan } = require("../models");

exports.getAllPlans = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const plans = await Plan.findAll({
      where: {
        userId,
      },
    });
    res.status(200).json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch plans", error: err.message });
  }
};

exports.getPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (err) {
    console.error("Error fetching plan:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch plan", error: err.message });
  }
};

exports.createPlan = async (req, res) => {
  const { name, content } = req.body;
   const { id: userId } = req.user;

  try {
    const plan = await Plan.create({ name, content, userId });
    res.status(201).json(plan);
  } catch (err) {
    console.error("Error creating plan:", err);
    res
      .status(500)
      .json({ message: "Failed to create plan", error: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.content) updateData.content = req.body.content;
  

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.update(updateData);
    await plan.save();
    res.status(200).json(plan);
  } catch (err) {
    console.error("Error updating plan:", err);
    res
      .status(500)
      .json({ message: "Failed to update plan", error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.destroy();
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error("Error deleting plan:", err);
    res
      .status(500)
      .json({ message: "Failed to delete plan", error: err.message });
  }
};
