import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/AppModule';

export interface ITestApp {
  app: INestApplication;
  moduleRef: TestingModule;
}

const startTestApp = async (): Promise<ITestApp> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  // Global validation (same as main.ts)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  return {
    app,
    moduleRef,
  };
};

const closeApp = async (testApp: ITestApp): Promise<void> => {
  if (testApp?.app) {
    await testApp.app.close();
  }
};

export const testSetupUtil = {
  startTestApp,
  closeApp,
};
