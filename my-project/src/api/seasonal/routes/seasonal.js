'use strict';

/**
 * seasonal router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::seasonal.seasonal');
