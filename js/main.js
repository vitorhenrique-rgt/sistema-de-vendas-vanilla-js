const productForm = document.getElementById('product-form')
const productName = document.getElementById('product-name')
const productDescription = document.getElementById('product-description')
const productCost = document.getElementById('product-cost')
const productPrice = document.getElementById('product-price')

let products = []

function addProduct() {
  if (productName.value === "" || productCost.value === "" || productPrice.value === "") {
    console.log("Campos Obrigatórios")
  } else {
    const product = {
      id: crypto.randomUUID(),
      name: productName.value,
      description: productDescription.value,
      cost: Number(productCost.value),
      price: Number(productPrice.value)
    }
    products.push(product)
    console.log(products)
  }
}

function cleanProductForm() {
  productName.value = ""
  productDescription.value = ""
  productCost.value = ""
  productPrice.value = ""
}
productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  addProduct()
  cleanProductForm()
})



