const productForm = document.getElementById('product-form')
const productNameInput = document.getElementById('product-name')
const productDescriptionInput = document.getElementById('product-description')
const productCostInput = document.getElementById('product-cost')
const productPriceInput = document.getElementById('product-price')
const productTable = document.getElementById('product-table')
const productTableList = productTable.querySelector('tbody')
const cartItemsTable = document.querySelector("#cart-items-table tbody")

let productsArray = [
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
let productId = null
let cart = []

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
  showCart()
}

//SHOW CART
function showCart() {
  const cartItems = cart.map((item, index) => {
    const product = productsArray.find(itemProduct => itemProduct.id === item.productId)
    console.log(product)
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td><button class="delete-item-cart-btn" data-id="${index}">Deletar</button></td>
    </tr>
    `
  }).join('')

  cartItemsTable.innerHTML = cartItems
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


