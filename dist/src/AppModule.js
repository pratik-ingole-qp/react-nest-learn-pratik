'use strict'
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc)
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return (c > 3 && r && Object.defineProperty(target, key, r), r)
  }
Object.defineProperty(exports, '__esModule', {value: true})
exports.AppModule = void 0
const common_1 = require('@nestjs/common')
const config_1 = require('@nestjs/config')
const path_1 = require('path')
const TodoModule_1 = require('./modules/todo/TodoModule')
const InfraModule_1 = require('./modules/infra/InfraModule')
const loadAppConfig_1 = require('./config/loadAppConfig')
console.log(
  'ENV FILE PATH:',
  (0, path_1.resolve)(
    process.cwd(),
    'src/config',
    `.env.${process.env.ENVIRONMENT || 'development'}`,
  ),
)
let AppModule = class AppModule {}
exports.AppModule = AppModule
exports.AppModule = AppModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [
        config_1.ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: (0, path_1.resolve)(
            process.cwd(),
            'src/config',
            `.env.${process.env.ENVIRONMENT || 'development'}`,
          ),
          load: [loadAppConfig_1.loadAppConfig],
        }),
        TodoModule_1.TodoModule,
        InfraModule_1.InfraModule,
      ],
    }),
  ],
  AppModule,
)
//# sourceMappingURL=AppModule.js.map
