// js/feed.js

import { API_URL, createTweetElement } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    // --- Vérification de la connexion de l'utilisateur ---
    const currentUserId = localStorage.getItem('twitterCloneUserId');
    if (!currentUserId) {
        alert("Vous n'êtes pas connecté. Redirection vers la page de connexion.");
        window.location.href = 'index.html';
        return; // Arrête l'exécution du script si l'utilisateur n'est pas connecté
    }

    // --- Récupération des éléments du DOM ---
    const feedContainer = document.getElementById('feed');
    const composeForm = document.getElementById('compose-form');
    const composeTextarea = document.getElementById('composeTextarea');
    const composeSubmitBtn = document.getElementById('composeSubmit');
    const composeAvatar = document.getElementById('compose-avatar');
    const menuAvatar = document.getElementById('menu-avatar');
    const menuUserName = document.getElementById('menu-user-name');
    const menuUserUsername = document.getElementById('menu-user-username');
    const profileLink = document.getElementById('profile-link');
    const userProfileMenu = document.getElementById('user-profile-menu');
    const whoToFollowList = document.getElementById('who-to-follow-list');

    /**
     * Charge les tweets depuis l'API et les affiche dans le feed.
     * Utilise _expand=user pour inclure directement les données de l'auteur dans chaque tweet.
     */
    const loadTweets = async () => {
        feedContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Chargement des tweets...</p>';
        try {
            const response = await fetch(`${API_URL}/tweets?_sort=createdAt&_order=desc&_expand=user`);

            if (!response.ok) {
                throw new Error("Erreur de communication avec l'API. Vérifiez que le serveur est lancé.");
            }
            
            const tweetsWithAuthors = await response.json();
            feedContainer.innerHTML = ''; // Nettoie le conteneur

            if (tweetsWithAuthors.length === 0) {
                feedContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Aucun tweet à afficher pour le moment.</p>';
                return;
            }
            
            tweetsWithAuthors.forEach(tweet => {
                // `tweet.user` contient l'objet complet de l'auteur grâce à `_expand=user`
                if (tweet.user) {
                    const tweetEl = createTweetElement(tweet, tweet.user);
                    feedContainer.appendChild(tweetEl);
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement des tweets:', error);
            feedContainer.innerHTML = `<p style="text-align: center; padding: 2rem; color: #f91880;">${error.message}</p>`;
        }
    };

    /**
     * Charge les informations de tous les utilisateurs et configure l'interface (menu, "à suivre").
     */
    const loadUsersAndSetupUI = async () => {
        try {
            const usersResponse = await fetch(`${API_URL}/users`);
            if (!usersResponse.ok) throw new Error("Impossible de charger les utilisateurs.");
            
            const users = await usersResponse.json();
            const usersMap = new Map(users.map(user => [user.id, user]));

            setupCurrentUserUI(usersMap);
            loadWhoToFollow(usersMap);

        } catch (error) {
            console.error("Erreur lors de la configuration de l'interface utilisateur:", error);
            // On peut choisir d'afficher une erreur ou de simplement ne pas afficher ces sections
        }
    };

    /**
     * Met en place l'avatar, le nom, et les liens de l'utilisateur connecté.
     * @param {Map<number, object>} usersMap - La map des utilisateurs.
     */
    const setupCurrentUserUI = (usersMap) => {
        const user = usersMap.get(parseInt(currentUserId));
        if (!user) {
             console.error("Utilisateur connecté non trouvé !");
             localStorage.removeItem('twitterCloneUserId');
             window.location.href = 'index.html';
             return;
        }

        const profilePageUrl = `profile_x.html?id=${user.id}`;
        
        composeAvatar.style.backgroundImage = `url('${user.profilePicture}')`;
        menuAvatar.style.backgroundImage = `url('${user.profilePicture}')`;
        menuUserName.textContent = user.name;
        menuUserUsername.textContent = `@${user.username}`;
        
        profileLink.href = profilePageUrl;
        userProfileMenu.href = profilePageUrl;
    };

    /**
     * Affiche une liste de suggestions d'utilisateurs à suivre.
     * @param {Map<number, object>} usersMap - La map des utilisateurs.
     */
    const loadWhoToFollow = (usersMap) => {
        const usersToSuggest = Array.from(usersMap.values())
            .filter(user => user.id !== parseInt(currentUserId)) // Exclut l'utilisateur actuel
            .slice(0, 3); // Prend les 3 premiers

        whoToFollowList.innerHTML = '';
        usersToSuggest.forEach(user => {
            const item = document.createElement('div');
            item.className = 'follow-item';
            // Le lien entoure les infos de l'utilisateur, mais pas le bouton
            item.innerHTML = `
                <a href="profile_x.html?id=${user.id}" style="display: contents; text-decoration: none; color: inherit;">
                    <div class="follow-avatar" style="background-image: url('${user.profilePicture}')"></div>
                    <div class="follow-info">
                        <div class="user-name">${user.name}</div>
                        <div class="user-username">@${user.username}</div>
                    </div>
                </a>
                <button class="follow-btn">Suivre</button>
            `;
            item.querySelector('.follow-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche le clic de naviguer vers le profil
                alert(`Fonction "Suivre" pour ${user.name} à implémenter !`);
            });
            whoToFollowList.appendChild(item);
        });
    };

    // --- GESTION DE LA CRÉATION DE TWEET ---
    
    // Activer/désactiver le bouton de tweet en fonction du contenu
    composeTextarea.addEventListener('input', () => {
        composeSubmitBtn.disabled = composeTextarea.value.trim().length === 0;
    });

    // Soumission du formulaire de tweet
    composeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = composeTextarea.value.trim();
        if (!content) return;

        composeSubmitBtn.disabled = true;
        composeSubmitBtn.textContent = 'Envoi...';

        const newTweetData = {
            userId: parseInt(currentUserId),
            content: content,
            media: [],
            likes: 0,
            retweets: 0,
            replies: [],
            replyTo: null,
            createdAt: new Date().toISOString(),
            views: 0
        };

        try {
            const response = await fetch(`${API_URL}/tweets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTweetData),
            });
            
            if (!response.ok) throw new Error("Échec de la publication du tweet.");

            // Pas besoin de refaire un fetch, on peut reconstruire le tweet pour l'affichage
            const createdTweet = await response.json();

            // On doit récupérer l'auteur pour createTweetElement
            const userResponse = await fetch(`${API_URL}/users/${currentUserId}`);
            const author = await userResponse.json();
            
            const tweetElement = createTweetElement(createdTweet, author);
            feedContainer.prepend(tweetElement); // Ajoute le nouveau tweet en haut du feed

            composeTextarea.value = ''; // Vide le textarea
            composeSubmitBtn.disabled = true; // Redésactive le bouton

        } catch (error) {
            console.error("Erreur lors de la création du tweet:", error);
            alert(error.message);
        } finally {
            composeSubmitBtn.textContent = 'Tweeter';
        }
    });


    // --- DÉMARRAGE AU CHARGEMENT DE LA PAGE ---
    
    // On lance les deux chargements en parallèle pour une meilleure performance
    Promise.all([
        loadTweets(),
        loadUsersAndSetupUI()
    ]);
});