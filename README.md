# Chinese Learn

This app gives numeric-notation pinyin flashcards for the top 11,000+ chinese words, sorted in frequency order.

A live version is hosted at [https://chinese-learn.daijin.dev/](https://chinese-learn.daijin.dev/).

## Features
- Word list and progress is saved client-side, allowing the app to function entirely offline.
- Flash cards validate your answers as typed using numeric-notation pinyin, so you know if you got it right.
- Easily deploy this app to your own VPS.
- App can use LLM to generate sentences for words, with a clever caching algorithm. You need to provide an OpenAI compatible key in the .env file (see .env.example).

## Developer instructions

```bash
# Develop - spin up a local frontend (vite) and backend (express)
npm run dev

# Build docker and deploy it wherever
docker build . -t chinese-learn
docker run -p 3000:3000 chinese-learn
```

## Credits
Word data is sourced from https://github.com/drkameleon/complete-hsk-vocabulary and cleaned up using scripts in the `get-word-list` directory.