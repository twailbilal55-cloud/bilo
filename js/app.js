/* ===========================================================
   CITTA. — App Logic
   Cart · Products rendering · Page interactions
   =========================================================== */

// ===== CART STATE =====
function getCart() {
    try { return JSON.parse(localStorage.getItem('citta_cart') || '[]'); }
    catch (e) { return []; }
}
function saveCart(cart) {
    localStorage.setItem('citta_cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
}
function addToCart(productId, size = null) {
    const cart = getCart();
    const existing = cart.find(i => i.id === productId && i.size === size);
    if (existing) existing.qty++;
    else cart.push({ id: productId, size, qty: 1 });
    saveCart(cart);
    showToast('تمت إضافة المنتج للسلة ✓');
}
function removeFromCart(productId, size) {
    let cart = getCart();
    cart = cart.filter(i => !(i.id === productId && i.size === size));
    saveCart(cart);
    renderCartPage();
}
function updateQty(productId, size, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(productId, size);
            return;
        }
    }
    saveCart(cart);
    renderCartPage();
}

// ===== TOAST =====
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== RENDER PRODUCTS GRID (homepage) =====
function renderProductsGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid || typeof products === 'undefined') return;

    grid.innerHTML = products.map(p => `
        <article class="product-card" data-stagger-item data-id="${p.id}">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            <a href="product.html?id=${p.id}" class="product-img">
                <span class="icon">${p.image}</span>
            </a>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-price">
                    <span class="price"><small>${p.currency}</small>${formatPrice(p.price)}</span>
                    <button class="add-btn" aria-label="Add to cart" data-add="${p.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    grid.querySelectorAll('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.add));
        });
    });
}

// ===== RENDER PRODUCT DETAIL =====
function renderProductDetail() {
    const wrap = document.getElementById('productDetail');
    if (!wrap || typeof products === 'undefined') return;

    const id = parseInt(new URLSearchParams(location.search).get('id') || '1');
    const p = products.find(x => x.id === id) || products[0];
    let selectedSize = p.sizes[0];

    wrap.innerHTML = `
        <div class="product-3d-viewer">
            <canvas id="product-canvas"></canvas>
            <div class="viewer-hint">
                <i class="fas fa-arrows-rotate"></i>
                <span>Drag to rotate · 3D View</span>
            </div>
        </div>
        <div class="product-detail-info">
            <div class="breadcrumb">
                <a href="index.html">Home</a> /
                <a href="index.html#products">Shop</a> /
                ${p.category}
            </div>
            ${p.badge ? `<span class="product-badge" style="position:relative;display:inline-block;margin-bottom:14px;">${p.badge}</span>` : ''}
            <h1>${p.name}</h1>
            <div class="price-tag">${formatPrice(p.price)} <small style="font-size:1rem;color:var(--c-gray);">${p.currency}</small></div>
            <p class="description">${p.details}</p>

            <div class="size-selector">
                <h4>Select Size</h4>
                <div class="size-options" id="sizeOptions">
                    ${p.sizes.map((s, i) => `<button class="size-option ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
                </div>
            </div>

            <button class="btn btn-primary" id="addToCartBtn" style="width:100%;">
                <span>أضف إلى السلة · Add to Bag</span>
                <i class="fas fa-shopping-bag arrow"></i>
            </button>

            <div class="detail-features">
                <div class="detail-feature"><i class="fas fa-truck-fast"></i><span>توصيل سريع</span></div>
                <div class="detail-feature"><i class="fas fa-shield-halved"></i><span>أصلي 100%</span></div>
                <div class="detail-feature"><i class="fas fa-rotate-left"></i><span>إرجاع 7 أيام</span></div>
                <div class="detail-feature"><i class="fas fa-anchor"></i><span>Citta. Authentic</span></div>
            </div>
        </div>
    `;

    // Size selection
    wrap.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            wrap.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
        });
    });

    // Add to cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(p.id, selectedSize);
    });

    // re-init three viewer (it self-runs on DOMContentLoaded; manual rerun)
    if (typeof THREE !== 'undefined') {
        // Already handled by three-scene.js DOMContentLoaded init
    }
}

// ===== RENDER CART PAGE =====
function renderCartPage() {
    const wrap = document.getElementById('cartContent');
    if (!wrap || typeof products === 'undefined') return;

    const cart = getCart();
    if (cart.length === 0) {
        wrap.innerHTML = `
            <div class="empty-cart">
                <div class="icon"><i class="fas fa-shopping-bag"></i></div>
                <h2>السلة فارغة</h2>
                <p style="color:var(--c-gray);margin-bottom:30px;">ابدأ التسوق وأضف قطعك المفضلة من المجموعة.</p>
                <a href="index.html#products" class="btn btn-primary">
                    <span>تسوق المجموعة</span>
                    <i class="fas fa-arrow-left arrow"></i>
                </a>
            </div>`;
        return;
    }

    let subtotal = 0;
    const items = cart.map(ci => {
        const p = products.find(x => x.id === ci.id);
        if (!p) return '';
        const lineTotal = p.price * ci.qty;
        subtotal += lineTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-img">${p.image}</div>
                <div>
                    <h3>${p.name}</h3>
                    <div class="meta">${p.category}${ci.size ? ' · Size ' + ci.size : ''}</div>
                    <div class="price">${formatPrice(lineTotal)} ${p.currency}</div>
                </div>
                <div style="text-align:left;">
                    <div class="qty-control">
                        <button class="qty-btn" data-dec data-id="${p.id}" data-size="${ci.size || ''}">−</button>
                        <span>${ci.qty}</span>
                        <button class="qty-btn" data-inc data-id="${p.id}" data-size="${ci.size || ''}">+</button>
                    </div>
                    <button class="remove-btn" data-rem data-id="${p.id}" data-size="${ci.size || ''}">إزالة</button>
                </div>
            </div>`;
    }).join('');

    const shipping = subtotal > 10000 ? 0 : 600;
    const total = subtotal + shipping;

    wrap.innerHTML = `
        <div class="cart-grid">
            <div class="cart-items">${items}</div>
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="row"><span>Subtotal</span><span>${formatPrice(subtotal)} DA</span></div>
                <div class="row"><span>Shipping</span><span>${shipping === 0 ? 'مجاني' : formatPrice(shipping) + ' DA'}</span></div>
                <div class="total">
                    <span>Total</span>
                    <span class="accent">${formatPrice(total)} DA</span>
                </div>
                <button class="btn btn-primary" id="checkoutBtn">
                    <span>متابعة الدفع</span>
                    <i class="fas fa-arrow-left arrow"></i>
                </button>
            </div>
        </div>
    `;

    wrap.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => updateQty(parseInt(b.dataset.id), b.dataset.size || null, 1)));
    wrap.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => updateQty(parseInt(b.dataset.id), b.dataset.size || null, -1)));
    wrap.querySelectorAll('[data-rem]').forEach(b => b.addEventListener('click', () => removeFromCart(parseInt(b.dataset.id), b.dataset.size || null)));
    const co = document.getElementById('checkoutBtn');
    if (co) co.addEventListener('click', () => showToast('شكراً! سيتم التواصل معك قريباً ✓'));
}

// ===== CONTACT FORM =====
function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('تم إرسال رسالتك ✓ سنعود إليك قريباً');
        form.reset();
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderProductsGrid();
    renderProductDetail();
    renderCartPage();
    bindContactForm();

    // Smooth anchor scroll for hash links (Lenis handles, but fallback)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const el = document.querySelector(id);
                if (el) {
                    e.preventDefault();
                    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                        window.lenis.scrollTo(el);
                    } else {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
});
