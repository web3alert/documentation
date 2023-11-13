# Types

Trigger values is a list of parameters that must be filled in for the trigger to work. Each value has a type, for convenient management and validation of input data.

### String

A string.

#### Spec

```yaml
value: { type: string }
```

#### Runtime value

```typescript
'hello'
```

### Number

A number.

#### Spec

```yaml
value: { type: number }
```

#### Runtime value

```typescript
12
```

### Boolean

A boolean.

#### Spec

```yaml
value: { type: boolean }
```

#### Runtime value

```typescript
true
```

### Object

An object of specified shape.

#### Spec

```yaml
value:
  type: object
  properties:
    foo: { type: string }
    bar: { type: number }
```

#### Runtime value

```typescript
{ foo: 'hello', bar: 12 }
```

### Array

An array of elements of the same type.

#### Spec

```yaml
value:
  type: array
  items: { type: string }
```

#### Runtime value

```typescript
['foo', 'bar']
```

### Tuple

A fixed-length array of elements of different specified types.

#### Spec

```yaml
value:
  type: array
  items:
    - { type: string }
    - { type: number }
```

#### Runtime value

```typescript
['foo', 12]
```

### Address

For convenient management of the address book in the Web3alert, there is a special `address` type. Here is a list of supported address formats.

#### Plain

Plain string with no validation. But fields of this format still have an addressbook intergration.

```yaml
value: { type: address }
```

#### SS58 (Substrate format)

```yaml
value:
  type: address
  format: ss58
  prefix: 0
```

#### EVM

```yaml
value:
  type: address
  format: evm
```

#### Bitcoin

```yaml
value:
  type: address
  format: bitcoin
```

#### Sui

```yaml
value:
  type: address
  format: sui
```

#### Cosmos

```yaml
address-cosmos:
  type: address
  format: cosmos
  prefix: celestia
```

#### Runtime value

It will be a string of specified format.

```typescript
'0xc0ffee234729296a45a3885638AC7E11F9d54979'
```
