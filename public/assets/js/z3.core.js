$(document).ready(function () {

    $('#selectCat').change(function (e) {
        const selectedVal = e.target.value;
        const subCat = (allSubCat[`'${selectedVal.toString()}'`]) ? allSubCat[`'${selectedVal.toString()}'`]: [];
        populateCategory('#selectSubCat', subCat);
    });

    $('#investor_list').change(function (e) {
        const selectedVal = e.target.value;
        if(selectedVal) {
            const fundsData = (funds[`${selectedVal.toString()}`]) ? funds[`${selectedVal.toString()}`]: [];
            populateInvestorFund('#fund_association', fundsData.split(", "));
            const financialSelect = document.getElementById("financial_year");
            if(financialSelect) {
                if(investorFinYear[selectedVal] === 'April - March') {
                    populateFinancialYear('#financial_year', generateFinancialYear('apr'));
                } else {
                    populateFinancialYear('#financial_year', generateFinancialYear('jan'));
                }
            }
        } else {
            populateInvestorFund('#fund_association', []);
        }
    });

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
                    catId: catDetails.category_id,
                    parent_id: catDetails.parent_id
                },
                function (data, status) {
                    location.href = "./category";
                });
        }
    });

    $(".edit-subcat-btn").click(function (e) {
        const elm = e.target.closest(".edit-subcat-btn");
        const catDetails = JSON.parse(elm.dataset.category);
        document.getElementById("addLink").style.display = "inline-flex";
        document.getElementById("subCategory").value = catDetails.category_name;
        document.getElementById("categoryId").value = catDetails.parent_id;
        document.getElementById("subCatId").value = catDetails.category_id;
        document.getElementById("flexSwitchCheckChecked").checked = catDetails.status ? "checked" : '';
        document.getElementById("subCatBtn").innerHTML = "Edit";
    });

    $(".del-subcat-btn").click(function (e) {
        const elm = e.target.closest(".del-subcat-btn");
        const catDetails = JSON.parse(elm.dataset.category);
        const res = confirm(`Are your sure to DELETE ${catDetails.category_name}`);
        if (res) {
            $.post("./del-category", {
                    catId: catDetails.category_id,
                    parent_id: catDetails.parent_id
                },
                function (data, status) {
                    location.href = "./sub-category";
                });
        }
    });

    $(".del-investor-btn").click(function (e) {
        const elm = e.target.closest(".del-investor-btn");
        const investorDetails = JSON.parse(elm.dataset.investor);
        const res = confirm(`Are your sure to DELETE ${investorDetails.company_legal_name}`);
        if (res) {
            $.post("./del-investor", {
                    investor_id: investorDetails.user_id,
                },
                function (data, status) {
                    location.href = "./investor";
                });
        }
    });

    $(".del-document-btn").click(function (e) {
        const elm = e.target.closest(".del-document-btn");
        const documentDetails = JSON.parse(elm.dataset.document);
        const res = confirm(`Are your sure to DELETE ${documentDetails.document_name} along with file.`);
        if (res) {
            $.post("./del-document", {
                    document_id: documentDetails.document_id,
                },
                function (data, status) {
                    location.href = "./documents";
                });
        }
    });

    $(".send-document").click(function (e) {
        const elm = e.target.closest(".send-document");
        const documentDetails = JSON.parse(elm.dataset.document);
        const investorEmailID = investorEmail[`'${documentDetails.investor_id}'`];

        const res = confirm(`Are your sure to send details at ${investorEmailID}`);
        if (res) {
            $.post("./send-document", documentDetails,
                function (data, status) {
                    console.log(data);
                    //location.href = "./documents";
                });
        }
    });
});

function generateFinancialYear(startMonth) {
    const today = new Date();
    const startYear = 2019;
    const endYear = today.getFullYear();
    let financialYearList = [];
    for(var i = startYear; i <= endYear; i++) {
        if(startMonth === 'apr') {
            financialYearList.push(`${i}-${i+1}`);
        } else {
            financialYearList.push(`${i}`);
        }
    }
    return financialYearList;
}

function populateFinancialYear(selector, data) {
    let finYearSelect = $(selector);
    finYearSelect.empty();
    finYearSelect.append(`<option value="">Select</option>`)
    data.forEach(y => {
        finYearSelect.append(`<option value="${y}">${y}</option>`);
});
}