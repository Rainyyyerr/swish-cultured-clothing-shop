document.addEventListener('DOMContentLoaded', function () {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const toCustomerInfo = document.getElementById('toCustomerInfo');
    const backToCart = document.getElementById('backToCart');
    const toPayment = document.getElementById('toPayment');
    const backToCustomer = document.getElementById('backToCustomer');
    const placeOrder = document.getElementById('placeOrder');
    const closeAfterConfirm = document.getElementById('closeAfterConfirm');

    let cart = [];

    function initCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            renderCart();
        }
    }

    function toggleCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('active');
            if (cartSidebar.classList.contains('open')) {
                setActiveStep('cart');
            }
        }
    }

    function setActiveStep(stepId) {
        const steps = document.querySelectorAll('.cart-step');
        if (!steps.length) return;
        steps.forEach(step => {
            step.classList.remove('active');
        });
        const stepElement = document.getElementById(`step${stepId.charAt(0).toUpperCase() + stepId.slice(1)}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            updateCartSummary(0);
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="size-selector">
                        <select class="size-select">
                            <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
                            <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
                            <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
                            <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                        </select>
                    </div>
                    <div class="cart-item-controls">
                        <span class="cart-item-price">₱${item.price.toLocaleString()}</span>
                        <div>
                            <span class="quantity">${item.quantity}</span>
                        </div>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}"><i class="ri-close-line"></i></button>
            `;
            cartItemsContainer.appendChild(itemEl);
            subtotal += item.price * item.quantity;
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        });

        document.querySelectorAll('.size-select').forEach(select => {
            select.addEventListener('change', function () {
                const cartItem = this.closest('.cart-item');
                if (cartItem) {
                    const index = parseInt(cartItem.querySelector('.remove-item').getAttribute('data-index'));
                    cart[index].size = this.value;
                    saveCart();
                }
            });
        });

        updateCartSummary(subtotal);
    }

    function updateCartSummary(subtotal) {
        const tax = subtotal * 0.12;
        const total = subtotal + tax;
        const subtotalEl = document.getElementById('cartSubtotal');
        const taxEl = document.getElementById('cartTax');
        const totalEl = document.getElementById('cartTotal');
        if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toLocaleString()}`;
        if (taxEl) taxEl.textContent = `₱${tax.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `₱${total.toLocaleString()}`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                price,
                image,
                size: 'M',
                quantity: 1
            });
        }
        saveCart();
        renderCart();
        if (cartSidebar && !cartSidebar.classList.contains('open')) {
            toggleCart();
        }
        const cartIcon = document.querySelector('#cartToggle i');
        if (cartIcon) {
            cartIcon.classList.add('added');
            setTimeout(() => {
                cartIcon.classList.remove('added');
            }, 500);
        }
    }

    function validateCart() {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return false;
        }
        return true;
    }

    function validateCustomerInfo() {
        let allValid = true;
        const requiredFields = [
            '#customerEmail',
            '#customerPhone',
            '#firstName',
            '#lastName',
            '#customerAddress',
            '#customerCity',
            '#customerZip'
        ];
        requiredFields.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.style.borderColor = '';
        });
        requiredFields.forEach(selector => {
            const el = document.querySelector(selector);
            if (el && !el.value.trim()) {
                el.style.borderColor = 'red';
                allValid = false;
            }
        });
        if (!allValid) {
            alert('Please fill all required fields');
            return false;
        }
        return true;
    }

    function validatePayment() {
        return true;
    }

    function updateFinalSummary() {
        const finalItems = document.getElementById('finalItems');
        if (!finalItems) return;
        finalItems.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            itemEl.innerHTML = `
                <span>${item.name} (${item.size}) × ${item.quantity}</span>
                <span>₱${(item.price * item.quantity).toLocaleString()}</span>
            `;
            finalItems.appendChild(itemEl);
            subtotal += item.price * item.quantity;
        });
        const tax = subtotal * 0.12;
        const total = subtotal + tax;
        const subtotalEl = document.getElementById('finalSubtotal');
        const taxEl = document.getElementById('finalTax');
        const totalEl = document.getElementById('finalTotal');
        if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toLocaleString()}`;
        if (taxEl) taxEl.textContent = `₱${tax.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `₱${total.toLocaleString()}`;
    }

    function resetCheckout() {
        setActiveStep('cart');
        document.querySelectorAll('input').forEach(input => {
            if (input.type !== 'radio') input.value = '';
        });
    }

    if (cartToggle && cartSidebar && cartOverlay) {
        initCart();
        cartToggle.addEventListener('click', function (e) {
            e.preventDefault();
            toggleCart();
        });
        if (closeCart) closeCart.addEventListener('click', toggleCart);
        if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
        if (toCustomerInfo) {
            toCustomerInfo.addEventListener('click', function () {
                if (validateCart()) {
                    setActiveStep('customer');
                }
            });
        }
        if (backToCart) {
            backToCart.addEventListener('click', function () {
                setActiveStep('cart');
            });
        }
        if (toPayment) {
            toPayment.addEventListener('click', function () {
                if (validateCustomerInfo()) {
                    updateFinalSummary();
                    setActiveStep('payment');
                }
            });
        }
        if (backToCustomer) {
            backToCustomer.addEventListener('click', function () {
                setActiveStep('customer');
            });
        }
        if (placeOrder) {
            placeOrder.addEventListener('click', function () {
                if (validatePayment()) {
                    setActiveStep('confirm');
                    cart = [];
                    saveCart();
                }
            });
        }
        if (closeAfterConfirm) {
            closeAfterConfirm.addEventListener('click', function () {
                toggleCart();
                resetCheckout();
            });
        }
    }

    document.querySelectorAll('.arrival__cart').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.arrival__card');
            if (!card) return;
            const nameEl = card.querySelector('.arrival__name');
            const priceEl = card.querySelector('.arrival__price');
            const imageEl = card.querySelector('.arrival__image img');
            if (nameEl && priceEl && imageEl) {
                const name = nameEl.textContent;
                const price = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ''));
                const image = imageEl.src;
                addToCart(name, price, image);
            }
        });
    });
});