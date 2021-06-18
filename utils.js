'use strict';
const fs = require('fs');
const isEmpty = require('lodash/isEmpty');
const { projectRootFolder } = require('./commander');

const sanitizeVersion = (version) => version.replace('^','').replace('~','');

const roundVersion = (version) => (Math.round(parseFloat(version)*100)/100);

const getUpdateStrategyNotation = (version) => version.substr(0, 1);

const getJSONDataFromFile = (path) => {
    if(isEmpty(path)) throw new Error(`Path is required.`);

    const rawData = fs.readFileSync(path);
    const parsedRawData = JSON.parse(rawData);

    if(isEmpty(parsedRawData)) throw new Error(`File ${packageJsonPath} is empty.`);

    return parsedRawData;
}

const writePackageJSONFile = (data) => {
    const parsedPackageData = JSON.stringify(data, null, 2);
    fs.writeFileSync(`${projectRootFolder}/package.json`, parsedPackageData);
}

module.exports = { sanitizeVersion, roundVersion, getJSONDataFromFile, writePackageJSONFile, getUpdateStrategyNotation };