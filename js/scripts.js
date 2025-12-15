
document.addEventListener("DOMContentLoaded", () => {
  const cart = [];

  const cartItemsList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const checkoutBtn = document.getElementById("checkout-btn");
  const discountHint = document.getElementById("cart-discount-hint");

  const checkoutSection = document.getElementById("checkout-section");
  const checkoutForm = document.getElementById("checkout-form");
  const confirmationSection = document.getElementById("confirmation-section");

  

  function renderCart() {
    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
      const li = document.createElement("li");
      li.className = "list-group-item text-muted";
      li.textContent = "Your cart is empty.";
      cartItemsList.appendChild(li);

      cartCount.textContent = "0";
      cartSubtotal.textContent = "0.00";
      checkoutBtn.disabled = true;

      discountHint.textContent =
        "Order 3 or more items to receive 10% discount.";
      discountHint.classList.remove("text-success");
      discountHint.classList.add("text-muted");
      return;
    }

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach((item) => {
      totalItems += item.qty;
      subtotal += item.qty * item.price;

      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <div class="small text-muted">Qty: ${item.qty}</div>
        </div>
        <span>$${(item.qty * item.price).toFixed(2)}</span>
      `;

      cartItemsList.appendChild(li);
    });

    cartCount.textContent = String(totalItems);
    cartSubtotal.textContent = subtotal.toFixed(2);
    checkoutBtn.disabled = false;

    if (totalItems >= 3) {
      discountHint.textContent =
        "Nice! A 10% discount will be applied at checkout.";
      discountHint.classList.remove("text-muted");
      discountHint.classList.add("text-success");
    } else {
      discountHint.textContent =
        "Order 3 or more items to receive 10% discount.";
      discountHint.classList.remove("text-success");
      discountHint.classList.add("text-muted");
    }
  }

  function addToCart(id, name, price) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    renderCart();
  }

  
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      addToCart(id, name, price);

      
      const toastEl = document.getElementById("addToast");
      if (toastEl && window.bootstrap) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    });
  });

  
  renderCart();

  

  checkoutBtn.addEventListener("click", () => {
    checkoutSection.classList.remove("d-none");
    checkoutSection.scrollIntoView({ behavior: "smooth" });
  });

  
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const valid = validateForm();
    if (!valid) return;

    showConfirmation();
  });

  

  function validateForm() {
    let isValid = true;

    function checkRequired(id) {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
      return input;
    }

    const firstName = checkRequired("firstName");
    const lastName = checkRequired("lastName");
    const address = checkRequired("address");
    const city = checkRequired("city");
    const zip = checkRequired("zip");
    const email = checkRequired("email");
    const phone = checkRequired("phone");

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailPattern.test(email.value)) {
      email.classList.add("is-invalid");
      isValid = false;
    }

  
    const phonePattern = /^\d+$/;
    if (!phonePattern.test(phone.value) || phone.value.length < 7) {
      phone.classList.add("is-invalid");
      isValid = false;
    }

    
    const zipPattern = /^\d{1,6}$/;
    if (!zipPattern.test(zip.value)) {
      zip.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  

  function calculateTotals() {
    let items = 0;
    let subtotal = 0;

    cart.forEach((item) => {
      items += item.qty;
      subtotal += item.qty * item.price;
    });

    let discount = 0;
    if (items >= 3) {
      
      discount = subtotal * 0.1;
    }

    const taxRate = 0.05; 
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax;

    return { items, subtotal, discount, tax, total };
  }

  function showConfirmation() {
    const totals = calculateTotals();

    
    const summaryBody = document.getElementById("summary-items");
    summaryBody.innerHTML = "";

    cart.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.qty).toFixed(2)}</td>
      `;
      summaryBody.appendChild(tr);
    });

    
    document.getElementById("summary-subtotal").textContent =
      totals.subtotal.toFixed(2);
    document.getElementById("summary-discount").textContent =
      totals.discount.toFixed(2);
    document.getElementById("summary-tax").textContent = totals.tax.toFixed(2);
    document.getElementById("summary-total").textContent =
      totals.total.toFixed(2);

    
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const customerName = `${firstName} ${lastName}`;

    const customerAddress = document.getElementById("address").value.trim();
    const customerCity = document.getElementById("city").value.trim();
    const customerZip = document.getElementById("zip").value.trim();
    const customerEmail = document.getElementById("email").value.trim();
    const customerPhone = document.getElementById("phone").value.trim();

    document.getElementById("confirmation-name").textContent = customerName;

    document.getElementById("summary-customer").innerHTML = `
      ${customerName}<br>
      ${customerAddress}<br>
      ${customerCity}, ${customerZip}<br>
      ${customerEmail}<br>
      ${customerPhone}
    `;

    confirmationSection.classList.remove("d-none");
    confirmationSection.scrollIntoView({ behavior: "smooth" });
  }
});
