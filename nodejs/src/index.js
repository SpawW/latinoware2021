const http = require("http");
const url = require("url");
const client = require("prom-client");

const register = new client.Registry();

register.setDefaultLabels({
  app: "example-nodejs-app",
});

client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

register.registerMetric(httpRequestDurationMicroseconds);

const createOrderHandler = async (req, res) => {
  // return an error 1% of the time
  if (Math.floor(Math.random() * 100) === 0) {
    throw new Error("Internal Error");
  }

  // delay for 3-6 seconds
  const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3;
  await new Promise((res) => setTimeout(res, delaySeconds * 1000));

  res.end("Order created successfully");
};

const showReportHandler = async (req, res) => {
  // return an error 1% of the time
  randomValue = Math.floor(Math.random() * 10);
  if (randomValue === 0) {
    throw new Error("Internal Error");
  }

  //   const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3;
  await new Promise((res) => setTimeout(res, randomValue * 1000));

  res.end(`Report generated successfully ${randomValue}`);
};

const roomsHandler = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify( {"data": [
      { "{#ROOMID}": 1, "{#ROOMNAME}": "Espaço Brasil" },
      { "{#ROOMID}": 2, "{#ROOMNAME}": "Espaço Argentina" },
      { "{#ROOMID}": 3, "{#ROOMNAME}": "Espaço Bolivia" },
      { "{#ROOMID}": 4, "{#ROOMNAME}": "Espaço Chile" },
      { "{#ROOMID}": 5, "{#ROOMNAME}": "Espaço Colômbia" },
      { "{#ROOMID}": 6, "{#ROOMNAME}": "Espaço Equador" },
      { "{#ROOMID}": 7, "{#ROOMNAME}": "Espaço Paraguai" },
      { "{#ROOMID}": 8, "{#ROOMNAME}": "Espaço Peru" },
      { "{#ROOMID}": 9, "{#ROOMNAME}": "Espaço Uruguai" },
      { "{#ROOMID}": 10, "{#ROOMNAME}": "Espaço Venezuela" },
      { "{#ROOMID}": 11, "{#ROOMNAME}": "KDE" },
      { "{#ROOMID}": 12, "{#ROOMNAME}": "Madson books" },
      { "{#ROOMID}": 13, "{#ROOMNAME}": "Mozilla Community" },
      { "{#ROOMID}": 14, "{#ROOMNAME}": "LPI" },
      { "{#ROOMID}": 15, "{#ROOMNAME}": "Comnaction" },
      { "{#ROOMID}": 16, "{#ROOMNAME}": "PTI" },
      { "{#ROOMID}": 17, "{#ROOMNAME}": "Itaipu" },
      { "{#ROOMID}": 18, "{#ROOMNAME}": "ZUP" },
      { "{#ROOMID}": 19, "{#ROOMNAME}": "e-cidade" },
      { "{#ROOMID}": 20, "{#ROOMNAME}": "LibreCode" },
      { "{#ROOMID}": 21, "{#ROOMNAME}": "LibreSign" },
      { "{#ROOMID}": 22, "{#ROOMNAME}": "Rocket.Chat" },
    ]})
  );
};

const server = http.createServer(async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = url.parse(req.url).pathname;

  try {
    if (route === "/metrics") {
      res.setHeader("Content-Type", register.contentType);
      res.end(register.metrics());
    }

    if (route === "/order") {
      await createOrderHandler(req, res);
    }
    if (route === "/report") {
      await showReportHandler(req, res);
    }
    if (route === "/rooms") {
      await roomsHandler(req, res);
    }
  } catch (error) {
    res.writeHead(500).end();
  }

  if (!res.finished) {
    res.writeHead(404).end(); // Default 404 handler
  }

  end({ route, code: res.statusCode, method: req.method });
});

server.listen(8080, () => {
  console.log(
    "Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics"
  );
});
