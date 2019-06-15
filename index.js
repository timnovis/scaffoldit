const fs = require('fs');
const exec = require('util').promisify(require('child_process').exec);
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const scaffoldIt = {
  options: {
    repoUrl: '',
    shouldGitInit: false,
  },
  _ask(q) {
    return new Promise(r => readline.question(`${q}: `, r));
  },
  _askBool(q) {
    return new Promise(r => readline.question(`${q} [y/n]: `, a => r(a === 'y')));
  },
  _filesBeHere() {
    return new Promise(resolve => {
      fs.readdir(process.cwd(), (err, files) => {
        resolve(files && files.length > 0);
      });
    });
  },
  _getArguments() {
    return process.argv
      .filter(arg => arg.indexOf('--repo') > -1 || arg.indexOf('--init') > -1)
      .map(arg => ({ argument: arg.split('=')[0], value: arg.split('=')[1] }));
  },
  _findArg(argName) {
    return this._getArguments().find(args => args.argument === argName);
  },
  async _commands({ repoUrl, shouldGitInit }) {
    console.log(`Cloning into ${process.cwd()}...`);

    await exec(`git clone ${repoUrl} .`);
    await exec(`rm -rf .git`);

    if (shouldGitInit) {
      await exec(`git init`);
    }

    console.log('Done!');
  },
  async init() {
    console.log(`
      ################################################
      #  Welcome! This tool will clone a repo,       #
      #  delete the .git directory and optionally    #
      #  set up a new .git directory for you.        #
      ################################################
    `);

    console.log(`Current working directory: ${process.cwd()}\n`);

    const filesExist = await this._filesBeHere();

    if (filesExist) {
      console.warn('\x1b[33m%s\x1b[0m', 'WARNING: You are not in an empty directory!\n');
    }

    const repoArg = this._findArg('--repo');
    const initArg = this._findArg('--init');

    if (repoArg) {
      this.options.repoUrl = repoArg.value;
      console.log(`Repo to clone: ${repoArg.value}`);
    } else {
      this.options.repoUrl = await this._ask('URL to the repository to initialise');
    }

    if (initArg) {
      this.options.shouldGitInit = true;
    } else {
      this.options.shouldGitInit = await this._askBool('Would you like to set up a new git repo?');
    }

    readline.close();

    await this._commands(this.options);
  },
};

scaffoldIt.init();
