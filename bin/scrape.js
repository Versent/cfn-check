'use strict';
var xray = require('x-ray')();

const url = 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html';

xray(url, 'body', [{
    type: '.topictitle',
    properties: ['.variablelist dt'],
    descriptions: ['.variablelist dd']
  }])
  .paginate('#next .awstoc[accesskey="n"]@href')
  .limit(170) // The number of AWS Resource Type definitions/pages
  .write('data/resources.json');
