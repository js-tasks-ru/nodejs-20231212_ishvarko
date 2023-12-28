const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  dataProcessedLength = 0;
  limit;
  constructor(options) {
    super(options);
    this.limit = options?.limit;
  }

  _transform(chunk, encoding, callback) {
    this.dataProcessedLength += chunk.length;
    if (this.limit && this.dataProcessedLength > this.limit){
      callback(new LimitExceededError());
    } else {
      callback(null, chunk)
    }
  }
}

module.exports = LimitSizeStream;
