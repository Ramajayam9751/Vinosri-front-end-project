
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        badge: "Bestseller",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "Electronics",
        price: 199.99,
        badge: "New",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        category: "Clothing",
        price: 24.99,
        badge: "Eco",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle",
        category: "Home",
        price: 29.99,
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
    },
    {
        id: 5,
        name: "Vitamin C Serum",
        category: "Beauty",
        price: 34.99,
        badge: "Bestseller",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"
    },
    {
        id: 6,
        name: "Wireless Charging Pad",
        category: "Electronics",
        price: 39.99,
        badge: "",
        image: "https://images.unsplash.com/photo-1591290619762-c588e7c1a1d4?w=500"
    },
    {
        id: 7,
        name: "Linen Button-Down Shirt",
        category: "Clothing",
        price: 59.99,
        badge: "New",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500"
    },
    {
        id: 8,
        name: "Ceramic Coffee Mug Set",
        category: "Home",
        price: 32.99,
        badge: "",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500"
    }
];

let cart = [];
let selectedCategory = "All";

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const searchInput = document.getElementById("search");

// Format price
function formatPrice(price) {
    return "$" + price.toFixed(2);
}

// Display products
function displayProducts() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML =
            '<p class="no-products">No products found!</p>';
        return;
    }

    productList.innerHTML = filteredProducts.map(product => `
        <div class="product-card">

            ${product.badge
                ? `<span class="badge">${product.badge}</span>`
                : ""}

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="product-info">
                <p class="product-category">${product.category}</p>

                <h3>${product.name}</h3>

                <p class="price">${formatPrice(product.price)}</p>

                <div class="product-buttons">
                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                    <button
                        class="details-btn"
                        onclick="showDetails(${product.id})">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Add product to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (!product) return;

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    displayCart();
}

// Display cart items
function displayCart() {
    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">
                    <h4>${item.name}</h4>

                    <p class="item-price">
                        ${formatPrice(item.price)}
                    </p>

                    <div class="quantity">
                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                            aria-label="Decrease quantity">-</button>

                        <span>${item.quantity}</span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                            aria-label="Increase quantity">+</button>
                    </div>
                </div>

                <button
                    class="remove-btn"
                    onclick="removeItem(${item.id})"
                    aria-label="Remove ${item.name}">
                    🗑️
                </button>
            </div>
        `).join("");
    }

    updateTotal();
}

// Change quantity
function changeQuantity(id, change) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeItem(id);
        return;
    }

    displayCart();
}

// Remove one item
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    displayCart();
}

// Update cart totals
function updateTotal() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipping;

    document.getElementById("cart-count").textContent = count;
    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);
    document.getElementById("shipping").textContent =
        formatPrice(shipping);
    document.getElementById("total").textContent =
        formatPrice(total);
}

// Clear all cart items
document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    displayCart();
});

// Search products while typing
searchInput.addEventListener("input", displayProducts);

// Search button
document.getElementById("search-btn").addEventListener("click", () => {
    displayProducts();
});

// Category filter
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")
            ?.classList.remove("active");

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        displayProducts();
    });
});

// Product details
function showDetails(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    alert(
        "PRODUCT DETAILS\n\n" +
        "Name: " + product.name + "\n" +
        "Category: " + product.category + "\n" +
        "Price: " + formatPrice(product.price)
    );
}

// Checkout demo
document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add products.");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const total = subtotal + 5;

    alert(
        "ORDER SUMMARY\n\n" +
        "Total products: " +
        cart.reduce((sum, item) => sum + item.quantity, 0) +
        "\nSubtotal: " + formatPrice(subtotal) +
        "\nShipping: $5.00" +
        "\nTotal: " + formatPrice(total) +
        "\n\nThank you for shopping!"
    );
});

// Start website
displayProducts();
displayCart();
