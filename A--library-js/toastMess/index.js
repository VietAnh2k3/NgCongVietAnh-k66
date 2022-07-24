const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const successBtn = document.querySelector('.btnSuccess');
const errorBtn = document.querySelector('.btnError');
const toasts = document.querySelector('.toast');


function toast(type ,mess,title,duration){
    
    var toastIteam = document.createElement('div')
    const icons = {
        success:'fa-solid fa-circle-check',
        error:'fa-solid fa-circle-exclamation'
    }
    const colors = {
        success:'rgb(10, 212, 10)',
        error:'rgb(205, 223, 46)'
    }


    const icon = icons[type];
    const color = colors[type];
    const delay = (duration/1000).toFixed(2);
   
    toastIteam.classList.add('toast-noti',`${type}`)

    toastIteam.style.animation = `slideout linear .5s , fadeOut linear .3s ${delay}s forwards `;

    toastIteam.innerHTML = `
    <div class="toast-icon">
        <i class="${icon}" style='color:${color}'></i>
    </div>
    <div class="toast-content">
        <h3 class="toast-content_header" >${title}</h3>
        <p class="toast-content_des">${mess}</p>
    </div>
    <div class="toast-delete">
        <i class="fa-solid fa-xmark"></i>
    </div>
    `;

    
    toastIteam.onclick = function(e){
        if(e.target.closest('.toast-delete')){
            
            toasts.removeChild(toastIteam); 
            clearTimeout(autoRemove);
        }
    }

    const autoRemove = setTimeout(function(){
        toasts.removeChild(toastIteam); 
    },duration + 300)

    toasts.appendChild(toastIteam); 


    
}

successBtn.onclick = function(){
    toast(type = 'success',mess="thanh cong",title='success',duration = 3000);
}

errorBtn.onclick = function(){
    toast(type = 'error',mess="toi that bai roi",title='error',duration = 3000);
}


