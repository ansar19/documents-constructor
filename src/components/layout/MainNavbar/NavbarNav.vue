<template>
  <d-navbar-nav class="border-left flex-row">
    <!-- <li class="nav-item border-right dropdown notifications">
      <a class="nav-link nav-link-icon text-center" v-d-toggle.notifications>
        <div class="nav-link-icon__wrapper">
          <i class="material-icons">&#xE7F4;</i>
          <d-badge pill theme="danger">2</d-badge>
        </div>
      </a>
      <d-collapse id="notifications" class="dropdown-menu dropdown-menu-small">
        <d-dropdown-item>
          <div class="notification__icon-wrapper">
            <div class="notification__icon">
              <i class="material-icons">&#xE6E1;</i>
            </div>
          </div>
          <div class="notification__content">
            <span class="notification__category">Analytics</span>
            <p>Your website’s active users count increased by <span class="text-success text-semibold">28%</span> in the last week. Great job!</p>
          </div>
        </d-dropdown-item>
        <d-dropdown-item href="#">
          <div class="notification__icon-wrapper">
            <div class="notification__icon">
              <i class="material-icons">&#xE8D1;</i>
            </div>
          </div>
          <div class="notification__content">
            <span class="notification__category">Sales</span>
            <p>Last week your store’s sales count decreased by <span class="text-danger text-semibold">5.52%</span>. It could have been worse!</p>
          </div>
        </d-dropdown-item>
        <d-dropdown-item class="notification__all text-center">View all Notifications</d-dropdown-item>
      </d-collapse>
    </li>-->
    <li class="nav-item dropdown">
      <a v-d-toggle.user-actions class="nav-link dropdown-toggle text-nowrap px-3">
        <img
          class="user-avatar rounded-circle mr-2"
          src="@/assets/images/avatars/0.jpg"
          alt="User Avatar">
        <span class="d-none d-md-inline-block">Екатерина Васильева</span>
      </a>
      <d-collapse id="user-actions" class="dropdown-menu dropdown-menu-small">
        <!-- <d-dropdown-item>
          <i class="material-icons">&#xE7FD;</i>
          <router-link to="user-profile-lite">
            Профиль
          </router-link>
        </d-dropdown-item> -->
      </d-collapse>
    </li>
  </d-navbar-nav>
</template>

<style>
.nav-link:hover {
  cursor: pointer;
}
</style>
<script>
// import authRepository from '@/repositories/authRepository';

export default {
  name: 'NavbarNav',
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    signedIn () {
      return localStorage.signedIn
    },
    // signOut() {
    //   authRepository.signOut();
    // },
  },
  created () {
    this.signedIn()
  },
}
</script>
