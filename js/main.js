const productForm = document.getElementById('product-form')
const productNameInput = document.getElementById('product-name')
const productDescriptionInput = document.getElementById('product-description')
const productCostInput = document.getElementById('product-cost')
const productPriceInput = document.getElementById('product-price')
const productTable = document.getElementById('product-table')
const productTableList = productTable.querySelector('tbody')
const cartTableList = document.querySelector("#cart-items-table tbody")

let products = [
  {
    id: "prod-8821-xpta",
    name: "Teclado Mecânico RGB",
    description: "Teclado switch blue com retroiluminação customizável.",
    cost: 150.00,
    price: 299.90
  },
  {
    id: "prod-4432-kmno",
    name: "Mouse Gamer 12000 DPI",
    description: "Mouse ergonômico com pesos ajustáveis e sensor óptico.",
    cost: 80.00,
    price: 189.00
  },
  {
    id: "prod-1092-lowp",
    name: "Monitor 24' 144Hz",
    description: "Monitor Full HD com painel IPS e 1ms de resposta.",
    cost: 600.00,
    price: 1150.00
  },
  {
    id: "prod-7756-qwer",
    name: "Headset 7.1 Surround",
    description: "Fone de ouvido com cancelamento de ruído e microfone destacável.",
    cost: 120.00,
    price: 320.00
  },
  {
    id: "prod-3341-plmj",
    name: "Webcam 4K Ultra HD",
    description: "Câmera para streaming com foco automático e correção de luz.",
    cost: 250.00,
    price: 540.00
  }
];
let editingProductId = null
let cart = { totalItems: 0, totalValue: 0, items: [] }
let sales = []


//-----------------------PRODUCTS-----------------------
//ADD PRODUCT
function addProduct() {
  const product = {
    id: crypto.randomUUID(),
    name: productNameInput.value,
    description: productDescriptionInput.value,
    cost: Number(productCostInput.value),
    price: Number(productPriceInput.value)
  }
  products.push(product)
}

//UPDATE PRODUCT
function updateProduct(id) {
  const updatedProducts = products.map(product =>
    product.id === id ? {
      ...product, name: productNameInput.value,
      description: productDescriptionInput.value,
      cost: Number(productCostInput.value),
      price: Number(productPriceInput.value)
    } : product
  )
  products = updatedProducts
}

//DELETE PRODUCT
function deleteProduct(id) {
  const updatedProducts = products.filter(product => product.id !== id)
  products = updatedProducts
  renderProductList()
}

//FIND PRODUCT
function findProduct(productId) {
  const productFound = products.find(product => product.id === productId)
  return productFound
}

//HANDLE PRODUCT FORM
function handleProductFormClick(id) {
  if (productNameInput.value === "" || productCostInput.value === "" || productPriceInput.value === "") {
    console.log("Campos Obrigatórios")
  } else {
    if (id === null) {
      addProduct()
    } else {
      updateProduct(id)
    }
    renderProductList()
  }
}

//SHOW PRODUCTS
function renderProductList() {
  const productItems = products.map((product, index) => {
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



//-----------------------CART-----------------------
//ADD ITEM TO CART
function addItemToCart(productId, quantity) {
  const productItem = {
    productId: productId,
    quantity: quantity,
    unitPrice: findProduct(productId).price
  }
  cart.items.push(productItem)
}

// UPDATE ITEM CART
function updateItemCart(productId, quantity) {
  const updatedCart = cart.items.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
  cart.items = updatedCart
}

//REMOVE ITEM CART
function removeItemCart(id) {
  const updatedCart = cart.items.filter(item => item.productId !== id)
  cart.items = updatedCart
  calculateTotalsCart()
  renderCart()
}

//CALCULATE TOTALS CART
function calculateTotalsCart() {
  const updatedTotalValue = cart.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
  cart.totalValue = updatedTotalValue
  const totalItemsUpdated = cart.items.reduce((acc, item) => acc + item.quantity, 0)
  cart.totalItems = totalItemsUpdated
}

//HANDLE ITEM CART
function handleItemCartClick(productId, quantity) {
  const index = cart.items.findIndex(item => item.productId === productId)
  if (index < 0) {
    addItemToCart(productId, quantity)
  } else {
    updateItemCart(productId, quantity)
  }
  calculateTotalsCart()
  renderCart()
}

//SHOW CART
function renderCart() {
  const cartItemsList = cart.items.map((item, index) => {
    const product = findProduct(item.productId)
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${item.quantity}</td>
      <td>${(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td><button class="delete-item-cart-btn" data-id="${item.productId}">Remover</button></td>
      <td><button class="add-item-cart-btn" data-id="${item.productId}">Adicionar</button></td>
    </tr>
    `
  }).join('')

  const totalsTableRow = `
  <tr style="border-top: 2px solid black;">
  <td colspan="3">Total</td>
  <td>${cart.totalItems}</td>
  <td>${cart.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
  <td><button class="add-sale-btn">Finalizar</button></td>
  <td><button class="cancel-sale-btn">Cancelar</button></td>
  </tr>
  `
  cartTableList.innerHTML = cartItemsList + totalsTableRow
}



//-----------------------------SALES------------------------------
//ADD SALE
function createSale() {
  if (cart.items.length > 0) {
    const saleCompleted = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      total: cart.totalValue,
      items: cart.items.map(item => {
        const product = findProduct(item.productId)
        return {
          productId: item.productId,
          productName: product.name,
          productPrice: product.price,
          productQuantity: item.quantity
        }
      })
    }
    sales.push(saleCompleted)
    cleanCart()
    renderCart()
  } else {
    console.log("Não há itens no carrinho")
  }
}

//CANCEL SALE
function cancelSale() {
  cleanCart()
  renderCart()
}



//-----------------------UTILITY AND EVENTS-----------------------
//UTILITY FUNCTIONS
function cleanProductForm() {
  editingProductId = null
  productNameInput.value = ""
  productDescriptionInput.value = ""
  productCostInput.value = ""
  productPriceInput.value = ""
}

function fillProductForm(id) {
  const product = products.find(product => product.id === id)
  productNameInput.value = product.name
  productDescriptionInput.value = product.description
  productCostInput.value = product.cost
  productPriceInput.value = product.price
}

function cleanCart() {
  cart = { totalItems: 0, totalValue: 0, items: [] }
}



//----------------------EVENT LISTENERS-------------------------------
//LISTENER CART TABLE
cartTableList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-item-cart-btn')) {
    const id = e.target.dataset.id
    removeItemCart(id)
  } else if (e.target.classList.contains('add-item-cart-btn')) {
    const id = e.target.dataset.id
    handleItemCartClick(id, 1)
  } else if (e.target.classList.contains('add-sale-btn')) {
    createSale()
  } else if (e.target.classList.contains('cancel-sale-btn')) {
    cancelSale()
  }
})

//LISTENER PRODUCT TABLE
productTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-product-btn')) {
    const id = e.target.dataset.id
    deleteProduct(id)
  } else if (e.target.classList.contains('update-product-btn')) {
    editingProductId = e.target.dataset.id
    fillProductForm(editingProductId)
  } else if (e.target.classList.contains('add-product-btn')) {
    const id = e.target.dataset.id
    handleItemCartClick(id, 1)
  }
})

//LISTENER PRODUCT FORM
productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  handleProductFormClick(editingProductId)
  cleanProductForm()
})


renderProductList()
renderCart()

