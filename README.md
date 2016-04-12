# cfn-check

## To Do

* eslint setup

## Usage

## Features

### Response

* Output pretty (or compressed) JSON

### Checks

* Validate JSON.
* JSON linting (soft tabs, 2 space indent).
* Ref's are valid parameters or pseudo-parameters.
* Functions (e.g. Fn::Not, etc) have valid arguements
* Resource objects' properties are valid
* Properties' properties are valid

### Testing

The [sampleValidTemplate.json](test/sampleValidTemplate.json) file is taken from
[the sample
templates](https://s3-us-west-2.amazonaws.com/cloudformation-templates-us-west-2/AutoScalingMultiAZWithNotifications.template) that AWS provides.
