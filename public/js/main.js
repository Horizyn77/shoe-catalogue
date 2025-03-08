const shoesDisplay = document.querySelector("section");
const brandSelect = document.querySelector("#brandSelect");
const colourSelect = document.querySelector("#colourSelect");
const sizeSelect = document.querySelector("#sizeSelect");
const showAllBtn = document.querySelector("#showAllBtn");
const cartIconBadge = document.querySelector(".cart-icon-badge");
const shopNowBtn = document.querySelector("#shop-now-btn");
const availableShoesSection = document.querySelector("#available-shoes-section");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const menuCloseBtn = document.querySelector(".menu-close-btn");

let cartTotal = 0;

var slideshows = document.querySelectorAll('[data-component="slideshow"]')

slideshows.forEach(initSlideShow);

function initSlideShow(slideshow) {

    var slides = document.querySelectorAll(`.slide`);

    var index = 0, time = 5000;
    slides[index].classList.add('active');

    setInterval(() => {
        slides[index].classList.remove('active');

        index++;

        if (index === slides.length) index = 0;

        slides[index].classList.add('active');

    }, time);
}

const shoeCatalogue = ShoeCatalogue();

async function getShoes() {

    try {
        const data = await axios.get('https://shoe-catalogue-api-au25.onrender.com/api/shoes');

        return data;
    }

    catch (err) {
        console.error(err)
    }
}

function skeletonLoader() {
    for (let i = 0; i < 21; i++) {
        const shoeContainer = document.createElement("div");
        shoeContainer.className = "shoeLoaderContainer";
        shoesDisplay.style.display = "flex";
        shoesDisplay.style.textAlign = "initial";
        shoesDisplay.append(shoeContainer)
    }
}

skeletonLoader()

let shoeDataArr;

async function getShoeData() {
    const shoeData = await getShoes();
    shoeDataArr = [...shoeData.data]
    shoesDisplay.innerHTML = "";
    displayShoes(shoeDataArr)
}

getShoeData();

function displayShoes(arr) {

    arr.forEach(item => {

        const shoeContainer = document.createElement("div");
        const shoeImg = document.createElement("img");
        const shoeName = document.createElement("p");
        const shoeBrand = document.createElement("p");
        const shoeSize = document.createElement("p");
        const shoeColour = document.createElement("p");
        const shoePrice = document.createElement("p");
        const shoeStock = document.createElement("p");
        const addToCartBtn = document.createElement("button");
        const addToWishlistBtn = document.createElement("button");
        const centeredBtnContainer = document.createElement("div");
        const sizeAndColourContainer = document.createElement("div");

        shoeContainer.dataset.shoeId = item.id;
        shoeImg.src = item.img_src;
        shoeName.innerText = item.name;
        shoeBrand.innerText = item.brand;
        shoeSize.innerHTML = `Size: <span class="colouredItems">${item.size}</span>`;
        shoeColour.innerHTML = `Colour: <span class="colouredItems">${item.colour}</span>`;
        shoePrice.innerHTML = `<span>R</span>${item.price}`;
        shoeStock.innerHTML = `<span>${item.in_stock} </span>in stock`;
        addToCartBtn.innerText = "ADD TO CART";
        addToWishlistBtn.innerText = "+ WISHLIST"
        shoeName.style.color = "#333535";
        shoePrice.style.color = "#333535";
        addToCartBtn.style.border = "1px solid #333535";
        addToWishlistBtn.style.border = "1px solid #333535";


        shoeContainer.className = "shoeContainer";
        shoeImg.className = "shoeImage";
        shoeStock.className = "shoeStock";
        addToCartBtn.className = "addToCartBtn";
        addToWishlistBtn.className = "addToWishlistBtn";
        centeredBtnContainer.className = "centeredBtnContainer"
        sizeAndColourContainer.className = "sizeAndColourContainer";
        shoeBrand.className = "shoeBrand";
        shoeSize.className = "shoeSize";
        shoeColour.className = "shoeColour";
        shoePrice.className = "shoePrice";

        shoesDisplay.style.display = "flex";
        shoesDisplay.style.textAlign = "initial";

        centeredBtnContainer.append(addToCartBtn, addToWishlistBtn);
        sizeAndColourContainer.append(shoeSize, shoeColour);
        shoeContainer.append(shoeImg, shoeName, shoeBrand, sizeAndColourContainer, shoePrice, shoeStock, centeredBtnContainer);
        shoesDisplay.append(shoeContainer)
    })

    const addBtnElem = document.querySelectorAll(".addToCartBtn");

    addBtnElem.forEach(item => {

        item.addEventListener("click", async () => {

            if (localStorage.getItem("jwtToken")) {

                const shoeId = item.closest(".shoeContainer").dataset.shoeId;

                try {
                    const response = await createCart(shoeId);

                    cartTotal = response.data.cartTotal;
                    cartIconBadge.innerText = cartTotal;

                } catch (error) {
                    console.log(error)
                }

                Toastify({

                    text: " Item added to cart",

                    duration: 3000,

                    avatar: "/images/icons/check.png",

                    style: {
                        fontFamily: "'Oxygen', sans-serif"
                    }
                }).showToast();

            } else {
                showLoginForm();
            }
        })
    })

    const addToWishlistBtnElem = document.querySelectorAll(".addToWishlistBtn");

    addToWishlistBtnElem.forEach(item => {
        item.addEventListener("click", async () => {

            if (localStorage.getItem("jwtToken")) {

                const shoeId = item.closest(".shoeContainer").dataset.shoeId;

                try {
                    await addItemToWishlist(shoeId)
                }

                catch (error) {
                    console.log(error)
                }

                Toastify({

                    text: " Item added to wishlist",

                    duration: 3000,

                    avatar: "/images/icons/check.png",

                    style: {
                        fontFamily: "'Oxygen', sans-serif"
                    }
                }).showToast();
            } else {
                showLoginForm();
            }
        })
    })
}

brandSelect.addEventListener("change", shoeFilter)
colourSelect.addEventListener("change", shoeFilter)
sizeSelect.addEventListener("change", shoeFilter)

async function shoeFilter() {

    shoesDisplay.innerHTML = "";

    const filteredShoeArr = await shoeCatalogue.filterShoes(brandSelect.value, colourSelect.value, sizeSelect.value);

    if (filteredShoeArr.length === 0) {
        const p = document.createElement("p");
        const img = document.createElement("img")
        const div = document.createElement("div");
        p.innerText = "There are no shoes matching your criteria";
        p.classList.add("filterMsg")
        img.src = "./images/icons/no-search-results.png";
        div.append(img)
        shoesDisplay.style.display = "block";
        shoesDisplay.style.textAlign = "center";
        shoesDisplay.append(p, div)
        shoesDisplay.classList.add("centerFilterMsg")
    } else {
        displayShoes(filteredShoeArr);
        shoesDisplay.classList.remove("centerFilterMsg")
    }
}

showAllBtn.addEventListener("click", () => {
    shoesDisplay.innerHTML = "";
    shoesDisplay.classList.remove("centerFilterMsg")
    displayShoes(shoeDataArr)
    brandSelect.value = "default";
    colourSelect.value = "default";
    sizeSelect.value = "default";
})

shopNowBtn.addEventListener("click", () => {
    availableShoesSection.scrollIntoView({ behavior: "smooth" });
})

window.addEventListener("load", () => {
    if (window.location.pathname === "/" && localStorage.getItem("jwtToken")) {
        window.location.href = "/user";
    }
})

hamburgerIcon.addEventListener("click", () => {
    hamburgerMenu.classList.add("open");
    document.querySelector("header").classList.add("menuOpen");
    document.querySelectorAll(".container").forEach(el => el.classList.add("menuOpen"));
})

menuCloseBtn.addEventListener("click", () => {
    hamburgerMenu.classList.remove("open");
    document.querySelector("header").classList.remove("menuOpen");
        document.querySelectorAll(".container").forEach(el => el.classList.remove("menuOpen"));
})