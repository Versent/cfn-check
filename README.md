# cfn-check

A command-line tool for validating CloudFormation templates **quickly**.

## Why

[CloudFormation](https://aws.amazon.com/cloudformation/) is great.
Unfortunately, the error handling leaves a bit to be desired.

The [AWS CLI](https://aws.amazon.com/cli/) provided
`[validate-template](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/validate-template.html)` command only
checks your
[syntax](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-validate-template.html), not the actual resources, their properties, etc. This means you can *think* you're successfully creating a new stack, and still get a `CREATE_FAIL`. This tool aims to give you quick feedback so you spend less time banging your head against the CloudFormation Console.

## Usage

    Usage: cfn-check [options] <template>

    Options:

      -h, --help     output usage information
      -V, --version  output the version number
      -w, --watch    Watch template for changes
      -p, --pretty   Print pretty JSON when valid (regardless of character limit)
      -c, --compact  Print compact JSON when valid (regardless of character limit)

### Planned

* `quiet` don't output anything, just set return code.
* `verbose` increase the logging level.

## Checks

* JSON is valid.
* `Ref`s are valid parameters, resources, or [pseudo
  parameters](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html).
* All Resource `Type` properties are valid Types as defined in the [Resource
  Types
  Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html),
  including Custom Resources.

### Planned

* Validate `AWSTemplateFormatVersion`
  * Enforce presence
  * `cfn-check` only validates <= '2010-09-09'
* Output compact JSON if over character limit (51,200 bytes) or requested
* Validate Intrinsic `Fn` arguments
* `Fn`s can only be used in resource properties, metadata attributes, and update
  policy attributes.
* Validate `Resources`
  * Properties
    * Conditional fields
* Error on
  [limit](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)
  violations e.g. UserData length, template length, number of resources, etc
* TAP output https://testanything.org/tap-specification.html
  * Only output errors?

## Resource Properties Definitions

The resource properties definitions are taken from the [CloudFormation User
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

## To Do

* Inline documentation
* Remove all `areValid` tests in favour of CLI-level testing
