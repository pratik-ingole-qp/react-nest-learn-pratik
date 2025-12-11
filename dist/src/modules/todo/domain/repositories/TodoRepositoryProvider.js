'use strict'
Object.defineProperty(exports, '__esModule', {value: true})
exports.TodoRepositoryProvider = void 0
const DatabaseConstants_1 = require('../../../infra/database/constants/DatabaseConstants')
const TodoEntity_1 = require('../entities/TodoEntity')
exports.TodoRepositoryProvider = {
  provide: 'TODO_REPOSITORY',
  inject: [DatabaseConstants_1.DATA_SOURCE],
  useFactory: dataSource => {
    return dataSource.getRepository(TodoEntity_1.TodoEntity)
  },
}
//# sourceMappingURL=TodoRepositoryProvider.js.map
