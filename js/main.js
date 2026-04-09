const productForm = document.getElementById('product-form')
const productNameInput = document.getElementById('product-name')
const productDescriptionInput = document.getElementById('product-description')
const productCostInput = document.getElementById('product-cost')
const productPriceInput = document.getElementById('product-price')
const productTable = document.getElementById('product-table')
const productTableList = productTable.querySelector('tbody')

let productsArray = []
let productId = null
let cart = [{ productId: 1, quantity: 1, unitPrice: 10 }, { productId: 2, quantity: 2, unitPrice: 20 }, { productId: 3, quantity: 1, unitPrice: 15 }]

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
      <td><button class="add-product-btn" data-id="${product.id}">Adicionar</button></td>
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
    if (id === null) {
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
  productId = null
  productNameInput.value = ""
  productDescriptionInput.value = ""
  productCostInput.value = ""
  productPriceInput.value = ""
}

function updateProductInput(id) {
  const product = productsArray.find(product => product.id === id)
  productNameInput.value = product.name
  productDescriptionInput.value = product.description
  productCostInput.value = product.cost
  productPriceInput.value = product.price
}


//ADD ITEM CART
function addItemCart(productId, quantity) {
  productAdded = productsArray.find(product => product.id === productId)
  console.log(productAdded);
  const index = cart.findIndex(item => item.productId === productId)
  if (index < 0) {
    const productItem = {
      productId: productId,
      quantity: quantity,
      unitPrice: productAdded.price
    }
    cart.push(productItem)
  } else {
    const updatedCart = cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
    cart = updatedCart
  }
}

//EVENT LISTENERS
productTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-product-btn')) {
    const id = e.target.dataset.id
    deleteProduct(id)
  } else if (e.target.classList.contains('update-product-btn')) {
    productId = e.target.dataset.id
    updateProductInput(productId)
  } else if (e.target.classList.contains('add-product-btn')) {
    const id = e.target.dataset.id
    addItemCart(id, 1)
  }
})

productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  saveProduct(productId)
  cleanProductForm()
})


showProductList()


