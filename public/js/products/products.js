// ==============================================================
// addToCart = document.getElementById("add-to-cart-btn")
// addToCart.addEventListener("click", function() {
//     document.getElementById("add-cart-span").innerHTML = `<svg width="25" height="25" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M43 24.9172C41.3601 33.1167 35.1776 40.8374 26.5025 42.5626C22.2715 43.4052 17.8826 42.8914 13.9605 41.0945C10.0385 39.2976 6.78339 36.3091 4.65864 32.5545C2.53389 28.8 1.64785 24.4708 2.12668 20.1834C2.6055 15.8959 4.42478 11.8689 7.32547 8.67557C13.2751 2.1225 23.3211 0.318606 31.5207 3.59842" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
//                                 <path d="M15.1216 21.6374L23.3211 29.837L43 8.51819" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
//                                 </svg>
                                
//                                 <span id="add-to-cart-btn">
//                                     View cart
//                                 </span>`
// })






// ================================================================================
//product-quick-view toggle class
// ================================================================================

var product_quick_view_main = document.querySelector('.product-quick-view-main');
var overlay = document.querySelector('.product-quick-view-overlay');
var container = document.querySelectorAll(".product-img")
container.forEach(cont => {
    cont.addEventListener('click', function() {
        product_quick_view_main.classList.toggle("active");
        overlay.classList.toggle("active");
        document.querySelector('html').style.overflowY = "hidden"
        document.querySelector('body').style.overflowY = "hidden"
    })
})

function closePreview() {
    console.log("clicked")
    product_quick_view_main.classList.remove('active')
    overlay.classList.remove('active')
    document.querySelector('html').style.overflowY = "scroll"
}