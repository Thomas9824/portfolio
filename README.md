# Portfolio Personnel

Un portfolio moderne et responsive construit avec Next.js 14, TypeScript et Tailwind CSS.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides et interactives
- **Lucide React** - Icônes modernes et élégantes

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## ⚡ Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🎨 Personnalisation

### Informations personnelles
Modifiez les fichiers suivants pour personnaliser votre portfolio :

- `components/Hero.tsx` - Nom, titre et description principale
- `components/About.tsx` - Compétences et présentation
- `components/Projects.tsx` - Vos projets et réalisations
- `components/Contact.tsx` - Informations de contact

### Couleurs et styles
- Modifiez `tailwind.config.js` pour personnaliser les couleurs
- Ajustez `app/globals.css` pour les animations et styles personnalisés

## 📁 Structure du projet

```
portfolio-final/
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Page d'accueil
│   └── globals.css     # Styles globaux
├── components/
│   ├── Hero.tsx        # Section héro
│   ├── About.tsx       # Section à propos
│   ├── Projects.tsx    # Section projets
│   └── Contact.tsx     # Section contact
├── public/             # Assets statiques
└── ...
```

## 🚀 Déploiement

### Vercel (Recommandé)
1. Poussez votre code sur GitHub
2. Connectez votre repository à [Vercel](https://vercel.com)
3. Déployez automatiquement

### Build local
```bash
npm run build
npm start
```

## 📝 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm start` - Lance l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint

## 🎯 Fonctionnalités

- ✅ Design responsive et moderne
- ✅ Animations fluides avec Framer Motion
- ✅ Mode sombre intégré
- ✅ Optimisé pour les performances
- ✅ SEO friendly
- ✅ TypeScript pour une meilleure qualité de code

## 🤝 Contribution

N'hésitez pas à fork ce projet et à l'adapter selon vos besoins !

## 📄 Licence

MIT License - vous êtes libre d'utiliser ce code pour vos projets personnels. 