<template>
  <footer class="main-footer d-flex p-2 px-3 bg-white border-top">
    <div :class="[contained ? 'container' : 'container-fluid']">
      <div class="row">
        <ul class="nav">
          <li v-for="(item, idx) in menuItems" :key="idx" class="nav-item">
            <d-link class="nav-link" :to="item.to">
              {{ item.title }}
            </d-link>
          </li>
        </ul>
        <span class="copyright ml-auto my-auto mr-2">{{ copyright }} <a href="https://ecomarine.kz" target="_blank">EcoMarine.kz</a></span>
      </div>
    </div>
  </footer>
</template>

<script>
const defaultMenuItems = [
  // {
  //   title: 'Документация',
  //   to: 'help',
  // },
  {
    title: 'Про нас',
    to: 'about',
  },
]

export default {
  name: 'MainFooter',
  props: {
    /**
     * The footer menu items.
     */
    menuItems: {
      type: Array,
      default () {
        return defaultMenuItems
      },
    },
    /**
     * The copyright information.
     */
    copyright: {
      type: String,
      default: 'Copyright © 2018-2020',
    },
    /**
     * Whether the footer should be wrapped in a container, or not.
     */
    contained: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
