let menuicon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar')

menuicon.addEventListener('click', ()=>{
     menuicon.classList.toggle('bx-x');
    navbar.classList.toggle('active')
})

function showMessage(message, className) {
    const div = document.createElement('div');
    div.className = `message-popup ${className}`;
    div.appendChild(document.createTextNode(message));

    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        div.remove();
    };

    div.appendChild(closeButton);
    document.body.appendChild(div);

    setTimeout(() => {
        if (document.body.contains(div)) {
            div.remove();
        }
    }, 5000); // Auto-remove after 5 seconds
}

const supabaseClient = supabase.createClient(config.supabaseUrl, config.supabaseKey);

emailjs.init(config.emailjsPublicKey);

let btn = document.getElementById('submit')
btn.addEventListener('click', async ()=>{
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if(email !== '' && name !=='' && message !== ''){
        try {
            // Store in Supabase
            const { data, error } = await supabaseClient
                .from('Messages')
                .insert([{ name, email, message }]);

            if (error) {
                throw error;
            }

            // Send email via EmailJS
            await emailjs.send(config.emailjsServiceID, config.emailjsTemplateID, { name, email, message });

            showMessage('Your message has been sent successfully!', 'success');
            // Clear the form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';

        } catch (error) {
            console.error('Error:', error);
            let errorMessage = 'There was an error sending your message. Please try again.';
            if (error.message.includes('violates row-level security policy')) {
                errorMessage = 'Error: You are not authorized to perform this action.';
            } else if (error.message.includes('null value in column')) {
                errorMessage = 'Database error: A required field is missing.';
            }
            showMessage(errorMessage, 'error');
        }
    } else {
        showMessage('Please fill out all fields.', 'error');
    }
})