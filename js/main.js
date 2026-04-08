const productForm = document.getElementById('product-form')
const productIdInput = document.getElementById('product-id')
const productNameInput = document.getElementById('product-name')
const productDescriptionInput = document.getElementById('product-description')
const productCostInput = document.getElementById('product-cost')
const productPriceInput = document.getElementById('product-price')
const productTable = document.getElementById('product-table')
const productTableList = productTable.querySelector('tbody')

let productsArray = []

//SHOW PRODUCTS
function showProductList() {
  const productItems = productsArray.map((product, index) => {
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.description}</td>
      <td>${product.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td><button class="delete-product-btn" data-id="${product.id}">Deletar</button></td>
      <td><button class="update-product-btn" data-id="${product.id}">Alterar</button></td>
    </tr>
    `
  }).join('')

  productTableList.innerHTML = productItems
}


//ADD AND UPDATE PRODUCT
function saveProduct(id) {
  if (productNameInput.value === "" || productCostInput.value === "" || productPriceInput.value === "") {
    console.log("Campos Obrigatórios")
  } else {
    if (id === "") {
      const product = {
        id: crypto.randomUUID(),
        name: productNameInput.value,
        description: productDescriptionInput.value,
        cost: Number(productCostInput.value),
        price: Number(productPriceInput.value)
      }
      productsArray.push(product)
    } else {
      const updatedProducts = productsArray.map(product =>
        product.id === id ? {
          ...product, name: productNameInput.value,
          description: productDescriptionInput.value,
          cost: Number(productCostInput.value),
          price: Number(productPriceInput.value)
        } : product
      )
      productsArray = updatedProducts
    }
    showProductList()
  }
}


//DELETE PRODUCT
function deleteProduct(id) {
  const updatedProducts = productsArray.filter(product => product.id !== id)
  productsArray = updatedProducts
  showProductList()
}


//UTILITY FUNCTIONS
function cleanProductForm() {
  productIdInput.dataset.id = ""
  productNameInput.value = ""
  productDescriptionInput.value = ""
  productCostInput.value = ""
  productPriceInput.value = ""
}

function updateProductInput(id) {
  const product = productsArray.find(product => product.id === id)
  productIdInput.dataset.id = product.id
  productNameInput.value = product.name
  productDescriptionInput.value = product.description
  productCostInput.value = product.cost
  productPriceInput.value = product.price
}


//EVENT LISTENERS
productTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-product-btn')) {
    const id = e.target.dataset.id
    deleteProduct(id)
  } else if (e.target.classList.contains('update-product-btn')) {
    const id = e.target.dataset.id
    updateProductInput(id)
  }
})

productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  saveProduct(productIdInput.dataset.id)
  cleanProductForm()
})


showProductList()


