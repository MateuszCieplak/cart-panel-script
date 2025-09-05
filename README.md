# Floating Cart Panel Script

This is a JavaScript script that can be pasted into the browser console on **any product page** of an online store.  
It extracts product information, saves it to `localStorage`, and displays a floating cart panel.

---

## Features

1. **Extract Product Information**
   - Product name
   - Product price
   - Product image URL
   - Product page URL

2. **Save to Local Storage**
   - Stores cart information under a `cart` object.
   - If the product already exists in the cart, increases its quantity.
   - Otherwise, adds a new product entry.

3. **Render Cart Panel**
   - Shows in the bottom-right corner of the page.
   - Lists products with:
     - Name
     - Quantity
     - Unit price
     - Total price
   - Allows removing products.
   - Shows total cart value.
   - Persists cart data when navigating between pages.

---

## How to Use

1. Open a product page on any online store.
2. Open the browser **Console** (`F12` or `Ctrl+Shift+I` → Console tab).
3. Paste the content of `cart-panel.js` and press **Enter**.
4. The floating cart panel will appear in the bottom-right corner.

---

## Example

```javascript
const product = extractProductInfo();
addToCart(product);
injectStyles();
renderCartPanel();
