const express = require("express");

const app = express();
const PORT = 3000;
const orders = [];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Jitterbit rodando");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.post("/order", (req, res) => {
  const order = req.body;

  const mappedOrder = {
    orderId: order.numeroPedido,
    value: order.valorTotal,
    creationDate: order.dataCriacao,
    items: order.items.map(item => ({
      productId: item.idItem,
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };

  orders.push(mappedOrder);

  res.status(201).json(mappedOrder);
});

app.get("/order/:orderId", (req, res) => {
  const { orderId } = req.params;

  const order = orders.find(order => order.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  res.status(200).json(order);
});