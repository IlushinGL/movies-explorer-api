// объект переменных окружения режима разработки приложения
// все значения должны быть строками!!!
const devEnv = {
  port: '3000',
  salt: '10',
  db: 'mongodb://127.0.0.1:27017/iglfilmsdb',
  secret: 'b19$ecret',
};

module.exports = devEnv;
