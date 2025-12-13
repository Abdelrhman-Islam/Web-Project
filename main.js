// ================================
// Pharmacy Store - main.js (FULL FILE)
// Cart + Favorites + Product Details
// ================================

// ----------------
// 1. Products DB
// ----------------
const productsDB = [
  { id: 1, name: "بنادول إكسترا - 24 قرص", price: 45, category: "مسكنات", description: "بنادول إكسترا فعال لتسكين الآلام وخفض الحرارة.", image: "https://m.media-amazon.com/images/I/71p4qX085mL._AC_SX679_.jpg" },
  { id: 2, name: "فيتامين سي فوار - 1000 ملجم", price: 90, category: "فيتامينات", description: "أقراص فوارة بتركيز عالي من فيتامين C.", image: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ala/ala30202/l/37.jpg" },
  { id: 3, name: "كريم سودو للأطفال", price: 120, category: "عناية بالطفل", description: "كريم ملطف وواقي لالتهابات الحفاضات.", image: "https://m.media-amazon.com/images/I/61ofCkBUfvL._AC_SX679_.jpg" },
  { id: 4, name: "واقي شمس 50+", price: 480, category: "عناية بالبشرة", description: "حماية فائقة من أشعة الشمس.", image: "https://icare.ps/upload/11-2023/product/IMG_0509-IDX.png" },
  { id: 5, name: "غسول الفم ليسترين", price: 85, category: "عناية بالفم", description: "يقضي على 99% من الجراثيم.", image: "https://m.media-amazon.com/images/I/61lmX6D-dOL._AC_SX522_.jpg" },
  { id: 6, name: "ترمومتر ديجيتال", price: 150, category: "أجهزة طبية", description: "قياس دقيق للحرارة.", image: "https://m.media-amazon.com/images/I/61sUR1qP-EL._AC_SY741_.jpg" },
  { id: 7, name: "دواء كحة جوافة", price: 35, category: "أدوية كحة", description: "مستخلص طبيعي من أوراق الجوافة.", image: "https://dwaprices.com/upload/1739098230.jpg" },
  { id: 8, name: "شامبو ضد القشرة", price: 110, category: "عناية بالشعر", description: "يقضي على القشرة من أول استخدام.", image: "https://m.media-amazon.com/images/I/51eaJXWkDFL._AC_SX522_.jpg" },
  { id: 9, name: "أوميجا 3 بلس", price: 180, category: "فيتامينات", description: "تعزيز صحة القلب والذاكرة.", image: "https://cdn.chefaa.com/filters:format(webp)/fit-in/718x718/public/uploads/products/1593946862vitamin-omega-3-fish-oiljpg" },
  { id: 10, name: "بلاستر طبي", price: 40, category: "إسعافات أولية", description: "بلاستر عالي الجودة للجروح.", image: "https://citypharmaeg.com/wp-content/uploads/2024/10/IMG-20241002-WA0031.jpg" }
];

// ----------------
// 2. CART
// ----------------
function getCart() {
  return JSON.parse(localStorage.getItem('pharmacyCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('pharmacyCart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id) {
  const cart = getCart();
  const product = productsDB.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  saveCart(cart);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = getCart().reduce((s, i) => s + i.quantity, 0);
  badge.innerText = total;
}

function renderCartItems() {
  const container = document.querySelector('.cart-items-container');
  // التأكد من وجود العنصر (لتجنب الأخطاء في الصفحات الأخرى)
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px;">
        <i class="fas fa-shopping-cart" style="font-size:3rem; color:#ddd; margin-bottom:15px;"></i>
        <p>السلة فارغة حالياً</p>
        <a href="products.html" style="color:#0d9488; font-weight:bold;">تصفح المنتجات</a>
      </div>`;
    // تصفير الأسعار في الملخص
    updateSummary(0);
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>${item.price} ج.م × ${item.quantity} = <strong style="color:#0d9488">${itemTotal} ج.م</strong></p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="حذف">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>`;
  });

  // تحديث قسم الملخص
  updateSummary(total);
}

// دالة مساعدة لتحديث الأسعار في HTML
function updateSummary(subtotal) {
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('totalPrice');
  const delivery = subtotal > 0 ? 20 : 0; // التوصيل 20 جنيه فقط إذا كانت السلة غير فارغة

  if(subtotalEl) subtotalEl.innerText = subtotal + ' ج.م';
  if(totalEl) totalEl.innerText = (subtotal + delivery) + ' ج.م';
}

function removeFromCart(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartItems();
}

// ----------------
// 3. FAVORITES
// ----------------
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favs) {
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function toggleFavorite(icon) {
  const card = icon.closest('.product-card');
  if (!card) return;

  const id = parseInt(card.dataset.id);
  const product = productsDB.find(p => p.id === id);
  if (!product) return;

  let favs = getFavorites();
  const exists = favs.some(p => p.id === id);

  if (exists) {
    favs = favs.filter(p => p.id !== id);
    icon.classList.remove('active');
  } else {
    favs.push(product);
    icon.classList.add('active');
  }

  saveFavorites(favs);
}

function syncFavoriteIcons() {
  const favs = getFavorites();
  document.querySelectorAll('.product-card').forEach(card => {
    const icon = card.querySelector('.fav-icon');
    if (!icon) return;
    const id = parseInt(card.dataset.id);
    if (favs.some(p => p.id === id)) icon.classList.add('active');
  });
}

// ----------------
// 4. PRODUCT DETAILS
// ----------------
function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = productsDB.find(p => p.id === id);
  if (!product) return;

  document.getElementById('detail-img').src = product.image;
  document.getElementById('detail-name').innerText = product.name;
  document.getElementById('detail-category').innerText = product.category;
  document.getElementById('detail-price').innerText = product.price + ' ج.م';
  document.getElementById('detail-desc').innerText = product.description;
  document.getElementById('add-to-cart-btn').onclick = () => addToCart(product.id);
}

// ----------------
// INIT
// ----------------
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  syncFavoriteIcons();

  if (window.location.pathname.includes('product-details.html')) loadProductDetails();
  if (window.location.pathname.includes('cart.html')) renderCartItems();
});

// ================================
// 5. BLOG SYSTEM
// ================================

const blogDB = [
    {
        id: 1,
        title: "5 طرق لتقوية مناعتك قبل الشتاء",
        category: "general", // صحة عامة
        categoryAr: "صحة عامة",
        date: "20 نوفمبر 2025",
        excerpt: "مع دخول فصل الشتاء، تزداد فرص الإصابة بنزلات البرد. تعرف على أهم الأطعمة لتعزيز المناعة.",
        image: "https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg?w=900"
    },
    {
        id: 2,
        title: "روتين العناية بالبشرة الدهنية",
        category: "skin", // عناية بالبشرة
        categoryAr: "عناية بالبشرة",
        date: "18 نوفمبر 2025",
        excerpt: "أفضل المنتجات والخطوات اليومية للحفاظ على نضارة البشرة الدهنية وتقليل الحبوب.",
        image: "https://img.freepik.com/free-photo/skincare-products-still-life_23-2149141066.jpg?w=740"
    },
    {
        id: 3,
        title: "ارتفاع حرارة الطفل: متى تقلق؟",
        category: "child", // صحة الطفل
        categoryAr: "صحة الطفل",
        date: "15 نوفمبر 2025",
        excerpt: "دليل الأم للتعامل مع السخونية عند الأطفال، ومتى يجب الذهاب للطبيب فوراً.",
        image: "https://img.freepik.com/free-photo/mother-measuring-temperature-her-ill-kid_23-2148866761.jpg?w=740"
    },
    {
        id: 4,
        title: "فيتامين د: المصادر والأعراض",
        category: "nutrition", // تغذية
        categoryAr: "تغذية",
        date: "10 نوفمبر 2025",
        excerpt: "لماذا يشعر الكثيرون بالإرهاق؟ قد يكون السبب نقص فيتامين د. اكتشف المصادر الطبيعية.",
        image: "https://img.freepik.com/free-photo/assortment-vegetables-green-background_23-2148882416.jpg?w=740"
    },
    {
        id: 5,
        title: "فوائد شرب الماء للبشرة",
        category: "skin",
        categoryAr: "عناية بالبشرة",
        date: "05 نوفمبر 2025",
        excerpt: "هل شرب الماء يكفي لنضارة البشرة؟ حقائق علمية عن ترطيب الجلد من الداخل.",
        image: "https://img.freepik.com/free-photo/woman-drinking-water_144627-14228.jpg?w=740"
    },
    {
        id: 6,
        title: "أفضل الأطعمة لزيادة التركيز",
        category: "nutrition",
        categoryAr: "تغذية",
        date: "01 نوفمبر 2025",
        excerpt: "قائمة بأهم الأطعمة التي تساعد على تنشيط الذاكرة وزيادة التركيز أثناء الدراسة والعمل.",
        image: "https://img.freepik.com/free-photo/healthy-food-brain_23-2148820464.jpg?w=740"
    }
];

function renderBlog(category, btnElement = null) {
    const container = document.getElementById('blogGrid');
    if (!container) return;

    // 1. تصفية المقالات
    const filteredPosts = category === 'all' 
        ? blogDB 
        : blogDB.filter(post => post.category === category);

    // 2. تحديث شكل الأزرار (Active State)
    if (btnElement) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    // 3. مسح المحتوى القديم وعرض الجديد
    container.innerHTML = '';
    
    if (filteredPosts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد مقالات في هذا القسم حالياً.</p>';
        return;
    }

    filteredPosts.forEach(post => {
        container.innerHTML += `
            <article class="blog-card">
                <div class="card-img">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="card-content">
                    <span class="tag">${post.categoryAr}</span>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-excerpt">${post.excerpt}</p>
                    <div class="card-footer">
                        <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                        <span class="read-more-link">اقرأ المزيد <i class="fas fa-arrow-left"></i></span>
                    </div>
                </div>
            </article>
        `;
    });
}

