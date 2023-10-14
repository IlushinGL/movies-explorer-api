const { NODE_ENV = 'develoupment', PORT, FRONT_URL } = process.env;
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const allowedCors = [
  `https://${FRONT_URL}`,
  `http://${FRONT_URL}`,
  `http://localhost:${PORT}`,
];

module.exports = (req, res) => {
  const { method } = req; // HTTP-метод
  const { origin } = req.headers; // источник запроса
  // список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    // указываем разрешенные типы кросс-доменных запросов
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // подтверждаем заголовки запроса
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // возвращаем ответ клиенту
    return res.end();
  }

  if (NODE_ENV !== 'production') {
    // в режиме разработки разрешить запросы из любого источника
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedCors.includes(origin)) {
    // иначе разрешить запросы с указанного источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  return res.end();
};
