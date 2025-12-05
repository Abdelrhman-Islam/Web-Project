// --- 1. قاعدة البيانات (المنتجات بالصور الحقيقية) ---
const productsDB = [
    {
        id: 1,
        name: "بنادول إكسترا - 24 قرص",
        price: 45,
        category: "مسكنات",
        description: "بنادول إكسترا فعال لتسكين الآلام وخفض الحرارة. لطيف على المعدة ومناسب للصداع وآلام الجسم.",
        image: "https://m.media-amazon.com/images/I/71p4qX085mL._AC_SX679_.jpg"
    },
    {
        id: 2,
        name: "فيتامين سي فوار - 1000 ملجم",
        price: 90,
        category: "فيتامينات",
        description: "أقراص فوارة بتركيز عالي من فيتامين C لرفع المناعة ومقاومة نزلات البرد والأنفلونزا.",
        image: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/ala/ala30202/l/37.jpg"
    },
    {
        id: 3,
        name: "كريم سودو للأطفال",
        price: 120,
        category: "عناية بالطفل",
        description: "كريم ملطف وواقي لالتهابات الحفاضات، بتركيبة آمنة تماماً لحديثي الولادة.",
        image: "https://m.media-amazon.com/images/I/61ofCkBUfvL._AC_SX679_.jpg"
    },
    {
        id: 4,
        name: "واقي شمس 50+",
        price: 480,
        category: "عناية بالبشرة",
        description: "حماية فائقة من أشعة الشمس الضارة (UVA/UVB)، ملمس غير دهني ومقاوم للماء.",
        image: "https://icare.ps/upload/11-2023/product/IMG_0509-IDX.png"
    },
    {
        id: 5,
        name: "غسول الفم ليسترين - نعناع",
        price: 85,
        category: "عناية بالفم",
        description: "يقضي على 99% من الجراثيم، يمنع الجير، وينعش النفس برائحة النعناع القوية.",
        image: "https://m.media-amazon.com/images/I/61lmX6D-dOL._AC_SX522_.jpg"
    },
    {
        id: 6,
        name: "ترمومتر ديجيتال",
        price: 150,
        category: "أجهزة طبية",
        description: "قياس دقيق للحرارة في ثواني، شاشة ديجيتال سهلة القراءة، مناسب للكبار والأطفال.",
        image: "https://m.media-amazon.com/images/I/61sUR1qP-EL._AC_SY741_.jpg"
    },
    {
        id: 7,
        name: "دواء كحة جوافة",
        price: 35,
        category: "أدوية كحة",
        description: "مستخلص طبيعي من أوراق الجوافة لتهدئة السعال وطرد البلغم وتوسيع الشعب الهوائية.",
        image: "https://dwaprices.com/upload/1739098230.jpg"
    },
    {
        id: 8,
        name: "شامبو ضد القشرة",
        price: 110,
        category: "عناية بالشعر",
        description: "تركيبة فعالة للقضاء على القشرة والحكة من أول استخدام، يحافظ على نعومة الشعر.",
        image: "https://m.media-amazon.com/images/I/51eaJXWkDFL._AC_SX522_.jpg"
    },
    {
        id: 9,
        name: "أوميجا 3 بلس",
        price: 180,
        category: "فيتامينات",
        description: "كبسولات زيت السمك غنية بالأحماض الدهنية لتعزيز صحة القلب والذاكرة والنشاط الذهني.",
        image: "https://cdn.chefaa.com/filters:format(webp)/fit-in/718x718/public/uploads/products/1593946862vitamin-omega-3-fish-oiljpg"
    },
    {
        id: 10,
        name: "بلاستر طبي",
        price: 40,
        category: "إسعافات أولية",
        description: "بلاستر عالي الجودة للجروح السطحية، يسمح بتنفس الجلد ومقاوم للماء.",
        image: "https://citypharmaeg.com/wp-content/uploads/2024/10/IMG-20241002-WA0031.jpg"
    }
];

// --- 2. تشغيل الأكواد عند تحميل الصفحة ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge(); // تحديث العداد في كل الصفحات

    // لو احنا في صفحة التفاصيل
    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
    }

    // لو احنا في صفحة السلة
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
});

// --- 3. دوال صفحة التفاصيل ---
function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')); // بنجيب الرقم من الرابط

    const product = productsDB.find(p => p.id === productId);

    if (product) {
        document.getElementById('detail-img').src = product.image;
        document.getElementById('detail-name').innerText = product.name;
        document.getElementById('detail-category').innerText = "الرئيسية / " + product.category;
        document.getElementById('detail-price').innerText = product.price + " ج.م";
        document.getElementById('detail-desc').innerText = product.description;
        
        // تشغيل زر الإضافة في صفحة التفاصيل
        document.getElementById('add-to-cart-btn').onclick = () => addToCart(product.id);
    } else {
        document.querySelector('.container').innerHTML = "<h2 style='text-align:center; margin-top:50px;'>عفواً، المنتج غير موجود!</h2>";
    }
}

// --- 4. دوال السلة (إضافة - حذف - عرض) ---
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('pharmacyCart')) || [];
    const product = productsDB.find(p => p.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('pharmacyCart', JSON.stringify(cart));
    updateCartBadge();
    alert(`تمت إضافة "${product.name}" للسلة ✅`);
}

function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('pharmacyCart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if(badge) badge.innerText = total;
}

function renderCartItems() {
    const container = document.querySelector('.cart-items-container');
    const subtotalEl = document.querySelector('.subtotal-display');
    const totalEl = document.querySelector('.total-price-display');
    
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem('pharmacyCart')) || [];
    container.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px;">السلة فارغة 🛒</div>';
    } else {
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            container.innerHTML += `
                <div class="cart-item" style="display:flex; align-items:center; gap:15px; border-bottom:1px solid #eee; padding:15px 0;">
                    <img src="${item.image}" style="width:70px; height:70px; object-fit:contain; border:1px solid #eee; border-radius:8px;">
                    <div style="flex:1;">
                        <h4 style="margin:0 0 5px;">${item.name}</h4>
                        <div style="color:#0d9488; font-weight:bold;">${item.price} ج.م</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#f3f4f6; padding:5px 10px; border-radius:5px;">العدد: ${item.quantity}</span>
                        <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
    }

    if(subtotalEl) subtotalEl.innerText = totalPrice + ' ج.م';
    if(totalEl) totalEl.innerText = (totalPrice > 0 ? totalPrice + 20 : 0) + ' ج.م';
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('pharmacyCart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('pharmacyCart', JSON.stringify(cart));
    renderCartItems();
    updateCartBadge();
}




