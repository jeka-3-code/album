class Album {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.id = 1;
    this.maxAlbum = 100;
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

  async render(id, element) {
    const photoLink = `http://jsonplaceholder.typicode.com/photos?albumId=${id}`;
    const titleLink = `http://jsonplaceholder.typicode.com/albums?id=${id}`;

    Promise
      .all([photoLink, titleLink].map(url => fetch(url).then(response => {
        if (response.status !== 200) {
          return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
      })))
      .then(data => data.map(v => v.json()))
      .then(data => Promise.all(data))
      .then(data => renderArray(...data))
      .catch(err => console.error(err));

    this.albumTrack = element.querySelector('.album__track_js');
    this.postPhoto = element.querySelectorAll('[data-type="photo"]');
    const trackAlbum = this.albumTrack;

    const renderArray = (responsePhoto, responseTitle) => {
      trackAlbum.innerHTML = this.getTemplate(responsePhoto, responseTitle);

      this.postPhoto = trackAlbum.querySelectorAll('[data-type="photo"]');

      this.modal(this.postPhoto, responsePhoto);
    }
  }

  modal(items, photo) {
    this.modalClose();
    items.forEach(element => {
      element.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        photo.forEach(item => {
          if (item.id == id) {
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

  arrowNextHide(element) {
    if (this.slide === this.maxAlbum) {
      element.querySelector('.btn__next_js').classList.add('arrow_none');
    } else {
      element.querySelector('.btn__next_js').classList.remove('arrow_none');
    }
  }

  arrowPrevHide(element) {
    if (this.slide === 1) {
      element.querySelector('.btn__prev_js').classList.add('arrow_none');
    } else {
      element.querySelector('.btn__prev_js').classList.remove('arrow_none');
    }
  }

  initSlider() {
    this.elements.forEach((element) => {
      this.slide = this.id;
      this.nextArrow = element.querySelector('.btn__next_js');
      this.prevArrow = element.querySelector('.btn__prev_js');
      this.render(this.id, element);
      this.arrowPrevHide(element);
      this.arrowNextHide(element);

      this.nextArrow.addEventListener('click', () => {
        if (this.slide === this.maxAlbum) {
          this.slide = this.maxAlbum;
        } else {
          this.slide += 1;
        }
        this.render(this.slide, element);
        this.arrowPrevHide(element);
        this.arrowNextHide(element);
      })

      this.prevArrow.addEventListener('click', () => {
        this.slide -= 1;
        this.render(this.slide, element);
        this.arrowPrevHide(element);
        this.arrowNextHide(element);
      })

    })
  }
}

new Album(".album_js")