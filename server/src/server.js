const { app, connectDb } = require("./app");

const PORT = process.env.PORT || 4000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("DB connection failed", e);
    process.exit(1);
  });
