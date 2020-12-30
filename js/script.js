class Album {
  constructor() {
    this.id = 0;

    this.prevArrow = document.querySelector('.btn__prev_js');
    this.nextArrow = document.querySelector('.btn__next_js');

    this.albumTrack = document.querySelector('.album__track-js');
    this.photo = document.querySelector('.album__photo');

    this.modals = document.querySelectorAll('.modal-wrapper');

    this.summ = document.querySelector('.summ');

    this.elements = [];

    this.appendNewDiv = parent => parent.appendChild(document.createElement('div'));

    const wrap = this.appendNewDiv(this.albumTrack);
    const title = this.appendNewDiv(wrap);
    const itemAlbumWrap = this.appendNewDiv(wrap);

    wrap.classList.add('album__item');
    title.classList.add('album_title');
    itemAlbumWrap.classList.add('album__item__wrap');

    this.itemAlbumWrap = itemAlbumWrap;
    this.title = title;
  }
  
  // album photo
  async photosResponse() {
    const responseAlbumPhotos = await fetch('https://jsonplaceholder.typicode.com/photos');
    this.albumPhotos = await responseAlbumPhotos.json();

    let tmp = this.albumPhotos.reduce((sum, curr) => {
      let tmp = sum[curr.albumId];
      if (tmp == undefined) {
        sum[curr.albumId] = tmp = {};
        tmp.albumId = curr.albumId;
        tmp.albums = [];
      };
      tmp.albums.push({
        albumId: curr.albumId,
        id: curr.id,
        thumbnailUrl: curr.thumbnailUrl,
        url: curr.url
      });
      return sum;
    }, {});

    const arr2 = Object.keys(tmp).map(key => tmp[key]);

    return arr2;
  }

  // album title
  async albumResponse() {
    let responseAlbumTitle = await fetch('http://jsonplaceholder.typicode.com/albums');
    let albumTitle = await responseAlbumTitle.json();

    return albumTitle;
  }

  renderByNumber(number) {
    this.photosResponse().then((value) => {
      const { albumId, albums } = value[number];
      this.elements.forEach(e => this.itemAlbumWrap.removeChild(e));

      this.albumResponse().then((album) => {
        const titleBlock = this.title;

        album.forEach(function (item) {
          if (item.id == albumId) {
            titleBlock.textContent = item.title;
          }
        })
      })

      this.elements = albums.map(album => {
        const albumPhoto = this.appendNewDiv(this.itemAlbumWrap);
        albumPhoto.classList.add('album__photo')

        albumPhoto.innerHTML = `
          <div class="album__photo_wrap" id="${album.id}"></div>
          <img src="${album.thumbnailUrl}" alt="${album.id}">  
        `;

        return albumPhoto;
      });
    });
  };

  photosModal() {
    const albumPhoto = this.photosResponse();

    this.albumTrack.addEventListener('click', function (e) {
      if (e.target.classList.contains("album__photo_wrap")) {
        {
          albumPhoto.then((value) => {
            value.forEach((album) => {
              album.albums.forEach((item) => {
                if (e.target.id == item.id) {
                  document.querySelector('.albumBigPhoto_js').classList.add('modal__active');
                  document.body.classList.add('body__hide');
                  document.querySelector('.modal-dialog').innerHTML = `
                    <img src="${item.url}" alt="${item.id}">
                  `;
                };
              })
            })
          })
        }
      }
    })
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
    this.renderByNumber(this.id);

    this.photosModal();

    this.modalClose();
  }

  nextNumm() {
    return this.id += 1;
  }

  prevNumm() {
    return this.id -= 1;
  }

  prevNone() {
    if (this.id === 0) {
      this.prevArrow.classList.add('arrow_none');
    } else {
      this.prevArrow.classList.remove('arrow_none');
    }
  }

  nextNone() {
    this.photosResponse().then((album) => {
      const summ = album.length - 1;

      if (this.id === summ) {
        this.nextArrow.classList.add('arrow_none');
      } else {
        this.nextArrow.classList.remove('arrow_none');
      }
    })
  }

  initSlider() {
    this.slider();
    this.prevNone();

    this.nextArrow.addEventListener('click', () => {
      this.nextNumm();
      this.slider();
      this.prevNone();
      this.nextNone();
    });

    this.prevArrow.addEventListener('click', () => {
      this.prevNumm();
      this.slider();
      this.prevNone();
      this.nextNone()
    });

  }
}

const album = new Album();
album.initSlider();