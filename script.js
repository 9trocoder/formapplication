document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentStep = 1;
  const formData = {
    name: "",
    email: "",
    phone: "",
    plan: "arcade",
    billing: "monthly", // 'monthly' or 'yearly'
    addons: [],
  };

  const prices = {
    monthly: {
      arcade: 9,
      advanced: 12,
      pro: 15,
      online: 1,
      storage: 2,
      profile: 2,
    },
    yearly: {
      arcade: 90,
      advanced: 120,
      pro: 150,
      online: 10,
      storage: 20,
      profile: 20,
    },
  };

  // DOM Elements
  const steps = document.querySelectorAll(".step-content");
  const stepNumbers = document.querySelectorAll(".step-number");
  const btnNext = document.getElementById("btn-next");
  const btnBack = document.getElementById("btn-back");
  const btnConfirm = document.getElementById("btn-confirm");
  const buttonsContainer = document.querySelector(".buttons-container");

  // Step 1 Elements
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  // Step 2 Elements
  const planCards = document.querySelectorAll(".plan-card");
  const planRadios = document.querySelectorAll('input[name="plan"]');
  const billingSwitch = document.getElementById("billing-switch");
  const monthlyLabel = document.getElementById("monthly-label");
  const yearlyLabel = document.getElementById("yearly-label");
  const planBonuses = document.querySelectorAll(".plan-bonus");
  const planPrices = document.querySelectorAll(".plan-price");

  // Step 3 Elements
  const addonCards = document.querySelectorAll(".addon-card");
  const addonPrices = document.querySelectorAll(".addon-price");

  // Step 4 Elements
  const summaryPlan = document.getElementById("summary-plan");
  const summaryPrice = document.getElementById("summary-price");
  const summaryAddons = document.getElementById("summary-addons");
  const totalPrice = document.getElementById("total-price");
  const totalLabel = document.querySelector(".total-label");
  const changePlanLink = document.getElementById("change-plan");

  // Navigation Logic
  btnNext.addEventListener("click", () => {
    if (currentStep === 1 && !validateStep1()) return;
    currentStep++;
    updateUI();
  });

  btnBack.addEventListener("click", () => {
    currentStep--;
    updateUI();
  });

  btnConfirm.addEventListener("click", () => {
    currentStep++;
    updateUI();
  });

  changePlanLink.addEventListener("click", (e) => {
    e.preventDefault();
    currentStep = 2;
    updateUI();
  });

  function updateUI() {
    // Update Steps Visibility
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    // Update Sidebar Numbers
    stepNumbers.forEach((num, index) => {
      if (index + 1 === currentStep || (currentStep === 5 && index === 3)) {
        num.classList.add("active");
      } else {
        num.classList.remove("active");
      }
    });

    // Update Buttons
    if (currentStep === 1) {
      btnBack.style.visibility = "hidden";
    } else {
      btnBack.style.visibility = "visible";
    }

    if (currentStep === 4) {
      btnNext.style.display = "none";
      btnConfirm.style.display = "block";
    } else if (currentStep === 5) {
      buttonsContainer.style.display = "none";
    } else {
      btnNext.style.display = "block";
      btnConfirm.style.display = "none";
    }

    if (currentStep === 4) {
      renderSummary();
    }
  }

  // Step 1 Validation
  function validateStep1() {
    let isValid = true;
    const inputs = [
      { input: nameInput, error: document.getElementById("error-name") },
      { input: emailInput, error: document.getElementById("error-email") },
      { input: phoneInput, error: document.getElementById("error-phone") },
    ];

    inputs.forEach(({ input, error }) => {
      if (!input.value.trim()) {
        error.style.display = "block";
        input.classList.add("error");
        isValid = false;
      } else {
        error.style.display = "none";
        input.classList.remove("error");
      }
    });

    // Simple Email Regex
    if (emailInput.value.trim() && !/\S+@\S+\.\S+/.test(emailInput.value)) {
      document.getElementById("error-email").innerText = "Invalid format";
      document.getElementById("error-email").style.display = "block";
      emailInput.classList.add("error");
      isValid = false;
    }

    if (isValid) {
      formData.name = nameInput.value;
      formData.email = emailInput.value;
      formData.phone = phoneInput.value;
    }

    return isValid;
  }

  // Step 2 Logic
  planRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      formData.plan = radio.value;
      // Update UI from radio state
      planCards.forEach((card) => {
        card.classList.toggle("selected", card.control.checked);
      });
    });
  });

  // Set initial selected state on load
  document
    .querySelector('.plan-card input[type="radio"]:checked')
    .parentElement.classList.add("selected");

  billingSwitch.addEventListener("change", () => {
    formData.billing = billingSwitch.checked ? "yearly" : "monthly";
    updatePlanPrices();
  });

  function updatePlanPrices() {
    const isYearly = formData.billing === "yearly";

    if (isYearly) {
      monthlyLabel.classList.remove("active");
      yearlyLabel.classList.add("active");
      planBonuses.forEach((b) => (b.style.display = "block"));
    } else {
      monthlyLabel.classList.add("active");
      yearlyLabel.classList.remove("active");
      planBonuses.forEach((b) => (b.style.display = "none"));
    }

    // Update Plan Card Prices
    planPrices[0].innerText = isYearly ? "$90/yr" : "$9/mo";
    planPrices[1].innerText = isYearly ? "$120/yr" : "$12/mo";
    planPrices[2].innerText = isYearly ? "$150/yr" : "$15/mo";

    // Update Addon Prices
    addonPrices[0].innerText = isYearly ? "+$10/yr" : "+$1/mo";
    addonPrices[1].innerText = isYearly ? "+$20/yr" : "+$2/mo";
    addonPrices[2].innerText = isYearly ? "+$20/yr" : "+$2/mo";
  }

  // Step 3 Logic
  addonCards.forEach((card) => {
    const checkbox = card.querySelector('input[type="checkbox"]');

    // Handle click on card to toggle checkbox
    card.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
      updateAddonsData();
    });
  });

  function updateAddonsData() {
    formData.addons = [];
    if (document.getElementById("addon-online").checked)
      formData.addons.push("online");
    if (document.getElementById("addon-storage").checked)
      formData.addons.push("storage");
    if (document.getElementById("addon-profile").checked)
      formData.addons.push("profile");
  }

  // Step 4 Logic
  function renderSummary() {
    const isYearly = formData.billing === "yearly";
    const suffix = isYearly ? "/yr" : "/mo";
    const planPrice = prices[formData.billing][formData.plan];

    // Plan Summary
    summaryPlan.innerText = `${formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1)} (${isYearly ? "Yearly" : "Monthly"})`;
    summaryPrice.innerText = `$${planPrice}${suffix}`;

    // Addons Summary
    summaryAddons.innerHTML = "";
    let addonsTotal = 0;

    formData.addons.forEach((addon) => {
      const price = prices[formData.billing][addon];
      addonsTotal += price;

      const div = document.createElement("div");
      div.classList.add("summary-addon-item");
      div.innerHTML = `
        <span class="summary-addon-name">${addon === "online" ? "Online service" : addon === "storage" ? "Larger storage" : "Customizable profile"}</span>
        <span class="summary-addon-price">+$${price}${suffix}</span>
      `;
      summaryAddons.appendChild(div);
    });

    // Total
    const total = planPrice + addonsTotal;
    totalLabel.innerText = `Total (per ${isYearly ? "year" : "month"})`;
    totalPrice.innerText = `+$${total}${suffix}`;
  }
});
