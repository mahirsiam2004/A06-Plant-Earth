const categoryContainer = document.getElementById("cat-container");
const mainContainer = document.getElementById("main-container");
const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
        <li class="no-style" id="${cat.id}">${cat.category_name}</li>`;
  });
  // console.lof(cat.id)
};

callAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      const plants = data.plants;
      showAllPlants(plants);
    })
    .catch((err) => {
      console.log(err);
    });
};
showAllPlants = (plants) => {
  mainContainer.innerHTML = "";
  plants.forEach((tree) => {
    mainContainer.innerHTML += `
      <div class="card bg-base-100 shadow-sm">
        <figure class="h-48 w-full">
          <img src="${tree.image}" alt="${
      tree.name
    }" class="w-full h-full object-cover rounded-t-xl" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">${tree.name || "Unknown Tree"}</h2>
          <p>${tree.description}</p>
          <div class="card-actions justify-start">
            <div class="badge badge-outline">${tree.category}</div>
          </div>
          <button class="btn bg-[#15803D] text-white rounded-full">Add to Cart</button>
        </div>
      </div>`;
  });
};

categoryContainer.addEventListener("click", (e) => {
  if (e.target.localName !== "li") return;

  const all_li = document.querySelectorAll("#cat-container li");
  all_li.forEach((li) => {
    li.classList.remove("bg-[#15803D]", "text-white", "rounded-sm", "px-[10px]", "py-[8px]");
  });

  e.target.classList.add("bg-[#15803D]", "text-white", "rounded-sm", "px-[10px]", "py-[8px]");

  if (e.target.id === "all-plants") {
    callAllPlants(); 
  } else {
    loadNewsByCategory(e.target.id);
  }
});


loadNewsByCategory = (id) => {
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.plants);
      displayPlants(data.plants);
    })
    .catch((err) => {
      console.log(err);
    });
};

const displayPlants = (plants) => {
  mainContainer.innerHTML = "";
  plants.forEach((tree) => {
    mainContainer.innerHTML += `
      <div class="card bg-base-100 shadow-sm">
        <figure class="h-48 w-full">
          <img src="${tree.image}" alt="${
      tree.name
    }" class="w-full h-full object-cover rounded-t-xl" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">${tree.name || "Unknown Tree"}</h2>
          <p>${tree.description}</p>
          <div class="card-actions justify-start">
            <div class="badge badge-outline">${tree.category}</div>
          </div>
          <button class="btn bg-[#15803D] text-white rounded-full">Add to Cart</button>
        </div>
      </div>`;
  });
};

document.getElementById("all-plants").addEventListener("click", () => {
  callAllPlants();
  console.log("fuck")
});

loadCategory();
callAllPlants();
