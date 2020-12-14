const BASH_COMMAND = "git status | grep 'modified:' | wc -l";

const check = (stdout) => {
  const modifiedFileSize = Number(stdout);
  const code = modifiedFileSize > 0 ? 1 : 0;

  if (code) {
    console.log(
      '\t',
      '\x1b[31m',
      '[ERROR]',
      '\x1b[0m',
      'You have uncommitted files, please commit your changes!',
      '\n',
    );
  }

  return code;
};

module.exports = { BASH_COMMAND, check };
