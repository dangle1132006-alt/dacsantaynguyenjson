let allProducts = []; // Biến toàn cục lưu danh sách sản phẩm sau khi tải về từ JSON

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    initProductFilter();
    initContactForm();
});

/**
 * 1. Logic tìm kiếm và lọc sản phẩm (Real-time)
 */
function initProductFilter() {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const priceSelect = document.getElementById('price-select');

    if (!searchInput && !categorySelect) return;

    function filterProducts() {
        if (allProducts.length === 0) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categorySelect ? categorySelect.value : 'all';
        const selectedPrice = priceSelect ? priceSelect.value : 'all';

        const filteredData = allProducts.filter(product => {
            // Lọc theo tên
            const matchName = product.name.toLowerCase().includes(searchTerm);
            
            // Lọc theo danh mục
            const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
            
            // Lọc theo giá
            let matchPrice = false;
            if (selectedPrice === 'all') {
                matchPrice = true;
            } else if (selectedPrice === 'under-150' && product.price < 150000) {
                matchPrice = true;
            } else if (selectedPrice === '150-300' && product.price >= 150000 && product.price <= 300000) {
                matchPrice = true;
            } else if (selectedPrice === 'over-300' && product.price > 300000) {
                matchPrice = true;
            }

            return matchName && matchCategory && matchPrice;
        });

        // Cập nhật lại giao diện với mảng dữ liệu mới
        renderProducts(filteredData);
    }

    // Gắn sự kiện lắng nghe khi người dùng gõ phím hoặc chọn danh mục (Cập nhật không cần load lại trang)
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categorySelect) categorySelect.addEventListener('change', filterProducts);
    if (priceSelect) priceSelect.addEventListener('change', filterProducts);
}

/**
 * 2. Xử lý phản hồi giả lập khi gửi form liên hệ (contact.html)
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Ngăn trang reload

        const fullname = document.getElementById('fullname')?.value;

        // Thông báo gửi thành công
        alert(`Cảm ơn bạn ${fullname}! Yêu cầu tư vấn/đặt hàng đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.`);

        // Reset form
        contactForm.reset();
    });
}

/**
 * 3. Fetch dữ liệu từ JSON và Render
 */
function fetchProducts() {
    const container = document.getElementById('product-container');
    if (!container) return; // Không phải trang có chứa sản phẩm

    fetch('js/product.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data; // Lưu lại vào biến toàn cục để bộ lọc có thể dùng
            renderProducts(allProducts); // Vẽ ra màn hình lần đầu
        })
        .catch(error => {
            container.innerHTML = '<p style="text-align:center;width:100%;">Lỗi tải danh sách sản phẩm".</p>';
        });
}

/**
 * 4. Hàm vẽ sản phẩm ra giao diện
 */
function renderProducts(data) {
    const container = document.getElementById('product-container');

    if (!container) return;

    // Nếu mảng rỗng (khi lọc không có kết quả)
    if (data.length === 0) {
        container.innerHTML = '<p style="text-align:center;width:100%;font-weight:bold;color:#777;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>';
        return;
    }

    let htmlContent = '';
    
    data.forEach(product => {
        const priceFormatted = new Intl.NumberFormat('vi-VN').format(product.price) + ' VNĐ';
        
        htmlContent += `
            <article class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="price">${priceFormatted}</p>
                    <div class="actions">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline">Chi tiết sản phẩm</a>
                    </div>
                </div>
            </article>
        `;
    });
    
    container.innerHTML = htmlContent;
}