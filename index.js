const [, , method, resource, ...params] = process.argv

const urlApi = 'https://dummyjson.com'

const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${urlApi}${endpoint}`, options)
    if (!response.ok) {
      throw new Error(`Error http: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data
  }
  catch (error) {
    console.error("Error en la petición", error)
  }
}

const getAllProducts = async () => {
  console.log("Consultando todos los productos")
  const products = await fetchApi('/products')
  console.log("Productos obtenidos:")
  console.log(JSON.stringify(products, null, 2))
}

const getProductById = async (productId) => {

  if (isNaN(productId)) {
    console.error("El ID del producto debe ser un número")
    process.exit(1)
  }

  console.log(`Consultando producto por id: ${productId}`)
  const product = await fetchApi(`/products/${productId}`)
  console.log(`Producto obtenido`)
  console.log(JSON.stringify(product, null, 2))
}

const createProduct = async (title, price, category) => {
  console.log("Creando producto")

  const newProduct = {
    title, price, category,
    description: `Producto ${title} creado`,
    images: 'https://placehold.co/400x400'
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  }

  const result = await fetchApi('/products/add', options)

  console.log("Productos creado")
  console.log(JSON.stringify(result, null, 2))
}

const deleteProduct = async (productId) => {

  if (isNaN(productId)) {
    console.error("El ID del producto debe ser un número")
    process.exit(1)
  }

  console.log(`Eliminando el producto con id: ${productId}`)

  const options = {
    method: "DELETE"
  }

  const result = await fetchApi(`/products/${productId}`, options)
  console.log("Producto eliminado")
  console.log(JSON.stringify(result, null, 2))
}

const main = async () => {

  console.log("Iniciando programa...")
  if (!method || !resource) {
    process.exit(1)
  }

  const httpMethod = method.toUpperCase()

  switch (httpMethod) {
    case "GET":
      if (resource.includes('/')) {
        const [, productId] = resource.split('/')
        await getProductById(productId)
      } else if (resource === "products") {
        await getAllProducts()
      } else {
        console.error("Recurso no válido.")
        console.error("Ejemplo: npm run start GET products | npm run start GET products/3")
        process.exit(1)
      }
      break

    case "POST":
      if (resource === "products") {
        const [title, price, category] = params
        if (!title || !price || !category) {
          console.error("Faltan parametros.")
          console.error("Ejemplo: npm run start POST products <title> <price> <category>")
          process.exit(1)
        }
        await createProduct(title, price, category)
      } else {
        console.error('Recurso no valido. Usa "products"')
        process.exit(1)
      }
      break

    case "DELETE":
      if (resource.includes('/')) {
        const [, productId] = resource.split('/')
        await deleteProduct(productId)
      } else {
        console.error("Falta el ID del producto.")
        console.error("Ejemplo: npm run start DELETE products/<productId>")
        process.exit(1)
      }
      break

    default:
      console.error(`Metodo no soportado: ${httpMethod}`)
      console.error("Metodos disponibles: GET, POST, DELETE")
      process.exit(1)
  }
}

main()