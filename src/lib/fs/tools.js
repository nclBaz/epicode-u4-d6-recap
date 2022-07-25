import fs from "fs-extra"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const { readJSON, writeJSON, writeFile, unlink } = fs

const productsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/products.json")
const publicProductsFolderPath = join(process.cwd(), "./public/img/products")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = productsArray => writeJSON(productsJSONPath, productsArray)

export const saveProductsImages = (fileName, file) => writeFile(join(publicProductsFolderPath, fileName), file)
export const deleteProductsImages = imageUrl => unlink(join(publicProductsFolderPath, "../../", imageUrl))
