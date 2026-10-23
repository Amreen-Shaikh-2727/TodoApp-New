
const validateTask = (req, res, next) => {
  const { text, priority } = req.body;

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({
      message: "Task text is required.",
    });
  }

  if (
    priority !== undefined &&
    !["high", "medium", "low"].includes(priority)
  ) {
    return res.status(400).json({
      message: "Priority must be high, medium, or low.",
    });
  }

  req.body.text = text.trim();
  next();
};

module.exports = validateTask;
