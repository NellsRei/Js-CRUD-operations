// let Product = JSON.parse(localStorage.getItem("products")) || [];
// let Cart = JSON.parse(localStorage.getItem("cart")) || [];
const productUrl = "http://localhost:3000/Products";
let isEdit = false;
let editProductId;

const maindiv = document.querySelector(".prods");
const productprice = document.getElementById("Pprice");
const imageUrl = document.getElementById("imageurl");
const productname = document.getElementById("Pname");
const productQuantity = document.getElementById("Pquantity");
const button = document.getElementById("btn");
const btn = document.getElementsByClassName("edit");

async function addProduct() {
  if (!isEdit) {
    // console.log("add");
    let newProduct = {
      // id: Math.ceil(Math.random() * 1000),
      Pname: productname.value,
      imageurl: imageUrl.value,
      Pprice: parseFloat(productprice.value),
      Pquantity: parseFloat(productQuantity.value),
    };

    //Product.push(newProduct);
    if (button.textContent === "Add Product") {
      await fetch(productUrl, {
        method: "POST",
        body: JSON.stringify(newProduct),
      });
    }
    alert("Product successfully added");
    getProducts();
  } else {
    updateProduct(editProductId);
  }
  // saveProducts();
  // displayProduct(list);
}
async function getProducts() {
  const products = await fetch(productUrl);
  const list = await products.json();
  displayProduct(list);
}
getProducts();
function displayProduct(list) {
  //   console.log("products (display products) -> ", Product);
  maindiv.innerHTML = "";
  if (list.length === 0) {
    maindiv.innerHTML = "No Products found";
  } else {
    list.forEach((prod) => {
      const prodElement = document.createElement("div");
      prodElement.className = "item";
      prodElement.innerHTML = `
        <h1>${prod.Pname}</h1>
        <img src="${prod.imageurl}" alt="">
        <h3>${prod.Pprice}</h3>

        <p>${prod.Pquantity}</p>
<div class="comm">
         <button class="delete" onclick="deleteProduct(${prod.id})">Delete</button>
         <button class ="edit" onclick="editProduct(${prod.id})">Edit</button>
         </div>
         <button class ="cart" onclick="addCart(${prod.id})">Add to Cart</button>
        `;
      // maindiv.appendChild(prodElement);
    });
  }
}

function editProduct(product) {
  // const product = Product.find((prod) => prod.id === productId);
  //   console.log("edit product -> ", product);

  productname.value = product.Pname;
  imageUrl.value = product.imageurl;
  productprice.value = product.Pprice;
  productQuantity.value = product.Pquantity;
  button.textContent = "Update";
  editProductId = product;
  isEdit = true;
}

async function updateProduct(id) {
  let response = await fetch(productUrl + id);
  let prod = await response.json();
  if (prod.id) {
    editProduct(product);

    btn.addEventListener("click", async () => {
      if (btn.textContent === "update") {
        let updatedProduct = {
          Pname: productname.value,
          Pprice: productprice.value,
          Pquantity: productQuantity.value,
          imageurl: imageUrl.value,
          id,
        };
        await sendRequest(updatedProduct);
      }
    });
  }

  isEdit = false;
  //   console.log("products updated (after)", Product);

  resetForm();
}
async function sendRequest({ id, ...updatedProduct }) {
  await fetch(productUrl + id, {
    method: "PUT",
    body: JSON.stringify(updatedProduct),
  });
}
async function deleteProduct(id) {
  await fetch(productUrl + id, {
    method: "DELETE",
  });
}

function addCart(ProductId, quantity) {
  const Prod = Product.find((item) => item.id === ProductId);
  //   console.log("Product (add to cart) -> ", Product);
  if (!Prod || Prod.Pquantity < quantity) {
    console.log("Not enough stock");
  }
  if (Prod) {
    console.log("Product already in cart");
  }
  const cartItem = Cart.find((item) => item.ProductId === ProductId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    Cart.push({
      ProductId: ProductId,
      ProductName: Prod.Pname,
      image: Prod.imageurl,
      quantity: Prod.Pquantity,
    });

    Prod.quantity -= quantity;
  }
  saveProducts();
  displayProduct();
}

function resetForm() {
  console.log("reset form");
  productname.value = "";
  imageUrl.value = "";
  productprice.value = "";
  productQuantity.value = "";
  button.textContent = "Add Product";
  button.onclick = addProduct;
}
button.addEventListener("click", addProduct);
