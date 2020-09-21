const { exec } = require("child_process");

const checkIfNotCommitted = require("./check-if-not-committed");

exec(checkIfNotCommitted.BASH_COMMAND, (err, stdout, stderr) => {
  if (err || stderr) {
    console.log(
      "\t",
      "\x1b[31m",
      "[ERROR]",
      "\x1b[0m",
      "Bash command execution is failed!",
      "\n"
    );
    process.exit(1);
  } else {
    const code = checkIfNotCommitted.check(stdout);

    if (code) {
      process.exit(code);
    }
  }
});
