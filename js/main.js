const productForm = document.getElementById('product-form')
const productNameInput = document.getElementById('product-name')
const productDescriptionInput = document.getElementById('product-description')
const productCostInput = document.getElementById('product-cost')
const productPriceInput = document.getElementById('product-price')
const productTable = document.getElementById('product-table')
const productTableList = productTable.querySelector('tbody')
const cartTable = document.querySelector("#cart-items-table")
const cartTableList = cartTable.querySelector("tbody")
const cartTableTotals = cartTable.querySelector("tfoot")

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
  } else {
    console.log("Dados não encontrados")
  }
}

//FETCH CART DATA
function fetchCartData() {
  const cartData = sessionStorage.getItem("cartData")
  if (cartData !== null) {
    cart = JSON.parse(cartData)
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
  const itemCart = cart.items.find(item => item.productId === id)
  console.log(itemCart)
  if (itemCart) {
    console.log("Modal com mensagem de aviso que o produto está no carrinho")
  } else {
    const updatedProducts = products.filter(product => product.id !== id)
    products = updatedProducts
  }
}

//FIND PRODUCT
function findProduct(productId) {
  const productFound = products.find(product => product.id === productId)
  return productFound
}

//HANDLE PRODUCT FORM
function handleProductForm(id) {
  if (productNameInput.value === "" || productCostInput.value === "" || productPriceInput.value === "") {
    console.log("Campos Obrigatórios")
  } else {
    if (id === null) {
      addProduct()
    } else {
      updateProduct(id)
    }
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
      <td><button class="btn btn-sm btn-danger delete-product-btn" data-id="${product.id}">Deletar</button></td>
      <td><button class="btn btn-sm btn-info update-product-btn" data-id="${product.id}">Editar</button></td>
      <td><button class="btn btn-sm btn-info add-product-btn" data-id="${product.id}">Adicionar</button></td>
    </tr>
    `
  }).join('')

  productTableList.innerHTML = productItems
}



//-----------------------CART-----------------------
//ADD ITEM TO CART
function addItemToCart(productId, quantity) {
  const productFound = findProduct(productId)
  if (productFound) {
    const productItem = {
      productId: productId,
      quantity: quantity,
      unitPrice: productFound.price
    }
    cart.items.push(productItem)
  } else {
    console.log("Produto não encontrado")
  }
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
}

//CALCULATE TOTALS CART
function calculateTotalsCart() {
  const updatedTotalValue = cart.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
  cart.totalValue = updatedTotalValue
  const totalItemsUpdated = cart.items.reduce((acc, item) => acc + item.quantity, 0)
  cart.totalItems = totalItemsUpdated
}

//HANDLE ITEM CART
function handleItemCart(productId, quantity) {
  const index = cart.items.findIndex(item => item.productId === productId)
  if (index < 0) {
    addItemToCart(productId, quantity)
  } else {
    updateItemCart(productId, quantity)
  }
}

//SHOW CART
function renderCart() {
  const cartItemsList = cart.items.map((item, index) => {
    const product = findProduct(item.productId)
    if (product) {
      return `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        <td>${(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        <td><button class="btn btn-sm btn-danger delete-item-cart-btn" data-id="${item.productId}">Remover</button></td>
        <td><button class="btn btn-sm btn-info add-item-cart-btn" data-id="${item.productId}">Adicionar</button></td>
      </tr>
      `
    }
  }).join('')

  const totalsTableRow = `
  <tr>
  <td colspan="2">Total</td>
  <td>${cart.totalItems}</td>
  <td></td>
  <td>${cart.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
  <td><button class="btn btn-sm btn-danger cancel-sale-btn">Cancelar</button></td>
  <td><button class="btn btn-sm btn-success add-sale-btn">Finalizar</button></td>
  </tr>
  `
  cartTableList.innerHTML = cartItemsList
  cartTableTotals.innerHTML = totalsTableRow
}



//-----------------------------SALES------------------------------
//ADD SALE
function createSale() {
  if (cart.items.length > 0) {
    const saleCompleted = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      total: cart.totalValue,
      items: cart.items.map(item => {
        const product = findProduct(item.productId)
        if (product) {
          return {
            productId: item.productId,
            productName: product.name,
            productPrice: product.price,
            productQuantity: item.quantity
          }
        }
      })
    }
    sales.push(saleCompleted)
  } else {
    console.log("Não há itens no carrinho")
  }
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
cartTable.addEventListener('click', e => {
  if (e.target.classList.contains('add-sale-btn')) {
    createSale()
    pushData(sales, "salesData")
    cleanCart()
    renderCart()
  } else {

    if (e.target.classList.contains('add-item-cart-btn')) {
      const id = e.target.dataset.id
      handleItemCart(id, 1)
    } else if (e.target.classList.contains('delete-item-cart-btn')) {
      const id = e.target.dataset.id
      removeItemCart(id)
    } else if (e.target.classList.contains('cancel-sale-btn')) {
      cleanCart()
    }
    calculateTotalsCart()
    pushCartData(cart)
    renderCart()
  }
})

//LISTENER PRODUCT TABLE
productTable.addEventListener('click', e => {
  if (e.target.classList.contains('add-product-btn')) {
    const id = e.target.dataset.id
    handleItemCart(id, 1)
    calculateTotalsCart()
    pushCartData(cart)
    renderCart()
  } else {

    if (e.target.classList.contains('update-product-btn')) {
      editingProductId = e.target.dataset.id
      fillProductForm(editingProductId)

    } else if (e.target.classList.contains('delete-product-btn')) {
      const id = e.target.dataset.id
      deleteProduct(id)
    }
    pushData(products, "productsData")
    renderProductList()
  }
})

//LISTENER PRODUCT FORM
productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  handleProductForm(editingProductId)
  pushData(products, "productsData")
  renderProductList()
  cleanProductForm()
})


fetchProductsData()
fetchCartData()
fetchSalesData()

renderProductList()
renderCart()



