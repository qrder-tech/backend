export default {
  AUTH_TYPES: {
    CONSUMER: 'Consumer',
    RESTAURANT: 'Restaurant',
  },
  SERVICE_TYPES: {
    NORMAL: 'normal',
    SELF: 'self',
  },
  errors: {
    UNAUTH: { code: 401, msg: 'Unauthorized action' },
    INVALID_TOKEN: { code: 401, msg: 'Invalid token' },
    MISSING_ARGS: { code: 400, msg: 'Arguments are missing' },
    INVALID_ARGS: { code: 400, msg: 'Invalid arguments' },
    DUPLICATED_ARGS: { code: 400, msg: 'Duplicated arguments' },
    VALIDATOR_ARGS: { code: 400, msg: 'Arguments cannot pass validator' },
    ENTITY_NOT_EXIST: { code: 400, msg: 'Entity does not exist via given parameters' },
    UNKNOWN: { code: 400, msg: 'Unknown error' },
  },
};
