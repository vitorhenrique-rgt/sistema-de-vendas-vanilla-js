const productForm = document.getElementById('product-form')
const productNameInput = document.getElementById('product-name')
const productDescriptionInput = document.getElementById('product-description')
const productCostInput = document.getElementById('product-cost')
const productPriceInput = document.getElementById('product-price')
const productTable = document.getElementById('product-table')
const productTableList = productTable.querySelector('tbody')
const cartTableList = document.querySelector("#cart-items-table tbody")

let products = []
let editingProductId = null
let cart = {}
let sales = []


//--------------------------DATA MANIPULATION---------------------------
//FETCH PRODUCTS DATA
function fetchProductsData() {
  const productData = localStorage.getItem("productsData")
  if (productData !== null) {
    products = JSON.parse(productData)
    console.log(products)
  } else {
    console.log("Dados não encontrados")
  }
}

//FETCH CART DATA
function fetchCartData() {
  const cartData = sessionStorage.getItem("cartData")
  if (cartData !== null) {
    cart = JSON.parse(cartData)
    console.log(cart)
  } else {
    cart = { totalItems: 0, totalValue: 0, items: [] }
    console.log("Carrinho vazio")
  }

}

//FETCH SALES DATA
function fetchSalesData() {
  const salesData = localStorage.getItem("salesData")
  if (salesData !== null) {
    sales = JSON.parse(salesData)
    console.log(sales)
  } else {
    console.log("Dados não encontrados")
  }

}

//PUSH DATA
function pushData(data, nameDataBase) {
  localStorage.setItem(nameDataBase, JSON.stringify(data))
}


//PUSH DATA CART
function pushCartData(data) {
  sessionStorage.setItem("cartData", JSON.stringify(data))
}

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
  pushData(products, "productsData")
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
  pushData(products, "productsData")
}

//DELETE PRODUCT
function deleteProduct(id) {
  const updatedProducts = products.filter(product => product.id !== id)
  products = updatedProducts
  pushData(products, "productsData")
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
  pushCartData(cart)
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
  pushCartData(cart)
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
    pushData(sales, "salesData")
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
  pushCartData(cart)
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
fetchProductsData()
fetchCartData()
fetchSalesData()

renderProductList()
renderCart()



