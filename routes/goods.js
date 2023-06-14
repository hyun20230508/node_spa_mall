const express = require("express");
const router = express.Router();
// /routes/goods.js
const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

router.get("/goods", (req, res) => {
  res.status(200).json({ goods });
});

// :goodsId 부분에서 cart텍스트를 goodsId로 인식하게 되면서
// 값이 {}로 반환
// router.get("/goods/:goodsId", (req, res) => {
//   const { goodsId } = req.params;
//   //   let result = null;
//   //   for (const good of goods) {
//   //     if (Number(goodsId) === good.goodsId) {
//   //       result = good;
//   //     }
//   //   }
//   //위의 코드를 filter문으로
//   const [result] = goods.filter((good) => Number(goodsId) === good.goodsId);
//   res.status(200).json({ detail: result });
// });

const Goods = require("../schemas/goods.js");

router.post("/goods/", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      succcess: false,
      errorMessage: "이미 존재하는 GoodsId입니다.",
    });
  }

  const createGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });

  res.json({ goods: createGoods });
});

//여기는 카트

const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 같은 상품이 존재합니다.",
    });
  }
  await Cart.create({ goodsId, quantity });

  res.json({ result: "success" });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400).json({
      success: false,
      errorMessage: "수량을 1개 이상 지정해주세요.",
    });
  }
  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    //Cart안에서 하나를 수정할 건데, goodsId에 해당하는 값이 있으면 quantity
    //값을 quantity값으로 수정한다.
    await Cart.updateOne(
      { goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
  }
  res.status(200).json({ success: true });
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
  }

  res.json({ result: "seccess" });
});

router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds });

  res.json({
    carts: carts.map((cart) => ({
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId),
    })),
  });
});

module.exports = router;
