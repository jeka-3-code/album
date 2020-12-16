class AlbumSlider {
  constructor(slideShow, slideScroll) {
    this.btnNextSlide = this.btnNextSlide.bind(this)
    this.btnPrevSlide = this.btnPrevSlide.bind(this)

    this.position = 0;
    this.slidesToShow = slideShow;
    this.slidesToScroll = slideScroll;
    this.container = document.querySelector('.album__container');
    this.track = document.querySelector('.album__track-js');
    this.btnPrev = document.querySelector('.btn__prev_js');
    this.btnNext = document.querySelector('.btn__next_js');
    this.items = document.querySelectorAll('.album__item');
    this.itemsCount = this.items.length;
    this.itemWidth = this.container.clientWidth / this.slidesToShow;
    this.movePosition = this.slidesToScroll * this.itemWidth;

    for (const item of this.items) {
      item.style.minWidth = this.itemWidth + 'px';
    }

    this.btnNext.addEventListener('click', this.btnNextSlide);
    this.btnPrev.addEventListener('click', this.btnPrevSlide);

    this.checkBtns()
  }

  btnNextSlide() {
    const itemsLeft = this.itemsCount - (Math.abs(this.position) + this.slidesToShow * this.itemWidth) / this.itemWidth;

    this.position -= itemsLeft >= this.slidesToScroll ? this.movePosition : itemsLeft * this.itemWidth;

    this.setPosition();
    this.checkBtns();
  }
  btnPrevSlide() {
    const itemsLeft = Math.abs(this.position) / this.itemWidth;

    this.position += itemsLeft >= this.slidesToScroll ? this.movePosition : itemsLeft * this.itemWidth;
    
    this.setPosition();
    this.checkBtns();
  }

  checkBtns() {
    this.btnPrev.disabled = this.position === 0;
    this.btnNext.disabled = this.position <= -(this.itemsCount - this.slidesToShow) * this.itemWidth;
  }

  setPosition() {
    this.track.style.transform = "translateX(" + this.position + "px)";
  }
}

class Album {
  constructor() {
    this.findClickedPhoto = this.findClickedPhoto.bind(this)

    for (const close of document.querySelectorAll('.modal-close-js')) {
      close.addEventListener('click', this.hideModal);
    }

    const albumTrack = document.querySelector('.album__track-js');

    this.slider = null;

    this.getItems().then(() => {
      const grouped = this.groupBy(item => item.albumId);
      this.createHTML(grouped, albumTrack);
    });
  }

  async getItems() {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos');
    this.content = await response.json()
  }

  groupBy(getKey) {
    return this.content.reduce((acc, item) => {
      let key = getKey(item);
      let sublist = acc[key];
      if (!sublist) {
        sublist = [];
        acc[key] = sublist;
      }
      sublist.push(item);
      return acc;
    }, {});
  }

  generateItem(albumTrack, sublist) {
    const wrap = document.createElement('div');
    wrap.classList.add('album__item');

    albumTrack.appendChild(wrap);

    let itemAlbumWrap = document.createElement('div');
    itemAlbumWrap.classList.add('album__item__wrap');

    let title = document.createElement('div');
    title.classList.add('album_title');

    let albumItems = document.querySelectorAll('.album__item');
    let albumItemsCount = albumItems.length;

    title.innerHTML += `
      <span>Альбом ${albumItemsCount}/<small class="summ__item"></small></span>
    `

    wrap.appendChild(title);
    wrap.appendChild(itemAlbumWrap);

    for (let post of sublist) {
      let itemAlbum = document.createElement('div');
      itemAlbum.classList.add('album__photo');
      itemAlbum.innerHTML += `
          <div class="album__photo_wrap" id="${post.id}"></div>
          <img src="${post.thumbnailUrl}" alt="${post.id}">
        `
      itemAlbumWrap.appendChild(itemAlbum);
    }
  }

  createHTML(grouped, albumTrack) {
    for (let [_, sublist] of Object.entries(grouped)) {
      this.generateItem(albumTrack, sublist);
    }

    let albumItem = document.querySelectorAll('.album__item'),
      albumItemSumm = albumItem.length,
      sumItem = document.querySelectorAll('.summ__item');

    sumItem.forEach(function (item) {
      item.innerHTML = albumItemSumm.toString();
    })

    albumTrack.addEventListener('click', this.findClickedPhoto)

    this.slider = new AlbumSlider(1, 1)
  }  

  findClickedPhoto(e) {
    if (e.target.classList.contains("album__photo_wrap")) {
      let postID = +e.target.id;
      for (const post of this.content) {
        if (postID === post.id) {
          this.showModal(post);
        }
      }
    }
  }

  showModal(post) {
    this.hideModal();
    document.querySelector('.albumBigPhoto_js').classList.add('modal__active');
    document.body.classList.add('body__hide');
    document.querySelector('.modal-dialog').innerHTML = `
      <img src="${post.url}" alt="${post.id}">
    `;
  }

  hideModal() {
    let modals = document.querySelectorAll('.modal-wrapper');
    modals.forEach(function (modal) {
      if (modal.classList.contains('modal__active') === true) {
        modal.classList.remove('modal__active');
        document.body.classList.remove('body__hide');
      }
    })
  }
}

const album = new Album();