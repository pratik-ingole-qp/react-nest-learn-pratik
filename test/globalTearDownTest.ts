import {stopDockerContainer} from './TestDatabaseUtil'

export const globalTeardown = async (): Promise<void> => {
  console.log(':checkered_flag: GLOBAL TEARDOWN START')
  await stopDockerContainer()
  console.log(':white_check_mark: GLOBAL TEARDOWN END')
}
