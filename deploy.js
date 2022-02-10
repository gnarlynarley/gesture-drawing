const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const publish = promisify(require("gh-pages").publish);
const { build } = require("vite");

(async () => {
  try {
    await rimraf("dist");
    await build();
    await publish("dist");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
