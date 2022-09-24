function delCat(cat) {
    const catDetails = JSON.parse(cat);
    console.log(catDetails.category_id);
}

$(document).ready(function () {

    $(".edit-cat-btn").click(function (e) {
        const catDetails = JSON.parse(e.target.dataset.category);
        console.log(catDetails);
        document.getElementById("addLink").style.display = "inline-flex";
        document.getElementById("category").value = catDetails.category_name;
        document.getElementById("catId").value = catDetails.category_id;
        document.getElementById("flexSwitchCheckChecked").checked = catDetails.status ? "checked" : '';
        document.getElementById("catBtn").innerHTML = "Edit";
    });
/*
    $("#submit").click(function () {
        $.post("/request",
            {
                name: "viSion",
                designation: "Professional gamer"
            },
            function (data, status) {
                console.log(data);
            });
    });*/
});