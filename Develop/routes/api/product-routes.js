const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


router.get('/', async (req, res) => {

  
  try {
    const allProducts = await Product.findAll({
      
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      ]
    })
    if (allProducts) {
      res.status(200).json(allProducts);
    } else {
      res.status(400).json({ message: "No product found" })
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});


router.get('/:id', async (req, res) => {
    try {
    const product = await Product.findOne({
      where: {
        id: req.params.id
      },
            include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      ]
    })
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({ message: 'No product found' })
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tag_id
  })
    .then((product) => {
            if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
            res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
    Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
            return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
            const productTagIds = productTags.map(({ tag_id }) => tag_id);
      
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
            const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

            return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
    try {
    const destroyProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!destroyProduct) {
      res.status(400).json({ message: "No product found" })
    } else {
      res.json(destroyProduct)
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;