'use strict';
var _ = require('lodash');
var Promise = require('bluebird');

var checkVersion = function (template) {
  return new Promise(function (resolve) {
    var errors = [];
    if (!_.has(template, 'AWSTemplateFormatVersion')) {
      errors.push('Missing suggested "AWSTemplateFormatVersion" property');
    } else {
      // Eventually this should allow multilple versions/dates, but this is the
      // only valid value right now.
      // http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
      if (template.AWSTemplateFormatVersion !== '2010-09-09') {
        errors.push(`Invalid value "${template.AWSTemplateFormatVersion}" for AWSTemplateFormatVersion`);
      }
    }
    resolve(errors);
  });
}

module.exports.checkVersion = checkVersion;
