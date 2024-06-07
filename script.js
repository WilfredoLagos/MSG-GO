document.addEventListener('DOMContentLoaded', () => {
    const addContactBtn = document.getElementById('addContactBtn');
    const contactList = document.getElementById('contactList');
    const editContactModal = document.getElementById('editContactModal');
    const addContactModal = document.getElementById('addContactModal');
    const closeModal = document.querySelectorAll('.close');
    const editContactForm = document.getElementById('editContactForm');
    const addContactForm = document.getElementById('addContactForm');
    const toggleFavoritesBtn = document.getElementById('bubbly-button');
    const favoritesList = document.getElementById('favoritesList');

    let contacts = [];
    let favorites = [];

    addContactBtn.addEventListener('click', () => {
        addContactModal.style.display = 'block';
    });

    closeModal.forEach(close => {
        close.addEventListener('click', () => {
            editContactModal.style.display = 'none';
            addContactModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === editContactModal || event.target === addContactModal) {
            editContactModal.style.display = 'none';
            addContactModal.style.display = 'none';
        }
    });

    addContactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('addName').value;
        const phone = document.getElementById('addPhone').value;
        const email = document.getElementById('addEmail').value;
        
        if (name && phone && email) {
            if (contactExists(phone)) {
                alert('Un contacto con este número ya existe.');
            } else {
                contacts.push({ name, phone, email });
                renderContacts();
                addContactForm.reset();
                addContactModal.style.display = 'none';
            }
        }
    });

    contactList.addEventListener('click', (event) => {
        if (event.target.matches('.edit')) {
            const index = event.target.dataset.index;
            openEditModal(index);
        } else if (event.target.matches('.delete')) {
            const index = event.target.dataset.index;
            if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
                removeContact(index);
            }
        } else if (event.target.matches('.star')) {
            const index = event.target.dataset.index;
            toggleFavorite(index);
        } else if (event.target.matches('.whatsapp')) {
            const phone = event.target.dataset.phone;
            window.open(`https://web.whatsapp.com/send?phone=${phone}`, '_blank');
        } else if (event.target.matches('.email-icon')) {
            const email = event.target.parentElement.dataset.email;
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
        } else if (event.target.matches('.menu-button')) {
            const menu = event.target.nextElementSibling;
            closeAllMenus();
            menu.style.display = 'block';
        } else {
            closeAllMenus();
        }
    });

    toggleFavoritesBtn.addEventListener('click', () => {
        favoritesList.style.display = favoritesList.style.display === 'block' ? 'none' : 'block';
    });

    favoritesList.addEventListener('click', (event) => {
        if (event.target.matches('.favorite-card')) {
            const phone = event.target.dataset.phone;
            window.open(`https://web.whatsapp.com/send?phone=${phone}`, '_blank');
        } else if (event.target.matches('.remove-favorite')) {
            const index = event.target.dataset.index;
            favorites.splice(index, 1);
            renderFavorites();
        }
    });

    editContactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const index = editContactForm.dataset.index;
        const name = document.getElementById('editName').value;
        const phone = document.getElementById('editPhone').value;
        const email = document.getElementById('editEmail').value;

        const oldContact = contacts[index];
        contacts[index] = { name, phone, email };

        const favoriteIndex = favorites.findIndex(fav => fav.name === oldContact.name && fav.phone === oldContact.phone);
        if (favoriteIndex !== -1) {
            favorites[favoriteIndex] = contacts[index];
        }

        renderContacts();
        renderFavorites();
        editContactModal.style.display = 'none';
    });

    function openEditModal(index) {
        document.getElementById('editName').value = contacts[index].name;
        document.getElementById('editPhone').value = contacts[index].phone;
        document.getElementById('editEmail').value = contacts[index].email;
        editContactForm.dataset.index = index;
        editContactModal.style.display = 'block';
    }

    function renderContacts() {
        contactList.innerHTML = '';
        contacts.forEach((contact, index) => {
            const card = document.createElement('div');
            card.classList.add('contact-card');
            card.innerHTML = `
                <span>${contact.name} - ${contact.phone}</span>
                <span>${contact.email}</span>
                <div class="actions">
                    <span class="star" data-index="${index}">&#9733;</span>
                    <span class="whatsapp" data-phone="${contact.phone}">&#x1F4AC;</span>
                    <span class="email" data-email="${contact.email}"><i class="fas fa-envelope email-icon"></i></span>
                    <button class="menu-button"></button>
                    <ul class="menu">
                        <li><button class="edit" data-index="${index}">Editar</button></li>
                        <li><button class="delete" data-index="${index}">Eliminar</button></li>
                    </ul>
                </div>
            `;
            contactList.appendChild(card);
        });
    }

    function toggleFavorite(index) {
        const contact = contacts[index];
        const favoriteIndex = favorites.findIndex(fav => fav.name === contact.name && fav.phone === contact.phone);
        if (favoriteIndex === -1) {
            favorites.push(contact);
        } else {
            favorites.splice(favoriteIndex, 1);
        }
        renderFavorites();
    }

    function renderFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach((contact, index) => {
            const card = document.createElement('div');
            card.classList.add('favorite-card');
            card.innerHTML = `
                <span>${contact.name} - ${contact.phone}</span>
                <span>${contact.email}</span>
                <button class="remove-favorite" data-index="${index}">Eliminar de Favoritos</button>
            `;
            card.dataset.phone = contact.phone;
            favoritesList.appendChild(card);
        });
    }

    function closeAllMenus() {
        document.querySelectorAll('.menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    document.addEventListener('click', (event) => {
        if (!event.target.matches('.menu-button')) {
            closeAllMenus();
        }
    });

    function contactExists(phone) {
        return contacts.some(contact => contact.phone === phone);
    }

    function removeContact(index) {
        const contact = contacts[index];
        contacts.splice(index, 1);
        favorites = favorites.filter(fav => fav.name !== contact.name || fav.phone !== contact.phone);
        renderContacts();
        renderFavorites();
    }
});
