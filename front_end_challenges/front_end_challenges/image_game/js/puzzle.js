const container = document.querySelector(".image-container")
const startButton = document.querySelector(".start-button")
const gameText = document.querySelector(".game-text")
const playTime = document.querySelector(".play-time")

const tileCount = 16;

let tiles = [];
const dragged = {
  el: null,
  class: null,
  index: null,
}

let isPlaying = false;
let timeInterval = null;
let time = 0;


//function

function setGame() {
  isPlaying = true;
  time = 0;
  container.innerHTML = "";
  gameText.style.display = 'none'
  clearInterval(timeInterval)

  tiles = createImageTiles();
  console.log(tiles)

  tiles.forEach(tile => container.appendChild(tile))

  setTimeout(() => {
    container.innerHTML = ""; //reset
    shuffle(tiles).forEach(tile => container.appendChild(tile))

    timeInterval = setInterval(() => {

        playTime.innerText = time;
        time++;
      
    }, 2000)

  }, 5000)
}

function createImageTiles() {
  const tempArray = [];
  Array(tileCount).fill().forEach((_, i) => {
    console.log(tileCount)
    const li = document.createElement("li")
    li.setAttribute('data-index', i) //index
    li.setAttribute('draggable', 'true')  //for draggable
    li.classList.add(`list${i}`) //class
    li.innerText = `index${i}`
    tempArray.push(li)
  })
  return tempArray;
}

function shuffle(array) {
  let index = array.length - 1; //last index
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
    index--;
  }
  return array;
}

function checkStatus() {
  const currentList = [...container.children]
  const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index)
  if (unMatchedList.length === 0) {
    gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timeInterval)
  }
}


// events
container.addEventListener('dragstart', e => {
  if (!isPlaying) return;
  console.log(e)
  const li_element = e.target;
  dragged.el = li_element;
  dragged.class = li_element.className;
  dragged.index = [...li_element.parentNode.children].indexOf(li_element);
  console.log(li_element)
})

container.addEventListener('dragover', e => {
  e.preventDefault()
})

container.addEventListener('drop', e => {
  if (!isPlaying) return;
  const li_element = e.target;
  console.log(li_element)
  if (li_element.className !== dragged.class) {
    let originPlace;
    let isLast = false;

    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }
    const droppedIndex = [...li_element.parentNode.children].indexOf(li_element);
    dragged.index > droppedIndex ? li_element.before(dragged.el) : li_element.after(dragged.el)
    isLast ? originPlace.after(li_element) : originPlace.before(li_element)
  }
  checkStatus();
})

startButton.addEventListener('click', () => {
  setGame();
})