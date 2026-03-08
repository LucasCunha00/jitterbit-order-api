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

  if (!order.numeroPedido || !order.valorTotal || !order.items) {
    return res.status(400).json({
      error: "Dados do pedido inválidos"
    });
  }

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

app.get("/order/list", (req, res) => {
  res.status(200).json(orders);
});

app.get("/order/:orderId", (req, res) => {
  const { orderId } = req.params;

  const order = orders.find(order => order.orderId === orderId);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  res.status(200).json(order);
});

app.delete("/order/:orderId", (req, res) => {
  const { orderId } = req.params;

  const index = orders.findIndex(order => order.orderId === orderId);

  if (index === -1) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  orders.splice(index, 1);

  res.status(200).json({ message: "Pedido deletado com sucesso" });
});