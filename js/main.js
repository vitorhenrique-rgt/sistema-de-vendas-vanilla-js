const productForm = document.getElementById('product-form')
const productName = document.getElementById('product-name')
const productDescription = document.getElementById('product-description')
const productCost = document.getElementById('product-cost')
const productPrice = document.getElementById('product-price')

const productList = document.querySelector('#product-list tbody')

let products = []

function showProductList() {
  const productItems = products.map((product, index) => {
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.description}</td>
      <td>${product.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
    </tr>
    `
  }).join('')

  productList.innerHTML = productItems
}

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
    showProductList()
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

showProductList()


