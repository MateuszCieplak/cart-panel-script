(function() {
    function getCart() {
        const rawCart = localStorage.getItem('cart');

        if(!rawCart) {
            return { products: [] };
        }
        try {
            const parsedCart = JSON.parse(rawCart);

            return parsedCart && Array.isArray(parsedCart.products) 
                ? parsedCart 
                : { products: [] };
        } catch (event) {
            console.warn('Cart JSON was invalid, resetting.', event);

            return { products: [] };
        }
    };

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    function addToCart(productToAdd) {
        const cart = getCart();

        const indexOfProduct = cart.products.findIndex(product => product.id === productToAdd.id);
        let newProducts;

        if (indexOfProduct > -1) {
            newProducts = cart.products.map((product, index) =>
                index === indexOfProduct
                    ? { ...product, quantity: product.quantity + 1 }
                    : product
            );
        } else {
            newProducts = [...cart.products, { ...productToAdd, quantity: 1 }];
        }

        saveCart({products: newProducts});
    };

    function removeProduct(id) {
        const cart = getCart();

        const newProducts = cart.products.filter(product => product.id !== id);

        saveCart({products: newProducts});
    };

    function extractProductInfo() {
        const elementName = document.querySelector('h1');
        const productName = elementName ? elementName.textContent.trim() : 'Unknown Product';

        const priceElement = document.querySelector('.price, [class*="price"]');
        let priceProduct = 0;
        let currencyProduct = '';

        if(priceElement) {
            const rawPriceText = priceElement.textContent.trim()

            priceProduct = parseFloat(rawPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
            priceProduct = Math.round(priceProduct * 100) / 100;

            const currencyMatch = rawPriceText.match(/[\d.,]+\s*([^\d.,\s]+)/);
            currencyProduct = currencyMatch ? currencyMatch[1] : '';
        }

        const imgEl = document.querySelector('img');
        const imgURL = imgEl ? imgEl.src : '';

        const urlWebsite = window.location.href;

        const id = window.location.origin + window.location.pathname;

        return {
            id: id,
            name: productName,
            price: priceProduct,
            currency: currencyProduct,
            imgURL,
            webURL: urlWebsite,
        }
    };

    function renderCartPanel() {
        const panelCart = document.querySelector('.panel__cart');

        if (panelCart) {
            panelCart.remove();
        }

        const cart = getCart();

        const panel = document.createElement('div');
        panel.className = 'panel__cart'

        if (cart.products.length === 0) {
            panel.insertAdjacentHTML("afterbegin", '<p>Koszyk jest pusty</p>');
        } else {
            const itemsHTML = cart.products.map(product => `
                <div class="cart-item">
                    <p><span class="label">Product name: </span> <span class="value"> ${product.name}</span></p>
                    <p><span class="label">Quantity: </span> <span class="value"> ${product.quantity}</span></p>
                    <p><span class="label">Unit price: </span> <span class="value"> ${product.price.toFixed(2)} ${product.currency}</span></p>
                    <p><span class="label">Total price: </span> <span class="value"> ${(product.price * product.quantity).toFixed(2)} ${product.currency}</span></p>
                    <button data-id="${product.id}">Delete</button>
                </div>
            `).join('');

            const total = cart.products.reduce((sum, product) => sum + product.price * product.quantity, 0);

            const currency = cart.products.length > 0 ? cart.products[0].currency : '';

            panel.insertAdjacentHTML("afterbegin", `
            <h4>Cart</h4>
            ${itemsHTML}
            <p><strong>Total Cart Price:</strong> ${total.toFixed(2)} ${currency}</p>
            `);
        }

        document.body.appendChild(panel);

        panel.addEventListener('click', event => {
            const currentButton = event.target;

            if(currentButton.tagName === 'BUTTON') {
                const productId = currentButton.getAttribute('data-id');
                removeProduct(productId);
                renderCartPanel();
            }
        })
    }

    function injectStyles() {
        const style = document.createElement('style');
        
        style.textContent = `
            .panel__cart {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                width: 250px;
                z-index: 9999;
                font-size: 14px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
            }
            .panel__cart h4 {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            }
            .panel__cart .cart-item {
                border-bottom: 1px solid #363131ff;
                margin-bottom: 5px;
                padding-bottom: 5px;
                display: flex;
                flex-direction: column;
                align-items: start;
                gap: 5px
            }

            .cart-item p {
                display: flex;
                width: 100%;
                align-items: start;
                line-height: 120%;
                justify-content: space-between;
            }

            .cart-item .label {
                font-weight: bold;
                flex: 1;
            }
            .cart-item .value {
                color: #333;
                flex: 1;
            }
            .cart-item button {
                padding: 5px;
                color: red;
                background: lightgrey;
                border: 1px solid black;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    const product = extractProductInfo();
    addToCart(product);
    injectStyles();
    renderCartPanel();
})();
