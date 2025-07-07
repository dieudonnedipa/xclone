import { API_URL, createTweetElement } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {

    const formatDateJoined = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return `A rejoint en ${date.toLocaleDateString('fr-FR', options)}`;
    };

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    if (!userId) {
        document.body.innerHTML = '<h1>Erreur : ID utilisateur manquant.</h1>';
        return;
    }

    const displayUserProfile = (user) => {
        document.title = `${user.name} (@${user.username}) / X`;
        document.getElementById('header-profile-name').textContent = user.name;
        document.getElementById('profile-avatar').style.backgroundImage = `url('${user.profilePicture}')`;
        document.getElementById('details-profile-name').textContent = user.name;
        document.getElementById('details-profile-username').textContent = `@${user.username}`;
        document.getElementById('details-profile-bio').textContent = user.bio || "Ce compte n'a pas encore de bio.";
        
        const metaContainer = document.getElementById('details-profile-meta');
        metaContainer.innerHTML = '';
        if (user.location) metaContainer.innerHTML += `<div class="meta-item"><span>${user.location}</span></div>`;
        if (user.website) metaContainer.innerHTML += `<div class="meta-item"><a href="${user.website}" target="_blank" rel="noopener noreferrer">${user.website.replace(/https?:\/\//, '')}</a></div>`;
        metaContainer.innerHTML += `<div class="meta-item"><span>${formatDateJoined(user.createdAt)}</span></div>`;
        
        document.getElementById('following-count').textContent = user.following;
        document.getElementById('followers-count').textContent = user.followers;
    };
    
    const displayUserTweets = (tweets, author) => {
        const tweetsContainer = document.getElementById('tweets-section');
        tweetsContainer.innerHTML = '';
        document.getElementById('header-tweets-count').textContent = `${tweets.length} Tweet${tweets.length > 1 ? 's' : ''}`;

        if (tweets.length === 0) {
            tweetsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: #71767b;">Cet utilisateur n\'a pas encore tweeté.</p>';
            return;
        }

        tweets.forEach(tweet => {
            const tweetEl = createTweetElement(tweet, author);
            tweetsContainer.appendChild(tweetEl);
        });
    };

    try {
        const [userResponse, tweetsResponse] = await Promise.all([
            fetch(`${API_URL}/users/${userId}`),
            fetch(`${API_URL}/tweets?userId=${userId}&_sort=createdAt&_order=desc`)
        ]);

        if (!userResponse.ok) throw new Error('Utilisateur non trouvé');
        
        const user = await userResponse.json();
        const tweets = await tweetsResponse.json();
        
        displayUserProfile(user);
        displayUserTweets(tweets, user);

    } catch (error) {
        console.error("Erreur lors du chargement de la page de profil:", error);
        document.querySelector('.main-content').innerHTML = `<h1>Profil non trouvé</h1><p>${error.message}</p>`;
    }
});