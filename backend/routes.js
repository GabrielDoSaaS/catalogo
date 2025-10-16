const routes = require('express').Router();

routes.post('/items', require('./controller/ItemController').CreateItem);
routes.get('/items', require('./controller/ItemController').ReturnItems);
routes.delete('/items/:id', require('./controller/ItemController').DeleteItem);
routes.post('/item-with-variants', require('./controller/ItemController').CreateItemWithVariants);
routes.post('/pay', require('./controller/PaymentsController'));

routes.put('/items/:id', require('./controller/ItemController').UpdateItem);

module.exports = routes;