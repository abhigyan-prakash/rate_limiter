# rate-limiter

Example API rate limiter implementation.

<br/>

## Installation

```sh
$ npm install
```

## Run

```sh
$ npm run start
```

## APIs

### Example API

Returns json message

```
GET http://<domain>/example
```

Sample success response - Status Code 200

```json
{
  "status": "success",
  "message": "example response"
}
```

Error response if limit reached - Status Code 429

```json
{
  "status": "error",
  "message": "Too many requests"
}
```

<br/>

## Running Tests

```sh
$ npm run test
```
