"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var shopify_api_1 = tslib_1.__importDefault(require("@shopify/shopify-api"));
function initializeShopify(context) {
    shopify_api_1.default.Context.initialize(context);
}
exports.default = initializeShopify;
