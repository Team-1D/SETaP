console.log("working");
// add popup
document.querySelector(".add-note").addEventListener("click", () => {
    document.querySelector("#note-popup").style.display = "block";
});
// close popup
document.querySelector(".close-popup").addEventListener("click", () => {
    document.querySelector("#note-popup").style.display = "none";
});