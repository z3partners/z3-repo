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
            $.post("./del-category", {
                    catId: catDetails.category_id
                },
                function (data, status) {
                    console.log(data);
                });
        }
    });

    $(".edit-subcat-btn").click(function (e) {
        const elm = e.target.closest(".edit-subcat-btn");
        const catDetails = JSON.parse(elm.dataset.category);
        document.getElementById("addLink").style.display = "inline-flex";
        document.getElementById("sub-category").value = catDetails.category_name;
        document.getElementById("category-list").selectedIndex = catDetails.parent_id;
        //document.getElementById("catId").value = catDetails.category_id;
        document.getElementById("flexSwitchCheckChecked").checked = catDetails.status ? "checked" : '';
        document.getElementById("subCatBtn").innerHTML = "Edit";
    });

    $(".del-cat-btn").click(function (e) {
        const elm = e.target.closest(".del-cat-btn");
        const catDetails = JSON.parse(elm.dataset.category);
        const res = confirm(`Are your sure to DELETE ${catDetails.category_name}`);
        if (res) {
            $.post("./del-category", {
                    catId: catDetails.category_id
                },
                function (data, status) {
                    console.log(data);
                });
        }
    });


    $("#subCatBtn").click(function (e) {
        e.preventDefault();
        const category_name = document.getElementById("sub-category").value;
        const parent_id = document.getElementById("category-list").selectedIndex;
        const status = document.getElementById("flexSwitchCheckChecked").checked;
        $("#subCatBtn").attr('disabled','disabled');
        $.post("./add-sub-category", {
                category_name: category_name,
                parent_id: parent_id,
                status: status
            },
            function (data, status) {
                console.log(data, status);
            });

    });
});