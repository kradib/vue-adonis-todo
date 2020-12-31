'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ResourceNotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  handle (error, {response}) {
    return response.status(403).json({
        error: 'Resource Not found',
      });
  }

}

module.exports = ResourceNotFoundException
