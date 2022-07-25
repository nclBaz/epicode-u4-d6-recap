import express from "express"
import createHttpError from "http-errors"
import multer from "multer"
import { extname } from "path"
import { findProductById, findProductByIdAndDelete, findProductByIdAndUpdate, findProducts, saveNewProduct } from "../../lib/db/products.js"
import { saveProductsImages } from "../../lib/fs/tools.js"
import { checksProductsSchema, checkValidationResult } from "./productsValidation.js"

const productsRouter = express.Router()

productsRouter.post("/", checksProductsSchema, checkValidationResult, async (req, res, next) => {
  try {
    const id = await saveNewProduct(req.body)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await findProducts()
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const product = await findProductByIdAndUpdate(req.params.productId, req.body)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    await findProductByIdAndDelete(req.params.productId)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

productsRouter.patch("/:productId/image", multer().single("productPicture"), async (req, res, next) => {
  try {
    // create a unique name for that picture (name will be something like 3kgarsl60hymte.gif)

    const fileName = req.params.productId + extname(req.file.originalname)

    // save the file into public folder

    // update the product record with the image url
    const product = await findProductByIdAndUpdate(req.params.productId, { imageUrl: "/img/products/" + fileName })
    if (product) {
      await saveProductsImages(fileName, req.file.buffer)
      // send back a response
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter
