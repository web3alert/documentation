# Blocks

The Pipeline Processor has a built-in set of blocks that can be used when configuring a Pipeline. Here is a list describing these basic blocks.

## Accumulate

A block that makes it possible to accumulate data in the state. It is used, for example, to detect changes between old and new data.

### Params

**state**: `object | undefined`  
Specifies what data should be saved in the state after this **process** execution.

**output**: `object | object[] | undefined`  
Specifies what data should be produces as output after this **process** execution.

### Output

The value of `params.output`.

## Filter

A block that is used to filter the output data of the previous block in the pipeline according to a given expression.

#### Params

**expr**: `boolean`  
Parameter describing the expression by which the data should be passed through. Should return boolean value, but any truthy or fasly value is also ok.

#### Output

If the expression is evaluated to a truthy valye, it will produce the same object as was the `input`. If not, it produce nothing.

## Request

The block executes any given HTTP request.

### Params

**method**: `string`  
HTTP method – `GET`, `POST`, etc.

**url**: `string`  
URL where the HTTP request will be sent.

**headers**: `Record<string, string>` _(optional)_  
Headers of the request.

**body**: `string | object` _(optional)_  
Request body. If it is an object, it will be automatically serialized to a JSON, and `Content-Type: application/json` header will be appended.

### Output

**request**: `object`  
Request object, same as from `params`.

**response**: `object`  
Response object.

## Schedule

Produces output with given schedule.

### Params

**interval**: `string`  
Human readable duration, like `120s` or `30m`. The lib [parse-duration](https://github.com/jkroso/parse-duration) is used for conversion.

### Output

**now**: `string`  
Current timestamp.

## Transform

Block converting the output data of the previous block according to the specified shape.

### Params

**output**: `object | object[] | undefined`  
Desired output data, likely based on input data.

### Output

The value of `params.output`.
