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
        } catch (e) {
            console.warn('Cart JSON was invalid, resetting.', e);

            return { products: [] };
        }
    };

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    function addToCart(product) {
        const cart = getCart();

        const indexOfProduct = cart.products.findIndex(p => p.id === product.id);
        let newProducts;

        if (indexOfProduct > -1) {
            newProducts = cart.products.map((p, index) =>
                index === indexOfProduct
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            );
        } else {
            newProducts = [...cart.products, { ...product, quantity: 1 }];
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
        const productName = elementName ? elementName.innerHTML.trim() : 'Unknown Product';

        const priceElement = document.querySelector('.price, [class*="price"]');
        let priceProduct = 0;
        let currencyProduct = '';

        if(priceElement) {
            const rawPriceText = priceElement.innerText.trim()

            priceProduct = parseFloat(rawPriceText.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
            priceProduct = Math.round(priceProduct * 100) / 100;

            const currencyMatch = rawPriceText.match(/[\p{L}]+/u);
            currencyProduct = currencyMatch ? currencyMatch.join('') : '';
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
            const itemsHTML = cart.products.map(item => `
                <div class="cart-item">
                    <p><span class="label">Product name:</span> <span class="value">${item.name}</span></p>
                    <p><span class="label">Quantity:</span> <span class="value">${item.quantity}</span></p>
                    <p><span class="label">Unit price:</span> <span class="value">${item.price.toFixed(2)} ${item.currency}</span></p>
                    <p><span class="label">Total price:</span> <span class="value">${(item.price * item.quantity).toFixed(2)} ${item.currency}</span></p>
                    <button data-id="${item.id}">Delete</button>
                </div>
            `).join('');

            const total = cart.products.reduce((sum, product) => sum + product.price * product.quantity, 0);

            panel.insertAdjacentHTML("afterbegin", `
            <h4>Cart</h4>
            ${itemsHTML}
            <p><strong>Total Cart Price:</strong> ${total.toFixed(2)}</p>
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
        
        style.innerHTML = `
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
                align-items: start;
                line-height: 120%;
            }

            .cart-item .label {
                font-weight: bold;
                display: inline-block;
                width: 90px;
            }
            .cart-item .value {
                color: #333;
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
