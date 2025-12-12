"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pager = void 0;
const common_1 = require("@nestjs/common");
exports.pager = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    let page = Number(query.page);
    let limit = Number(query.limit);
    if (isNaN(page) || page < 1)
        page = 1;
    if (isNaN(limit) || limit < 1)
        limit = 10;
    if (query.page !== undefined && Number(query.page) < 1) {
        throw new common_1.BadRequestException('Page must be >= 1');
    }
    if (query.limit !== undefined && Number(query.limit) <= 0) {
        throw new common_1.BadRequestException('Limit must be > 0');
    }
    return { page, limit };
});
//# sourceMappingURL=Pager.decorator.js.map