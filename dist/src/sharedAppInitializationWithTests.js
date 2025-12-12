"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSharedInitializationWithTest = void 0;
const common_1 = require("@nestjs/common");
const runSharedInitializationWithTest = async (app) => {
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false, },
    }));
};
exports.runSharedInitializationWithTest = runSharedInitializationWithTest;
//# sourceMappingURL=sharedAppInitializationWithTests.js.map