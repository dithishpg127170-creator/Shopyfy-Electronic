

const PRODUCTS_KEY = 'shopyfy_products_v1';
const CART_KEY = 'shopyfy_cart_v1';
const ORDERS_KEY = 'shopyfy_orders_v1';
const ADMIN_KEY = 'shopyfy_admin_logged_v1';

const sampleProducts = [
  
  { 
    id:'p2', 
    title:'Laptop Pro 14"', 
    price:54999, 
    image:'assets/images/laptop.jpg', 
    desc:'8GB RAM • 512GB SSD', 
    stock:5, 
    sold:0 
  },
  { 
    id:'p3', 
    title:'Bluetooth Headphones', 
    price:2999, 
    image:'assets/images/headphones.jpg', 
    desc:'Noise cancelling', 
    stock:12, 
    sold:0 
  },
  { 
    id:'p4', 
    title:'Smartwatch S', 
    price:4999, 
    image:'assets/images/smartwatch.jpg', 
    desc:'Fitness tracker', 
    stock:8, 
    sold:0 
  },
  { 
    id:'p5', 
    title:'Wireless Charger', 
    price:999, 
    image:'assets/images/charger.jpg', 
    desc:'Fast wireless charging', 
    stock:20, 
    sold:0 
  },
  { 
    id:'p6', 
    title:'Gaming Mouse', 
    price:2499, 
    image:'assets/images/gaming_mouse.jpg', 
    desc:'RGB, 8000 DPI', 
    stock:15, 
    sold:0 
  },

  { 
    id:'p7', 
    title:'Vivo Smartphone', 
    price:19999, 
    image:'assets/images/vivo.jpg', 
    desc:'Premium camera • AMOLED', 
    stock:10, 
    sold:0 
  }
];



function loadProducts() {
  const s = localStorage.getItem(PRODUCTS_KEY);
  if(s) return JSON.parse(s);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
  return sampleProducts.slice();
}
function saveProducts(arr) { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(arr)); }
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
function getOrders(){ return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
function saveOrders(o){ localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }

function updateCartCount(){
  const c = getCart();
  const count = c.reduce((s,i)=>s + (i.qty||0), 0);
  document.querySelectorAll('#cart-count').forEach(e => e.textContent = count);
}
function renderProductsGrid(filter){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  const prods = loadProducts();
  const items = filter ? prods.filter(p=>p.title.toLowerCase().includes(filter.toLowerCase())) : prods;
  grid.innerHTML = items.map(p => `
    <div class="col-sm-6 col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.title}" onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(p.title)}'">
        <div class="card-body d-flex flex-column">
          <h5>${p.title}</h5>
          <p class="text-muted mb-1">${p.desc}</p>
          <div class="mb-2 d-flex justify-content-between align-items-center">
            <div class="product-price">₹ ${p.price.toLocaleString()}</div>
            <div><span class="badge ${p.stock>0?'bg-success':'bg-danger'} badge-stock">${p.stock>0?p.stock+' in stock':'Out of stock'}</span></div>
          </div>
          <div class="mt-auto d-flex justify-content-between">
            <a class="btn btn-outline-primary" href="Product2.html?id=${p.id}">View</a>
            <button class="btn btn-primary" ${p.stock<=0? 'disabled' : ''} onclick="addToCart('${p.id}')">Add</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function renderProductDetail(){
  const el = document.getElementById('product-detail'); if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = loadProducts().find(x=>x.id===id);
  if(!p) { el.innerHTML = '<div class="alert alert-warning">Product not found</div>'; return; }
  el.innerHTML = `<div class="col-md-6"><img src="${p.image}" class="img-fluid" onerror="this.src='https://via.placeholder.com/800x500?text=${encodeURIComponent(p.title)}'"></div>
  <div class="col-md-6">
    <h3>${p.title}</h3>
    <p class="text-muted">${p.desc}</p>
    <div class="mb-2"><strong>₹ ${p.price.toLocaleString()}</strong> <span class="badge bg-secondary ms-2">${p.stock} in stock</span></div>
    <div>
      <button class="btn btn-primary" ${p.stock<=0? 'disabled' : ''} onclick="addToCart('${p.id}')">Add to cart</button>
    </div>
  </div>`;
}

function addToCart(id){
  const products = loadProducts();
  const p = products.find(x=>x.id===id);
  if(!p) return alert('Product not found');
  if(p.stock<=0) return alert('Out of stock');
  const cart = getCart();
  const it = cart.find(x=>x.id===id);
  if(it) it.qty++; else cart.push({ id:p.id, title:p.title, price:p.price, image:p.image, qty:1 });
  saveCart(cart);
  alert(p.title + ' added to cart');
}
function renderCart(){
  const el = document.getElementById('cart-items'); if(!el) return;
  const cart = getCart();
  if(!cart.length){ el.innerHTML = '<p class="text-muted">Cart is empty</p>'; document.getElementById('cart-summary') && (document.getElementById('cart-summary').innerHTML = ''); updateCartCount(); return; }
  el.innerHTML = cart.map(it=>`
    <div class="card mb-2 p-2">
      <div class="d-flex align-items-center">
        <img src="${it.image}" style="width:90px;height:70px;object-fit:cover;border-radius:6px" onerror="this.src='https://via.placeholder.com/120x90?text=Img'">
        <div class="ms-3 flex-grow-1">
          <strong>${it.title}</strong>
          <div class="text-muted">₹ ${it.price} × ${it.qty} = ₹ ${it.price * it.qty}</div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty('${it.id}', -1)">-</button>
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="changeQty('${it.id}', 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="removeFromCart('${it.id}')">Remove</button>
        </div>
      </div>
    </div>`).join('');
  const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  document.getElementById('cart-summary').innerHTML = `<div class="card p-3"><div class="d-flex justify-content-between"><strong>Total:</strong><strong>₹ ${total.toLocaleString()}</strong></div></div>`;
  updateCartCount();
}
function changeQty(id, delta){
  const c = getCart();
  const it = c.find(x=>x.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) { const idx = c.findIndex(x=>x.id===id); c.splice(idx,1); }
  saveCart(c); renderCart();
}
function removeFromCart(id){
  const c = getCart().filter(x=>x.id!==id);
  saveCart(c); renderCart();
}


function placeOrder(name, address){
  const cart = getCart();
  if(!cart.length) return alert('Cart is empty');
  const products = loadProducts();
  
  cart.forEach(item => {
    const p = products.find(x=>x.id===item.id);
    if(p){
      p.stock = Math.max(0, p.stock - item.qty);
      p.sold = (p.sold || 0) + item.qty;
    }
  });
  saveProducts(products);
  const order = { id:'o'+Date.now(), name, address, items:cart, total: cart.reduce((s,i)=>s+i.price*i.qty,0), date: new Date().toISOString() };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  saveCart([]);
  alert('Order placed! Thank you.');
  const res = document.getElementById('order-result'); if(res) res.innerHTML = `<div class="alert alert-success">Order placed. Order ID: ${order.id}</div>`;
}

function adminLogin(username, password){
  if(username==='admin' && password==='admin123'){ localStorage.setItem(ADMIN_KEY, '1'); location.href = 'dashboard.html'; return true; }
  alert('Invalid admin credentials'); return false;
}
function adminLogout(){ localStorage.removeItem(ADMIN_KEY); location.href = 'login.html'; }
function requireAdmin(){ if(!localStorage.getItem(ADMIN_KEY)){ location.href = 'login.html'; return false; } return true; }

function renderAdminProducts(){
  const el = document.getElementById('admin-products-list'); 
  if(!el) return;

  const prods = loadProducts();

  el.innerHTML = prods.map(p=>{

    let imgSrc = p.image || '';
    if(imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')){
      imgSrc = '../' + imgSrc;   
    }

    return `
    <div class="d-flex align-items-center admin-card mb-2">
      <img src="${imgSrc}" 
           style="width:80px;height:60px;object-fit:cover;border-radius:6px"
           onerror="this.src='https://via.placeholder.com/120x90?text=Img'">

      <div class="ms-3 flex-grow-1">
        <strong>${p.title}</strong>
        <div class="text-muted">₹ ${p.price} • Stock: ${p.stock} • Sold: ${p.sold||0}</div>
      </div>

      <div>
        <button class="btn btn-sm btn-success me-1" onclick="restockPrompt('${p.id}')">Restock</button>
        <button class="btn btn-sm btn-primary me-1" onclick="editProductPrompt('${p.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
    `;
  }).join('');

  renderAdminSummary();
}

function renderAdminOrders(){
  const el = document.getElementById('admin-orders'); if(!el) return;
  const orders = getOrders();
  if(!orders.length) { el.innerHTML = '<div class="text-muted">No orders yet</div>'; return; }
  el.innerHTML = orders.map(o=>`
    <div class="card p-2 mb-2"><div><strong>Order ${o.id}</strong><div class="text-muted small">${new Date(o.date).toLocaleString()}</div><div>Total: ₹ ${o.total}</div></div></div>
  `).join('');
}
function renderAdminSummary(){
  const el = document.getElementById('admin-summary'); if(!el) return;
  const prods = loadProducts();
  const totalSold = prods.reduce((s,p)=>s + (p.sold||0), 0);
  const totalStock = prods.reduce((s,p)=>s + (p.stock||0), 0);
  el.innerHTML = `<div>Total products: ${prods.length}</div><div>Total sold: ${totalSold}</div><div>Total stock: ${totalStock}</div>`;
}

function restockPrompt(id){
  const qty = parseInt(prompt('Enter restock quantity'),10);
  if(!qty || qty<=0) return;
  const prods = loadProducts(); const p = prods.find(x=>x.id===id); if(!p) return;
  p.stock = (p.stock||0) + qty;
  saveProducts(prods); renderAdminProducts(); alert('Restocked');
}
function editProductPrompt(id){
  const prods = loadProducts(); const p = prods.find(x=>x.id===id); if(!p) return;
  const title = prompt('Title', p.title); if(!title) return;
  const price = parseInt(prompt('Price', p.price),10); if(!price) return;
  const stock = parseInt(prompt('Stock', p.stock),10); if(isNaN(stock)) return;
  const image = prompt('Image URL', p.image) || p.image;
  p.title = title; p.price = price; p.stock = stock; p.image = image;
  saveProducts(prods); renderAdminProducts(); alert('Updated');
}
function deleteProduct(id){
  if(!confirm('Delete product?')) return;
  const prods = loadProducts().filter(x=>x.id!==id);
  saveProducts(prods); renderAdminProducts();
}
function addNewProduct(){
  const title = document.getElementById('new-title').value.trim();
  const price = parseInt(document.getElementById('new-price').value,10);
  const stock = parseInt(document.getElementById('new-stock').value,10) || 0;
  const image = document.getElementById('new-image').value || 'https://via.placeholder.com/600x400?text=No+Image';
  if(!title || isNaN(price)) return alert('Title and price required');
  const prods = loadProducts();
  const id = 'p' + Date.now();
  prods.push({ id, title, price, image, desc:'No description', stock, sold:0 });
  saveProducts(prods);
  document.getElementById('new-title').value=''; document.getElementById('new-price').value=''; document.getElementById('new-stock').value=''; document.getElementById('new-image').value='';
  renderAdminProducts();
}

document.addEventListener('DOMContentLoaded', ()=>{

  updateCartCount();

  if(document.getElementById('products-grid')){
    renderProductsGrid();
    const s = document.getElementById('search-input'); if(s){
      s.addEventListener('input', (e)=> renderProductsGrid(e.target.value));
    }
  }

  if(document.getElementById('product-detail')){
    renderProductDetail();
  }

  if(document.getElementById('cart-items')){
    renderCart();
  }

  const placeBtn = document.getElementById('place-order');
  if(placeBtn){
    placeBtn.onclick = ()=> {
      const name = document.getElementById('cust-name').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      if(!name || !address) return alert('Please enter name and address');
      placeOrder(name,address);
    };
  }

  if(document.getElementById('admin-login-btn')){
    document.getElementById('admin-login-btn').onclick = ()=> {
      const u = document.getElementById('admin-username').value.trim();
      const p = document.getElementById('admin-password').value.trim();
      if(adminLogin(u,p)) location.href = 'dashboard.html';
    };
  }

  if(document.getElementById('admin-products-list')){
    if(!requireAdmin()) return;
    renderAdminProducts();
    renderAdminOrders();
    const logoutBtn = document.getElementById('admin-logout');
    if(logoutBtn) logoutBtn.onclick = adminLogout;
    const addBtn = document.getElementById('add-product');
    if(addBtn) addBtn.onclick = addNewProduct;
  }

});
