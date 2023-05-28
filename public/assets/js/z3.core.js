$(document).ready(function () {

    $('#selectCat').change(function (e) {
        const selectedVal = e.target.value;
        const subCat = (allSubCat[`'${selectedVal.toString()}'`]) ? allSubCat[`'${selectedVal.toString()}'`] : [];
        populateCategory('#selectSubCat', subCat);
    });

    $('#investor_list').change(function (e) {
        const selectedVal = e.target.value;
        if (selectedVal) {
            const fundsData = (funds[`${selectedVal.toString()}`]) ? funds[`${selectedVal.toString()}`] : [];
            populateInvestorFund('#fund_association', fundsData.split(", "));
            const financialSelect = document.getElementById("financial_year");
            if (financialSelect) {
                if (investorFinYear[selectedVal] === 'April - March') {
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
        const res = confirm(`Are you sure you want to delete ${catDetails.category_name}`);
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
        const res = confirm(`Are you sure you want to delete ${catDetails.category_name}`);
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
        delInvestorBtnClick(e);
    });

    $(".del-user-btn").click(function (e) {
        delUserBtnClick(e);
    });

    $(".del-document-btn").click(function (e) {
        delDocumentBtnClick(e);
    });

    $(".send-document").click(function (e) {
        sendDocument(e);
    });

    $(".edit-link").click(function (e) {
        editLink(e);
    });

    $("#change-pass-btn").click(function (e) {
        $("span.danger").text('');
        const password = document.getElementById("password").value;
        const newPassword = document.getElementById("new_password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if(newPassword.trim()=== '' || confirmPassword.trim() === '' || password.trim() === '') {
            $("span.danger").html(`Please enter all fields.`);
        } else if(!newPassword.match(regularExpression)) {
            $("span.danger").html(`
        1. Password should be at least six characters long<br>
        2. Password should contain at least one number<br>
        3. Password should contain at least one special character
        `);
        } else if(newPassword !== confirmPassword) {
            $("span.danger").html('New Password and Confirm Password is not matching.');
        } else {
            let formElem = document.getElementById("change-pass");
            formElem.submit();
        }
    });

    $("#reset-pass-btn").click(function (e) {
        $("span.danger").text('');
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        if(confirmPassword.trim() === '' || password.trim() === '') {
            $("span.danger").html('Please enter all fields.');
        } else if(!password.match(regularExpression)) {
            $("span.danger").html(`
        1. Password should be at least six characters long<br>
        2. Password should contain at least one number<br>
        3. Password should contain at least one special character
        `);
        }  else if(password !== confirmPassword) {
            $("span.danger").html('New Password and Confirm Password is not matching.');
        } else {
            let formElem = document.getElementById("change-pass");
            formElem.submit();
        }
    });

    $("li.menu-item.side-nav-cat").click(function (e) {
        const closestElem = e.target.closest("li.menu-item.side-nav-cat");
        const catData = JSON.parse(closestElem.dataset.category);

        let formElem = document.getElementById("nav-cat-list");
        let hiddenInputCatId = document.getElementById("nav_cat_id");
        hiddenInputCatId.value = catData.category_id;
        formElem.submit();

    });


});

function formSubmit(action, id, roleId) {

    const formActionMap = Object.freeze({
        investor: 'edit-investor',
        document: 'edit-document',
        profile: 'profile',
        password: 'password',
        userpass: 'create-user-pass',
        user: 'edit-user',
        invpass: 'create-investor-pass'

    });

    let formElem = document.getElementById("edit-form");
    let hiddenInputId = document.getElementById("edit-id");
    let hiddenInputRole = document.getElementById("role_id");
    formElem.action = formActionMap[action];
    hiddenInputId.value = id;
    hiddenInputRole.value = roleId;
    //console.log(formElem);
    formElem.submit();
}

function generateFinancialYear(startMonth) {
    const today = new Date();
    const startYear = 2019;
    const endYear = 2031;
    let financialYearList = [];
    for (var i = startYear; i <= endYear; i++) {
        if (startMonth === 'apr') {
            financialYearList.push(`${i}-${i + 1}`);
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



const regularExpression = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/;
function passwordFormat(password, passwordElem) {
    if(!password.match(regularExpression)) {
        passwordElem.setCustomValidity(`
        1. Password should be at least six characters long
        2. Password should contain at least one number
        3. Password should contain at least one special character
        `);
    } else {
        passwordElem.setCustomValidity('');
    }
}

function editLink(e) {
    const closestElem = e.target.closest(".edit-link");
    const category = closestElem.dataset.category;
    const roleId = (closestElem.dataset.role) ?  closestElem.dataset.role : null;
    const dataSet = JSON.parse(closestElem.dataset[category]);
    const editIdMap = Object.freeze({
        investor: 'user_id',
        document: 'document_id',
        profile: 'user_id',
        password: 'user_id',
        user: 'user_id',
        userpass: 'user_id',
        invpass: 'user_id'
    });

    const id = dataSet[editIdMap[category]];
    //console.log(category, id, roleId);
    formSubmit(category, id, roleId);
}

function delInvestorBtnClick (e) {
    const elm = e.target.closest(".del-investor-btn");
    const investorDetails = JSON.parse(elm.dataset.investor);
    const res = confirm(`Are you sure you want to delete ${investorDetails.company_legal_name}`);
    if (res) {
        $.post("./del-investor", {
                investor_id: investorDetails.user_id,
                username: investorDetails.username,
                company_legal_name: investorDetails.company_legal_name
            },
            function (data, status) {
                location.href = "./investor";
            });
    }
}

function sendDocument(e) {
    const elm = e.target.closest(".send-document");
    const documentDetails = JSON.parse(elm.dataset.document);
    const send_to = documentDetails.send_to || '';
    const investorEmailID = (documentDetails.investor_id === -999) ? `All ${send_to}`.trim().replace(" All", '') : investorEmail[`'${documentDetails.investor_id}'`];
    const ccList = (documentDetails.investor_id !== -999) ? investorEmailCCList[`'${documentDetails.investor_id}'`] : '';
    const invStatus = investorStatus[`'${documentDetails.investor_id}'`];
    const invFirstName = investorFName[`'${documentDetails.investor_id}'`];
    const res = confirm(`Are you sure you want to send an email notification to ${investorEmailID} ?`);
    document.querySelector("p.form-label").innerHTML = '';
    if (res) {
        let route = "./send-document";
        if (investorEmailID.indexOf('All') > -1) {
            route = "./send-all";
        }
        $.post(route, {
            ...documentDetails,
            investorEmailID: investorEmailID,
            investorCCList: ccList,
            invFirstName: invFirstName,
            investorStatus: invStatus
        }, function (data, status) {
            if (data.message) {
                document.querySelector("p.form-label").innerHTML = `<span class="danger">${data.message}</span>`;
            }
            // console.log(data);
        });
    }
}

function delDocumentBtnClick(e) {
    const elm = e.target.closest(".del-document-btn");
    const documentDetails = JSON.parse(elm.dataset.document);
    const investorEmailID = (documentDetails.investor_id === -999) ? 'All' : investorEmail[`'${documentDetails.investor_id}'`];
    const res = confirm(`Are you sure you want to delete ${documentDetails.document_name} along with file.`);
    if (res) {
        $.post("./del-document", {
                document_id: documentDetails.document_id,
                investorEmailID: investorEmailID,
            },
            function (data, status) {
                location.href = "./documents";
            });
    }
}

function delUserBtnClick(e) {
    const elm = e.target.closest(".del-user-btn");
    const userDetails = JSON.parse(elm.dataset.user);
    const res = confirm(`Are you sure you want to delete ${userDetails.first_name}`);
    if (res) {
        $.post("./del-user", {
                user_id: userDetails.user_id,
                username: userDetails.username,
            },
            function (data, status) {
                location.href = "./users";
            });
    }
}

function populateSendTo(role_id) {
    let sendTo = $("#selectSendTo");
    sendTo.empty();
    if(role_id === 1)  {
        sendTo.append(`<option value="">Select</option>`)
        sendTo.append(`<option value="All">All</option>`)
        sendTo.append(`<option value="Domestic">Domestic</option>`);
        sendTo.append(`<option value="International">International</option>`)
    } else if (role_id === 4) {
        sendTo.append(`<option value="Domestic">Domestic</option>`);
    } else if (role_id === 5) {
        sendTo.append(`<option value="International">International</option>`);
    }
}