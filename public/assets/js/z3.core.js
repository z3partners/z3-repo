$(document).ready(function () {

    $(".edit-cat-btn").click(function (e) {
        const elm = e.target.closest(".edit-cat-btn");
        const catDetails = JSON.parse(elm.dataset.category);
        document.getElementById("addLink").style.display = "inline-flex";
        document.getElementById("category").value = catDetails.category_name;
        document.getElementById("catId").value = catDetails.category_id;
        document.getElementById("flexSwitchCheckChecked").checked = catDetails.status ? "checked" : '';
        document.getElementById("catBtn").innerHTML = "Edit";
    });

    $(".del-cat-btn").click(function (e) {
        const elm = e.target.closest(".del-cat-btn");
        const catDetails = JSON.parse(elm.dataset.category);
        const res = confirm(`Are your sure to DELETE ${catDetails.category_name}`);
        if (res) {
            $.post("/del-category", {
                    catId: catDetails.category_id
                },
                function (data, status) {
                    console.log(data);
                });
        }
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