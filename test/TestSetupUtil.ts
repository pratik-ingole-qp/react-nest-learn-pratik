//import { TodoService } from '@modules/todo/application/services/TodoService';
import { INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@src/AppModule'
import { runSharedInitializationWithTest } from '@src/sharedAppInitializationWithTests'
export interface ITestApp {
  app: INestApplication
  moduleRef: TestingModule
  // services: { todoService: TodoService };
}
const startTestApp = async (): Promise<ITestApp> => {
  const logger = new Logger()
  // logger.localInstance?.setLogLevels?.(['error', 'warn'])
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .setLogger(logger)
    .compile()
  const app = moduleRef.createNestApplication()
  app.useLogger(['error', 'warn'])
  await runSharedInitializationWithTest(app)
  await app.init()
  return {
    app,
    moduleRef,
  }
}
const closeApp = async (testApp: ITestApp): Promise<void> => {
  await testApp.app.close()
}
export const testSetupUtil = {
  startTestApp,
  closeApp,
}
