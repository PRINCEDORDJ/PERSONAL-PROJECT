let menuicon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar')

menuicon.addEventListener('click', ()=>{
     menuicon.classList.toggle('bx-x');
    navbar.classList.toggle('active')
})

let btn = document.getElementById('submit')
btn.addEventListener('click', ()=>{
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const message = document.getElementById('message').value

    if(email !== '' && name !=='' && message !== ''){
        
         localStorage.setItem('name', name)
    localStorage.setItem('email', email)
    localStorage.setItem('message', message)

    window.location.href = 'index.html'
    }

   
})