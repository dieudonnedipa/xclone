// --- CONFIGURATION ---
// ASSURE-TOI QUE CE PORT CORRESPOND À CELUI DE TON JSON-SERVER !
// Si ton serveur tourne sur le port 3001, mets 3001 ici.
export const API_URL = 'http://localhost:3000'; 

export const formatTimeAgo = (dateString) => {
    // ... (fonction inchangée)
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "a";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "j";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
};

export const createTweetElement = (tweet, author) => {
    if (!tweet || !author) {
        console.error("Données de tweet ou d'auteur manquantes", { tweet, author });
        return document.createElement('div'); // Retourne un élément vide pour ne pas planter
    }

    const tweetElement = document.createElement('div');
    tweetElement.classList.add('tweet');
    const authorLink = `profile_x.html?id=${author.id}`;
    
    const formatViews = (views) => {
        if (!views) return 0;
        if (views > 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views > 1000) return (views / 1000).toFixed(1) + 'k';
        return views;
    }
    
    // CODE DÉFENSIF : On utilise "|| 0" ou "|| []" pour éviter les erreurs si une propriété manque
    const repliesCount = tweet.replies?.length || 0;
    const retweetsCount = tweet.retweets || 0;
    const likesCount = tweet.likes || 0;
    const viewsCount = tweet.views || 0;

    tweetElement.innerHTML = `
        <a href="${authorLink}">
            <div class="tweet-avatar" style="background-image: url('${author.profilePicture}')"></div>
        </a>
        <div class="tweet-body">
            <div class="tweet-header">
                <a href="${authorLink}" class="tweet-author">${author.name}</a>
                <span class="tweet-username">@${author.username}</span>
                <span class="tweet-username">·</span>
                <span class="tweet-time">${formatTimeAgo(tweet.createdAt)}</span>
            </div>
            <div class="tweet-text">${tweet.content || ''}</div>
            ${tweet.media && tweet.media.length > 0 ? `<div class="tweet-media"><img src="${tweet.media[0].url}" class="tweet-image"></div>` : ''}
            <div class="tweet-actions">
                <button class="tweet-action reply" title="Répondre">
                    <svg viewBox="0 0 24 24"><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.795-7.8-7.795zm-1.486 16.245v-3.844c-3.25-.18-5.782-2.634-5.782-5.94 0-3.193 2.552-5.743 5.743-5.743h4.146c3.193 0 5.743 2.55 5.743 5.743s-2.55 5.743-5.743 5.743h-2.12z"></path></svg>
                    <span>${repliesCount > 0 ? repliesCount : ''}</span>
                </button>
                <button class="tweet-action retweet" title="Retweeter">
                    <svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46-4.432-4.14L1.8 3.88l2.7-2.7L4.5 0l2.7 1.18-2.7 2.7zm15 16.24l-4.432-4.14 1.364-1.46 4.432 4.14 1.336 1.46-2.7 2.7L19.5 24l-2.7-1.18 2.7-2.7zM18.16 6.5l-1.07-1.02-6.05 6.05-3.02-3.02-1.07 1.02 4.1 4.1 7.11-7.13z"></path></svg>
                    <span>${retweetsCount > 0 ? retweetsCount : ''}</span>
                </button>
                <button class="tweet-action like" title="J'aime">
                    <svg viewBox="0 0 24 24"><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></svg>
                    <span>${likesCount > 0 ? likesCount : ''}</span>
                </button>
                 <button class="tweet-action view" title="Vues">
                    <svg viewBox="0 0 24 24"><path d="M8.75 21V3h2.5v18h-2.5zM3.5 21V12h2.5v9h-2.5zm10.25 0V8h2.5v13h-2.5z"></path></svg>
                    <span>${viewsCount > 0 ? formatViews(viewsCount) : ''}</span>
                </button>
                <button class="tweet-action share" title="Partager">
                    <svg viewBox="0 0 24 24"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41L7.71 9.71 6.3 8.3l5.7-5.7zM21 15v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4H1v4c0 2.21 1.79 4 4 4h14c2.21 0 4-1.79 4-4v-4h-2z"></path></svg>
                </button>
            </div>
        </div>
    `;
    return tweetElement;
};