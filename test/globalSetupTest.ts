import { ensureDockerContainerRunning } from './TestDatabaseUtil'
import { testEnvLoader } from './utils/TestEnvLoader'
testEnvLoader.loadTestEnvironment()
module.exports = async (): Promise<void> => {
  console.log('\n:rocket: GLOBAL SETUP START')
  if (!process.env.SKIP_TEST_DOCKER_SETUP) {
    const containerRunning = await ensureDockerContainerRunning()
    if (!containerRunning) {
      throw new Error(':x: Failed to start MySQL Docker container')
    }
  }
  console.log(':white_check_mark: GLOBAL SETUP END')
}