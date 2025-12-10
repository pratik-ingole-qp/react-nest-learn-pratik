"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSetupUtil = void 0;
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const AppModule_1 = require("../src/AppModule");
const startTestApp = async () => {
    const moduleRef = await testing_1.Test.createTestingModule({
        imports: [AppModule_1.AppModule],
    }).compile();
    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.init();
    return {
        app,
        moduleRef,
    };
};
const closeApp = async (testApp) => {
    await testApp.app.close();
};
exports.testSetupUtil = {
    startTestApp,
    closeApp,
};
//# sourceMappingURL=TestSetupUtil.js.map