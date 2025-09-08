const categoryContainer = document.getElementById("cat-container");
const mainContainer = document.getElementById("main-container");
const cartContainer = document.getElementById("cart-container");
const totalPriceEl = document.getElementById("total-price");
let cart = [];

// Loader 
const setLoader = () => {
  mainContainer.innerHTML = `
    <div class="w-full h-[300px] flex items-center justify-center col-span-3">
      <span class="loading loading-dots loading-xl text-[#15803D]"></span>
    </div>`;
};


const formatMoney = (num) => new Intl.NumberFormat().format(num);

// Load Categories
const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      categories.forEach((cat) => {
        categoryContainer.innerHTML += `
          <li class="cursor-pointer hover:bg-[#15803D]/20 px-[10px] py-[8px] rounded-sm">
            ${cat.category_name}
          </li>`;
      });
    });
};

// Load All Plants
const callAllPlants = () => {
  setLoader();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      showAllPlants(data.plants);
    });
};

// Show Plants
const showAllPlants = (plants) => {
  mainContainer.innerHTML = "";
  plants.forEach((tree) => {
    mainContainer.innerHTML += `
      <div class="card bg-base-100 shadow-sm">
        <figure class="h-48 w-full">
          <img src="${tree.image}" alt="${tree.name}" class="w-full h-full object-cover rounded-t-xl" />
        </figure>
        <div id="${tree.id}" class="card-body">
          <h2 class="card-title cursor-pointer text-[#15803D]">${tree.name}</h2>
          <p class="line-clamp-2">${tree.description}</p>
          <div class="flex items-center justify-between mt-1">
            <div class="badge badge-outline">${tree.category}</div>
            <div class="font-semibold">৳${formatMoney(tree.price)}</div>
          </div>
          <button class="btn btn-cart bg-[#15803D] text-white rounded-full mt-2">Add to Cart</button>
        </div>
      </div>`;
  });
};

// Category filter
categoryContainer.addEventListener("click", (e) => {
  if (e.target.tagName !== "LI") return;

  const all_li = categoryContainer.querySelectorAll("li");
  all_li.forEach((li) => li.classList.remove("bg-[#15803D]", "text-white"));

  e.target.classList.add("bg-[#15803D]", "text-white");

  if (e.target.innerText === "All Trees") {
    callAllPlants();
  } else {
    loadPlantsByCategory(e.target.innerText);
  }
});

// Load Plants By Category
const loadPlantsByCategory = (categoryName) => {
  setLoader();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.plants.filter((p) => p.category === categoryName);
      showAllPlants(filtered);
    });
};

// Modal Elements
const treeModal = document.getElementById("my_modal_5");
const modalTitle = treeModal.querySelector("h3");
const modalDescription = treeModal.querySelector("p");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");
let modalImage = treeModal.querySelector("img");

// Main container 
mainContainer.addEventListener("click", (e) => {

  if (e.target.classList.contains("btn-cart")) {
    handleCart(e.target.closest(".card-body"));
  }

  // Open modal
  if (e.target.classList.contains("card-title")) {
    const card = e.target.closest(".card-body");
    const treeName = card.querySelector(".card-title").innerText;
    const treeImage = card.parentElement.querySelector("img").src;
    const treeDesc = card.querySelector("p").innerText;
    const treeCategory = card.querySelector(".badge").innerText;
    const treePrice = card.querySelector(".font-semibold").innerText;

    modalTitle.innerText = treeName;

    if (!modalImage) {
      modalImage = document.createElement("img");
      modalImage.className = "w-full h-48 object-cover my-2 rounded-lg";
      treeModal.querySelector(".modal-box").insertBefore(modalImage, modalDescription);
    }
    modalImage.src = treeImage;

    modalDescription.innerText = treeDesc;
    modalCategory.innerText = "Category: " + treeCategory;
    modalPrice.innerText = "Price: " + treePrice;

    treeModal.showModal();
  }
});

// Cart Functions
const handleCart = (card) => {
  const title = card.querySelector(".card-title").innerText;
  const id = card.id;
  const price = parseInt(
    card.querySelector(".font-semibold").innerText.replace("৳", "").replace(/,/g, "")
  );

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, title, price, qty: 1 });
  }

  showCart();
};

const showCart = () => {
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach((c) => {
    total += c.price * c.qty;
    cartContainer.innerHTML += `
      <div class="bg-[#F0FDF4] flex justify-between items-center p-2 rounded">
        <div>
          <h2 class="font-semibold">${c.title}</h2>
          <h3 class="text-[#1F2937]">৳${formatMoney(c.price)} x ${c.qty}</h3>
        </div>
        <button class="text-red-500" onclick="removeFromCart('${c.id}')">
          <i class="fa-solid fa-xmark cursor-pointer"></i>
        </button>
      </div>`;
  });
  totalPriceEl.innerText = formatMoney(total);
};

const removeFromCart = (id) => {
  cart = cart.filter((c) => c.id !== id);
  showCart();
};

// Init
loadCategory();
callAllPlants();


