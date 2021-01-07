class Album {
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.id = 1;
    this.maxAlbum = 100;
    this.nextArrow = document.querySelector('.btn__next_js');
    this.prevArrow = document.querySelector('.btn__prev_js');
    this.modals = document.querySelectorAll('.modal-wrapper');
    this.modalsSelector = document.querySelector('.albumBigPhoto_js');
    this.modalContent = document.querySelector('.modal-dialog');

    this.initSlider();
  }

  getTemplate(photo, titles) {
    const photos = photo.map(item => {
      return `
        <div class="album__photo">
          <div class="album__photo_wrap" data-type="photo" data-id="${item.id}"></div>
          <img src="${item.thumbnailUrl}" alt="${item.id}">
        </div>    
      `
    })
    const title = titles.map(item => {
      return `
        <div class="album_title">${item.title}</div>    
      `
    })
    return `
      <div class="album__item">
        ${title.join('')}
        <div class="album__item__wrap">
          ${photos.join('')}
        </div>
      </div>
    `
  }

  async render(id) {
    const responsePhoto = await fetch(`http://jsonplaceholder.typicode.com/photos?albumId=${id}`);
    if (responsePhoto.ok == false) {
      console.log('error fetch photo');
    }    
    const photo = await responsePhoto.json();

    const responseTitle = await fetch(`http://jsonplaceholder.typicode.com/albums?id=${id}`);
    if (responseTitle.ok == false) {
      console.log('error fetch title');
    } 
    const title = await responseTitle.json();

    this.element.innerHTML = this.getTemplate(photo, title);

    this.postPhoto = this.element.querySelectorAll('[data-type="photo"]');

    this.modal(this.postPhoto, photo);    
  }

  modal(items, photo) {
    this.modalClose();
    items.forEach(element => {
      element.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        photo.forEach(item => {
          if(item.id == id) {
            this.modalsSelector.classList.add('modal__active');
            document.body.classList.add('body__hide');
            this.modalContent.innerHTML = `
              <img src="${item.url}" alt="${item.id}">
            `;
          }
        })
      })
    });
  }

  modalClose() {
    const closet = () => this.modals.forEach(function (modal) {
      if (modal.classList.contains('modal__active') == true) {
        modal.classList.remove('modal__active');
        document.body.classList.remove('body__hide');
      }
    })
    document.querySelectorAll('.modal-close-js').forEach(function (close) {
      close.addEventListener('click', () => {
        closet();
      });
    });
  }

  slider() {
    this.render(this.id);
  }

  nextSlide() {
    return this.id += 1;
  }

  prevSlide() {
    return this.id -= 1;
  }

  arrowNextHide() {
    if (this.id === this.maxAlbum) {
      this.nextArrow.classList.add('arrow_none');
    } else {
      this.nextArrow.classList.remove('arrow_none');
    }
  }

  arrowPrevHide() {
    if (this.id === 1) {
      this.prevArrow.classList.add('arrow_none');
    } else {
      this.prevArrow.classList.remove('arrow_none');
    }
  }

  initSlider() {
    this.slider();
    this.arrowPrevHide();

    this.nextArrow.addEventListener('click', () => {
      this.nextSlide();
      this.slider();
      this.arrowPrevHide();
      this.arrowNextHide();
    });

    this.prevArrow.addEventListener('click', () => {
      this.prevSlide();
      this.slider();
      this.arrowPrevHide();
      this.arrowNextHide();
    });
  }
}

new Album(".album__track-js")