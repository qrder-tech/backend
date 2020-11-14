export default {
  errors: {
    UNAUTH: { code: 401, msg: 'Unauthorized action' },
    INVALID_TOKEN: { code: 401, msg: 'Invalid token' },
    MISSING_ARGS: { code: 400, msg: 'Arguments are missing' },
    INVALID_ARGS: { code: 400, msg: 'Invalid arguments' },
    DUPLICATED_ARGS: { code: 400, msg: 'Duplicated arguments' },
    VALIDATOR_ARGS: { code: 400, msg: 'Arguments cannot pass validator' },
    UNKNOWN: { code: 400, msg: 'Unknown error' }
  }
}