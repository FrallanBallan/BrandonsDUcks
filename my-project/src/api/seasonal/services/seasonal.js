'use strict';

/**
 * seasonal service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::seasonal.seasonal');
