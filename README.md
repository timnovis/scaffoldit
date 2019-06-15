# Scaffold It!

A hacky afternoon node script to automate a common part of my workflow where I have "boilerplate" repos which I use across lots of projects, but I always need to:

- Clone the repo
- `rm -rf .git` the existing git repo
- (optionally) `git init` a new git repo

# Usage

- Install globally from npm like so: `npm i -g @timnovis/scaffoldit`
- Run the command: `scaffoldit`, this will invoke a series of questions
- Alternatively, run with arguments: `scaffoldit --repo=https://url/to/repo --init`
- The `--init` flag will run `git init` at the end
