const navbarBtn = document.querySelector('.navbar-btn')
const navbarNav = document.querySelector('.navbar-nav')

navbarBtn.addEventListener('click', function(){
  if(navbarBtn.classList.contains('active')){
    navbarBtn.classList.remove('active')
    navbarNav.style = 'transform: translateX(-340px); transition: 0.3s'
    setTimeout(() => {
      navbarNav.removeAttribute('style')
    }, 400);
  }else{
    navbarBtn.classList.add('active')
    navbarNav.style = 'transform: translateX(0); transition: 0.3s'
  }
})
window.addEventListener('resize', function(){
  if(window.innerWidth > 1200){
    navbarNav.removeAttribute('style')
    navbarBtn.classList.remove('active')
  }
})

// swipe
let x = null;
let timeMove = 1000;
document.addEventListener('touchstart', e => x = e.touches[0].clientX);
document.addEventListener('touchmove', e => {
  if (!x) return;
  x = x - e.touches[0].clientX < 0 ? 0 : -180;
  navbarNav.style.transform = `translate(${x}%,0)`;
  navbarNav.style.transition = `${timeMove}ms`;
  x = null;
});

// tab
const shopTabLinks = document.querySelectorAll('.shop-tab__links a')
const shopTabItems = document.querySelectorAll('.shop-tab__content--items')

shopTabLinks.forEach(function(link, key){
  link.addEventListener('click', function(){
    shopTabLinks.forEach(function(link2, key2){
      shopTabLinks[key2].classList.remove('active')
      shopTabItems[key2].classList.remove('active')
    })
    shopTabLinks[key].classList.add('active')
    shopTabItems[key].classList.add('active')
  })
})

// slider
class SLIDER{
  constructor(obj){
    this.slider = obj.slider
    this.sliderList = this.slider.querySelector('.slider-list')
    this.sliderItems = this.slider.querySelectorAll('.slider-list__slide')
    this.prevBtn = this.slider.querySelector('.prev')
    this.nextBtn = this.slider.querySelector('.next')
    this.activeSlide = 0
    this.timeMove = 1000
    this.dir = obj.direction
    this.moveSlide = 100
    this.interval = obj.interval
    this.createDots = obj.dots
    this.play = obj.autoplay
    
    this.sliderItems.forEach((slide, key)=>{
      if(key != this.activeSlide){
        slide.style.transform = `translate${this.dir}(${this.moveSlide}%)`
      }
      if(key == this.sliderItems.length - 1){
        slide.style.transform = `translate${this.dir}(${-this.moveSlide}%)`
      }
    })
    // dots
    if(this.createDots == true){
      const ul = document.createElement('ul')
      ul.classList.add('slider-dots')
      this.sliderItems.forEach(()=>{
        const li = document.createElement('li')
        ul.append(li)
      })
      this.slider.append(ul);
      this.sliderDots =  this.slider.querySelectorAll('.slider-dots li')
      this.sliderDots[this.activeSlide].classList.add('active')
      this.sliderDots.forEach((dot, key)=>{
        dot.addEventListener('click', ()=>{this.controllers(key)})
      })
      this.active = true
    }
    // autoplay
    if(this.play == true){
      let autoPlay = setInterval(()=>{
        this.move(this.nextBtn)
      }, this.interval);
      this.slider.addEventListener('mouseenter', ()=>{
        clearInterval(autoPlay)
      })
      this.slider.addEventListener('touchstart', ()=>{
        clearInterval(autoPlay)
      })
      this.slider.addEventListener('mouseleave', ()=>{
        autoPlay = setInterval(()=>{
          this.move(this.nextBtn)
        }, this.interval);
      })
    }
    if(this.nextBtn != null && this.prevBtn != null){
      this.prevBtn.addEventListener('click', ()=>{this.move(this.prevBtn)})
      this.nextBtn.addEventListener('click', ()=>{this.move(this.nextBtn)})
    }
    this.touchSlide = true
    this.slider.addEventListener('touchmove', (e)=>{this.touchMove(e)})
  }
  move(btn = null){
    if(this.nextBtn != null && this.prevBtn != null){
      this.prevBtn.disabled = true
      this.nextBtn.disabled = true
      setTimeout(() => {
        this.prevBtn.disabled = false
        this.nextBtn.disabled = false
      }, this.timeMove + 200);
    }
    let btnPrevOrNext
    if(btn == null){
      btnPrevOrNext = -this.moveSlide
    }else{
      btnPrevOrNext = btn == this.nextBtn ? -this.moveSlide : this.moveSlide;
    }
    this.sliderItems.forEach((slide, key)=>{
      if(key != this.activeSlide){
        slide.style.transform = `translate${this.dir}(${-btnPrevOrNext}%)`;
        slide.style.transition = '0ms'
      }
    })
    setTimeout(() => {
      this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(${btnPrevOrNext}%)`;
      this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`;
      if(this.createDots == true){this.sliderDots[this.activeSlide].classList.remove('active')}
      if(btn == this.nextBtn){
        this.activeSlide++
        if(this.activeSlide > this.sliderItems.length - 1){
          this.activeSlide = 0
        }
      }else if(btn == this.prevBtn){
        this.activeSlide--
        if(this.activeSlide < 0){
          this.activeSlide = this.sliderItems.length - 1
        }
      }
      this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(0%)`;
      this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`;
      if(this.createDots == true){this.sliderDots[this.activeSlide].classList.add('active')}
    }, 100);
  }
  controllers(dotKey){
    if(this.active && dotKey != this.activeSlide){
      this.sliderItems.forEach((slide, key)=>{
        slide.style.transition = '0ms'
      })
      this.active = false
      if(this.nextBtn != null && this.prevBtn != null){
        this.prevBtn.disabled = true
        this.nextBtn.disabled = true
      }
      let dotLeftOrRight = dotKey > this.activeSlide ? -this.moveSlide : this.moveSlide;
      this.sliderDots.forEach((dot)=>{dot.classList.remove('active')})
      this.sliderItems[dotKey].style.transform = `translate${this.dir}(${-dotLeftOrRight}%)`
      
      setTimeout(() => {
        this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(${dotLeftOrRight}%)`
        this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`
        this.sliderDots[this.activeSlide].classList.remove('active')
        this.activeSlide = dotKey
        this.sliderItems[this.activeSlide].style.transform = `translate${this.dir}(0%)`
        this.sliderItems[this.activeSlide].style.transition = `${this.timeMove}ms`
        this.sliderDots[this.activeSlide].classList.add('active')
      }, 100);
      setTimeout(() => {
        this.active = true
        if(this.nextBtn != null && this.prevBtn != null){
          this.prevBtn.disabled = false
          this.nextBtn.disabled = false
        }
      }, this.timeMove + 200);
    }
  }
  touchMove(e){
    if(this.touchSlide){
      this.touchSlide = false
      if(this.slider.clientWidth / 2 < e.touches[0].pageX){
        this.move(this.nextBtn)
      }else{
        this.move(this.prevBtn)
      }
      setTimeout(() => {
        this.touchSlide = true
      }, this.timeMove + 200);
    }
  }
}

const sliders = document.querySelectorAll('.slider')
for(const slider of sliders){
  const autoplay = slider.hasAttribute('autoplay') ? true : false;
  const createDots = slider.hasAttribute('create-dots') ? true : false;
  const direction = slider.getAttribute('direction') == 'Y' || slider.getAttribute('direction') == 'y' ? 'Y' : 'X';
  const interval = slider.getAttribute('interval') >= 2000 ? Number(slider.getAttribute('interval')) : 2000;
  new SLIDER({
    slider: slider,
    direction: direction,
    dots: createDots,
    autoplay: autoplay,
    interval: interval,
  })
}