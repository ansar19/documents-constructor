# Typing Monkey

> A collection of templates for HSE documents.

### Writing templates

To create a template, create a file somewhere in `public/templates` and 
add an entry in `src/templates.json`. You may specify a license, a 
language and some tags.

### Translations

If you want to see the project translated in your language, let's say,
Esperanto, create `src/locales/eo.json` and put the translation strings
in it. Use another translation file as a base.

Edit all the translation files and add your locale in the `locale section`:

```json
  "locales": {
    "en": "English",
    "eo": "Esperanto",
    "fr": "Français"
  },
```

To finish, add the entry in the menu: edit `src/components/LocaleSelector.vue`
and add `eo` to the list of supported locales:

```js
  data () {
    return {
      locales: ['en', 'eo', 'fr'],
    }
  },
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```
