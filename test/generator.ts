import CLI from '../src/lib/cli';
type StructureType = {
  root: string,
  structure: any,
}

new CLI({
    module: {
      root: './test',
      structure: {
        name: '[name:lowerCase]',
        children: [
          {
            type: 'directory',
            name: 'components',
          },
          {
            type: 'file',
            name: 'index.vue',
            content: `<template>\n  <div class="[name:lowerCase]-container">\n    <h1 class="[name:lowerCase]-container__title">{{ title }} index page</h1>\n  </div>\n</template>\n<script lang="ts">\nimport { defineComponent } from '@nuxtjs/composition-api'\nimport setup from './[name:lowerCase]';\n\nexport default defineComponent({\n  setup,\n})\n</script>\n<style lang="scss" scoped>\n@import './[name:lowerCase].scss';\n</style>\n`
          },
          {
            type: 'file',
            name: '[name:lowerCase].ts',
            content: `import { ref } from '@nuxtjs/composition-api';\n\nexport default () => { // (props, { emit, ... })\n  const title = ref('[name]');\n  return {\n    title,\n  }\n}\n`
          },
          {
            type: 'file',
            name: '[name:lowerCase].scss',
            content: `.[name:lowerCase]-container {\n  $self: &;\n  &::v-deep {\n    #{$self}__title {\n      color: $color-primary;\n    }\n  }\n}\n`
          },
          {
            type: 'file',
            name: '[name:lowerCase].service.ts',
            content: `\nimport { NuxtAxiosInstance } from '@nuxtjs/axios/types'\n\nexport default ($axios: NuxtAxiosInstance) => ({})\n`
          },
        ]
      },
      options: {
        '--no-components': async (body: StructureType) => {
          body.structure.children.shift();
          return body;
        }
      }
    }
});
