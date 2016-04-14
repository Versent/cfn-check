# cfn-check

## To Do

* Inline documentation

## Usage

    TBC Include cfn-check -h output here

* `filename.json` template's filename (required).
* `watch` watch the tempalte for changes and rerun.
* `quiet` don't output anything, just set return code.
* `verbose` set `debug` level up up up.
* `pretty` always output pretty JSON (regardless of character limit).
* `compact` always output compact JSON (regardless of character limit).

## Features

* JSON is valid.
* `Ref`s are valid parameters, resources, or [pseudo parameters](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html).

* Validate Intrinsic `Fn` arguments
* `Fn`s can only be used in resource properties, metadata attributes, and update
  policy attributes.
* Validate `Resources`
  * Properties
    * Required fields
    * Optional fields
* Validate `AWSTemplateFormatVersion`
  * Enforce presence
  * `cfn-check` only validates <= '2010-09-09'
* TAP output https://testanything.org/tap-specification.html
  * Only output errors?
* Support CSON/YAML input files
* Output (pretty) JSON
* Output compact JSON if over character limit (51,200 bytes) or requested

## Resource Properties Definitions

The resource properties definitions are "borrowed" from the [CloudFormation User
Guide Resource Types
Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).

To update the definitions (stored in [data/resources.json](data/resources.json))
run:

    npm run scrape

## Testing

To run the tests:

    npm test

To watch them:

    npm run test:watch

The [template.json](test/template.json) used in tests is taken from [the sample
templates](https://s3-us-west-2.amazonaws.com/cloudformation-templates-us-west-2/AutoScalingMultiAZWithNotifications.template)
that AWS provides.
