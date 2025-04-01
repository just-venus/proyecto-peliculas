const createAutoComplete = ({root, rederOption, noOptionSelect, inputValue, fetchData}) => {
    //Funcion autocomplete

    root.innerHTML =`
    <label><b>Busqueda</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dopdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `
}

const input = root.querySelector('input')
const dropdown = root.querySelector('.dropdown')
const resultWrapper = root.querySelector('.result')

const debonce = (func, delay = 1000) =>{
    let timeoutId
    return(...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(null,args)
        }, delay)
    }
}

const onInput = async event => {
    const items = await fetchData(event.target,value)
    console.log("Movie",items)
}

if (!items.length){
    dropdown.classList.add('is-active')
    return
}

resultWrapper.innerHTML = ''
dropdown.classList.add('is-active')
for(let item of items){
    const option = document.createElement('a')
    
    option.classList.add('dropdown-item')
    option.innerHTML = renderOption(item)
    option.addEventListener('click',() => {
        dropdown.classList.remove('is-active')
        input.value = inputValue(item)
        onOptionSelect(item)
        console.log("onMovieSelect")
    })
    resultWrapper.appendChild(option)
}