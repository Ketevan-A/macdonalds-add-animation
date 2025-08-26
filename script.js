//constant elements
const els = {
  burger: document.querySelector('.burger'),
  belowText: document.querySelector('.main-text'),
  logo: document.querySelector('.logo'),
  txt1: document.querySelector('.text-1'),
  txt2: document.querySelector('.text-2'),
  x: document.querySelector('.X'),
  mce: document.querySelector('.mce'),
  storer: document.querySelector('.stoerer-cropped'),
  balls: document.querySelectorAll('.burger-cover > div'),
  mainLogo: document.querySelector('.main-logo'),
  mceX: document.querySelector('.mceX'),
  final: document.querySelector('.final'),
  aboveText: document.querySelector('.above-text'),
  background: document.querySelector('.background'),
};

//for getting time duration of animation
let globalStartTime;

//burger starts sliding from here
let left = -1000;
let firstShown = false;

//helper fade in and fade out functions 
function fadeIn(el, duration = 500) {

  el.style.transition = `opacity ${duration}ms ease`;
  el.style.opacity = 1;
}

function fadeOut(el, duration = 500) {

  el.style.transition = `opacity ${duration}ms ease`;
  el.style.opacity = 0;
}




// ===== Phase 1: Burger Slide-In =====

//begining of burger slide aimation
function animateBurger() {

    let startLeft = -1000;
    let endLeft = -500;
    let opacity = 0;


    if (left < -500) {
        
        //burger slide algorithm
        left += 8;
        opacity = (left - startLeft) / (endLeft - startLeft );
        els.burger.style.left = left + 'px';
        els.burger.style.opacity = opacity;
        els.belowText.style.opacity = opacity ;
        els.logo.style.opacity = opacity ;

        //after burger ishalfway in the frame
        //other text starts appearing
        if (left > -600 && !firstShown) animateText();
        
        requestAnimationFrame(animateBurger);

    } else {

        // stop burger at final position and make it fully visible
        els.burger.style.left = '-500px';
        els.burger.style.opacity = 1;
        els.logo.style.opacity = 1;
        els.belowText.style.opacity = 1;

    }
}




// ===== Phase 2: Text Reveal =====

//above burger texts animation
function animateText() {


    els.txt1.classList.add("show");
    els.txt1.style.opacity = 1;
    firstShown = true;

    setTimeout(() => {

        fadeIn(els.txt2, 500);
        
        //after a pause calling other
        //  text animation functions
        // giving them each other
        //  as callback functions
        setTimeout(() => {

            fadeOutTogether(rotateX(storerAnimation));

        }, 1500); 
        
    }, 800);
}




// ===== Phase 3: Logo + X Rotation =====

//second texts X's rotation
//and mce text appears 
function rotateX(callBack){

    let angle = 0;
    let scale = 0.01;
    let grown = false;
    let textAngle = 270;
    let opacity = 0;

    //recursive function for rotation
    function helper(){
        els.x.style.opacity = 1;

        if(!grown){
            angle += 8;
            scale += 0.02;
            
            //text rotation
            mceRotate();

            //done with rotation
            if(angle >= 360 || scale >= 1){
                angle = 360;
                scale = 1;
                grown = true; 
            } 

            //rotationg and scaling
            //  it at the same time
            els.x.style.transform = `translateX(82%) rotate(${angle}deg) scale(${scale}) `;
        }else{

            //start with next animation after 1 s
            if(callBack){
                setTimeout(()=>{
                    callBack();
                }, 1000);
            }
            return;
        }
        requestAnimationFrame(helper);

    }

    //helper function for text rotation
    function mceRotate(){
        if(angle>=320){
            textAngle +=18;
            opacity += 0.2;

            els.mce.style.transform = `rotateY(${textAngle}deg)`;
            els.mce.style.opacity = opacity;
        }
    }
    requestAnimationFrame(helper);
}





// ===== Phase 4: Storer Scaling =====

//storer scaling animation
function storerAnimation() {
    let scale = 0.04;
    let growing = true;

    //helper function for growing
    function helper() {
        if (growing) {

            scale += (1.1 - scale) * 0.08; 
            if (scale >= 1.09) {
                growing = false; 
            }
        } else {

            //if growing is done
            scale += (1 - scale) * 0.1;
            //make it little bitbigger but then 
            //go down to scale one for bop effect
            if (Math.abs(scale - 1) < 0.001) {
                scale = 1;
                els.storer.style.transform = `scale(${scale})`;
                els.storer.style.opacity = 1;
                
                //after 0.5s start transition
                //  to final composition
                setTimeout(() => {
                    coverBurger();
                }, 500);
                return; 
            }
        }

        els.storer.style.transform = `scale(${scale})`;
        els.storer.style.opacity = 1;
        requestAnimationFrame(helper);
    }

    requestAnimationFrame(helper);
}

//fade out first text together 
// and then start with another animation
function fadeOutTogether(callBack) {
        fadeOut(els.txt1, 500);
        fadeOut(els.txt2, 500);
        if(callBack)callBack();
}






// ===== Phase 5: Final Cover Transition =====

//transition to final 
// composition and cover
//  burger with balls
function coverBurger() {

    els.balls.forEach(ball => {

        ball.style.animationPlayState = "running"; 

    });

    //make texts that are
    //  not final dissapear 
    setTimeout(() => {
        els.final.style.opacity = 1;
        els.mainLogo.classList.add('show');
        els.aboveText.style.opacity = 0;
        els.background.style.opacity = 0;

    }, 2000);

    //after final big logo is loaded
    els.mainLogo.addEventListener('transitionend', (e) =>{

        if(e.propertyName === 'clip-path'){
                //let final text below logo appear
                fadeIn(els.mceX, 1000);
                

                // fade everything out after 
                // final logo reveal
                //  (end of animation sequence) <------ FINAL
                setTimeout(()=>{
                    fadeOut(els.final, 1000);
                    fadeOut(els.belowText, 1000);

                    //duration time in console
                    let globalEndTime = performance.now();
                    console.log("Total animation time:", ((globalEndTime - globalStartTime)/1000).toFixed(2), "seconds");

                },2000);
        }
    })

}


//start animation after 
// loading the page <------ START 
window.onload = () => {
        globalStartTime = performance.now();
        animateBurger();
    
}
