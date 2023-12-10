

const inventory = document.getElementById('inventory');
const slots = document.getElementsByClassName('slot');


export function updateInventory(data, selected) {
    if (!data.length){
        for (let i = 0; i < slots.length; i++) {
            slots[i].innerHTML = ``;
        }
    }
    
    for (let i = 0; i < data.length; i++) {
        if (i == selected){
            slots[i].style.border = "6px inset  black"
        } else{
            slots[i].style.border = "5px outset black"
        }
        slots[i].innerHTML = `<img width="48px" heigth="48px" src='assets/${data[i].name}.png'></img>`;
    }
}

export function setInventoryHidden(hidden) {
    if (hidden) {
        inventory.classList.add('hidden');
    } else {
        inventory.classList.remove('hidden');
    }
  }
  