const express = require("express");
const app = express();
const port = 3001;

const goodsRouter = require("./routes/goods.js");
const connect = require("./schemas/index.js");
connect();

//body-parser를 사용하기 위한 미들웨어
app.use(express.json());

//미들웨어
app.use("/api", goodsRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
