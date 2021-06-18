'use strict';
const { program } = require('commander');

program
    .version('0.0.1')
    .requiredOption('-prf, --project-root-folder <projectRootFolder>', 'Path of the root folder of the project.')
    .parse();

const projectRootFolder = program.opts().projectRootFolder;
const packageJsonRootPath = `${projectRootFolder}/package.json`;

module.exports = { program, projectRootFolder, packageJsonRootPath };