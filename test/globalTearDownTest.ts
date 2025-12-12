/* eslint-disable-no-restricted-exports */

import { stopDockerContainer } from './TestDatabaseUtil'
const teardown = async (): Promise<void> => {
  console.log(':checkered_flag: GLOBAL TEARDOWN START')
  if (!process.env.SKIP_TEST_DOCKER_SETUP) {
    await stopDockerContainer()
  }
  console.log(':white_check_mark: GLOBAL TEARDOWN END')
}
export default teardown