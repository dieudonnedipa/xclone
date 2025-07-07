const fs = require('fs');
const path = require('path');

// Création du dossier database s'il n'existe pas
const databaseDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
    console.log('✅ Dossier database créé');
}

// Données initiales pour l'API
const initialData = {
    users: [
        {
            id: 1,
            name: "Alice Martin",
            username: "alice_martin",
            email: "alice.martin@example.com",
            password: "password123",
            phone: "+33 123 456 789",
            profilePicture: "https://i.pravatar.cc/150?img=1",
            bio: "Développeuse frontend passionnée par React et l'UX design. Aime le café et les voyages.",
            location: "Paris, France",
            website: "https://alice-martin.dev",
            createdAt: "2023-09-15T10:30:00Z",
            followers: 450,
            following: 320
        },
        {
            id: 2,
            name: "John DOE",
            username: "johndoe",
            email: "john.doe@example.com",
            password: "password123",
            phone: "+33 123 456 789",
            profilePicture: "https://i.pravatar.cc/150?img=2",
            bio: "Développeur passionné par le web et les API.",
            location: "Paris, France",
            website: "https://johndoe.com",
            createdAt: "2023-10-02T09:00:00Z",
            followers: 200,
            following: 180
        },
        {
            id: 3,
            name: "Sophie Dubois",
            username: "sophie_dev",
            email: "sophie.dubois@example.com",
            password: "securepass456",
            phone: "+33 987 654 321",
            profilePicture: "https://i.pravatar.cc/150?img=3",
            bio: "Full-stack developer | Tech enthusiast | Coffee lover ☕",
            location: "Lyon, France",
            website: "https://sophie-dev.fr",
            createdAt: "2023-08-20T14:15:00Z",
            followers: 680,
            following: 245
        },
        {
            id: 4,
            name: "Marc Leblanc",
            username: "marc_tech",
            email: "marc.leblanc@example.com",
            password: "mypassword789",
            phone: "+33 555 123 456",
            profilePicture: "https://i.pravatar.cc/150?img=4",
            bio: "DevOps Engineer | Cloud Architecture | Open Source contributor",
            location: "Marseille, France",
            website: "https://marctech.blog",
            createdAt: "2023-07-10T16:45:00Z",
            followers: 1200,
            following: 400
        }
    ],
    tweets: [
        {
            id: 1,
            userId: 1,
            content: "Bonjour le monde ! Premier tweet sur ce nouveau clone de Twitter 🚀",
            media: [
                {
                    type: "image",
                    url: "https://picsum.photos/400/300?random=1"
                }
            ],
            likes: 25,
            retweets: 8,
            replies: [2, 3],
            createdAt: "2023-10-01T12:00:00Z",
            replyTo: null
        },
        {
            id: 2,
            userId: 2,
            content: "@alice_martin Bienvenue sur Twitter ! J'espère que tu vas aimer l'expérience 😊",
            media: [],
            likes: 15,
            retweets: 3,
            replies: [],
            createdAt: "2023-10-01T12:30:00Z",
            replyTo: 1
        },
        {
            id: 3,
            userId: 3,
            content: "@alice_martin Super ! J'ai hâte de voir tes prochains tweets sur le dev frontend 💻",
            media: [],
            likes: 8,
            retweets: 1,
            replies: [],
            createdAt: "2023-10-01T13:00:00Z",
            replyTo: 1
        },
        {
            id: 4,
            userId: 3,
            content: "Journée productive ! J'ai enfin terminé ce projet React avec TypeScript. Les hooks custom sont vraiment puissants 🔥",
            media: [
                {
                    type: "image",
                    url: "https://picsum.photos/400/300?random=2"
                }
            ],
            likes: 42,
            retweets: 12,
            replies: [5, 6],
            createdAt: "2023-10-01T18:20:00Z",
            replyTo: null
        },
        {
            id: 5,
            userId: 4,
            content: "@sophie_dev Félicitations ! TypeScript + React = combo parfait 👌",
            media: [],
            likes: 18,
            retweets: 2,
            replies: [],
            createdAt: "2023-10-01T19:00:00Z",
            replyTo: 4
        },
        {
            id: 6,
            userId: 1,
            content: "@sophie_dev Peux-tu partager quelques tips sur les hooks custom ? Je suis curieuse !",
            media: [],
            likes: 12,
            retweets: 1,
            replies: [],
            createdAt: "2023-10-01T19:15:00Z",
            replyTo: 4
        },
        {
            id: 7,
            userId: 4,
            content: "Petit rappel : toujours tester vos APIs avant de les déployer en production ! Une erreur 500 en prod, c'est jamais fun 😅",
            media: [],
            likes: 67,
            retweets: 23,
            replies: [8],
            createdAt: "2023-10-02T08:45:00Z",
            replyTo: null
        },
        {
            id: 8,
            userId: 2,
            content: "@marc_tech Tellement vrai ! Les tests automatisés sont nos meilleurs amis 🤖",
            media: [],
            likes: 28,
            retweets: 5,
            replies: [],
            createdAt: "2023-10-02T09:30:00Z",
            replyTo: 7
        },
        {
            id: 9,
            userId: 1,
            content: "Pause café ☕ et réflexion sur l'architecture de mon prochain projet. Micro-services ou monolithe ? 🤔",
            media: [
                {
                    type: "image",
                    url: "https://picsum.photos/400/300?random=3"
                }
            ],
            likes: 34,
            retweets: 7,
            replies: [10],
            createdAt: "2023-10-02T14:20:00Z",
            replyTo: null
        },
        {
            id: 10,
            userId: 4,
            content: "@alice_martin Ça dépend de la complexité ! Pour débuter, un monolithe bien structuré peut suffire 💡",
            media: [],
            likes: 19,
            retweets: 4,
            replies: [],
            createdAt: "2023-10-02T15:00:00Z",
            replyTo: 9
        },
        {
            id: 11,
            userId: 3,
            content: "Weekend code ! Je travaille sur un petit projet perso avec Vue.js 3 et Pinia. L'écosystème Vue devient de plus en plus mature 🌟",
            media: [],
            likes: 45,
            retweets: 11,
            replies: [],
            createdAt: "2023-10-02T16:30:00Z",
            replyTo: null
        },
        {
            id: 12,
            userId: 2,
            content: "Nouvelle version de l'API déployée ! 🎉 Amélioration des performances et ajout de nouveaux endpoints. Documentation mise à jour.",
            media: [],
            likes: 52,
            retweets: 15,
            replies: [],
            createdAt: "2023-10-02T20:00:00Z",
            replyTo: null
        }
    ]
};

// Écriture du fichier db.json
const dbPath = path.join(databaseDir, 'db.json');
fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));

console.log('✅ Fichier db.json créé avec succès !');
console.log('📊 Données initiales :');
console.log(`   - ${initialData.users.length} utilisateurs`);
console.log(`   - ${initialData.tweets.length} tweets`);
console.log('');
console.log('🚀 Vous pouvez maintenant lancer le serveur avec :');
console.log('   npm run server');
console.log('');
console.log('📖 API disponible sur : http://localhost:3000');
console.log('   - Utilisateurs : http://localhost:3000/users');
console.log('   - Tweets : http://localhost:3000/tweets');
