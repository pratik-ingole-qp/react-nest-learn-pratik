import {INestApplication} from '@nestjs/common'
import {TestingModule} from '@nestjs/testing'
export interface ITestApp {
  app: INestApplication
  moduleRef: TestingModule
}
export declare const testSetupUtil: {
  startTestApp: () => Promise<ITestApp>
  closeApp: (testApp: ITestApp) => Promise<void>
}
