import uniqid from "uniqid"
import { getProducts, writeProducts } from "../fs/tools.js"

export const saveNewProduct = async newProductData => {
  const products = await getProducts()
  const newProduct = { ...newProductData, createdAt: new Date(), id: uniqid() }
  products.push(newProduct)
  await writeProducts(products)

  return newProduct.id
}

export const findProducts = async () => getProducts()

export const findProductById = async productId => {
  const products = await getProducts()

  const foundProduct = products.find(product => product.id === productId)

  return foundProduct
}

export const findProductByIdAndUpdate = async (productId, updates) => {}

export const findProductByIdAndDelete = async productId => {}
