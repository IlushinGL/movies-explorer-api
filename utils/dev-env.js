// объект переменных окружения режима разработки приложения
// все значения должны быть строками!!!
const devEnv = {
  port: '3000',
  salt: '10',
  db: 'mongodb://localhost:27017/bitfilmsdb',
  secret: 'b19$ecret',
};

module.exports = devEnv;
