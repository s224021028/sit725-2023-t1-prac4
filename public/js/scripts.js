const color_palette = ["indigo", "red", "pink", "purple", "green", "orange"]
i = 0
function changeColor() {
    const navbar = document.getElementById("navbar")
    const footer = document.getElementById("foot")
    if (i >= color_palette.length - 1)
    {
        //console.log(i)
        navbar.classList.replace(color_palette[i], color_palette[i % (color_palette.length - 1)])
        footer.classList.replace(color_palette[i], color_palette[i % (color_palette.length - 1)])
        i = 0
    }
    else
    {
        //console.log(i)
        navbar.classList.replace(color_palette[i], color_palette[i % color_palette.length + 1])
        footer.classList.replace(color_palette[i], color_palette[i % color_palette.length + 1])
        i++
    }
}

function limitCharacters(element)
{
    const maxLength = 8
    var numValue = element.value
    if (numValue.length > maxLength)
    {
        element.value = numValue.substr(0, maxLength)
    }
}

function checkEmptyInput()
{
    const num1 = document.getElementById("num1")
    const num2 = document.getElementById("num2")
    const dialog = document.getElementById("dialog")
    if (num1.value.length == 0 || num2.value.length == 0)
    {
        var instance = M.Modal.init(dialog)
        instance.open()
        return false
    }
    return true
}

function openHistory()
{
    const historySidenav = document.getElementById("slide-out")
    var instance = M.Sidenav.init(historySidenav)
    instance.open()
}

function getHistory()
{
    $.get("/history", (res) => {
        console.log(res.data)
        updateHistory(res.data)
    })
}

function updateHistory(data)
{
    data.forEach(i => {
        var operator
        if (i.operator == "add")
            operator = "+"
        else if (i.operator == "sub")
            operator = "-"
        else if (i.operator == "mul")
            operator = "*"
        else if (i.operator == "div")
            operator = "/"
        else if (i.operator == "mod")
            operator = "%"
        else if (i.operator == "pow")
            operator = "^"
        collectionItem = '<li class="collection-item center active"><h6>'+i.numberA+'&nbsp'+operator+'&nbsp'+i.numberB+'&nbsp'+'&#61'+'&nbsp'+i.result+'</h6></li>'
        $("#slide-out").append(collectionItem) 
    });
}

function getFormData()
{
    var formData = {}
    formData.numA = document.getElementById("num1").value
    formData.numB = document.getElementById("num2").value
    var operationRadios = document.getElementsByName("operation")
    for(var i = 0; i < operationRadios.length; i++)
    {
        if(operationRadios[i].checked)
        {
            formData.operation = operationRadios[i].value
            break
        }
    }
    formData.showDecimal = document.getElementById("decimal-switch").checked
    postData(formData)
}

function postData(formData)
{
    $.post("/result", formData, (res, status) => {
        console.log(status)
    })
}

$(function() {
    $("#form").on("submit", () => {
        getFormData()
    })
    getHistory()
})